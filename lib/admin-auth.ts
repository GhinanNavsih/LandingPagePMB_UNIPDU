import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import { database, collections, firebaseAuth, webApiKey } from "./firebase-admin";

// Firebase Hosting forwards the __session cookie to the application.
export const SESSION_COOKIE = "__session";
export const SESSION_SECONDS = 60 * 60 * 24 * 5;
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function currentAdmin() {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) return null;
  const parts = session.split("~");
  if (parts.length !== 2) return null;
  let decoded;
  try { decoded = await firebaseAuth().verifySessionCookie(parts[0], true); }
  catch { return null; }
  const db = database();
  const [admin, storedSession] = await db.getAll(db.collection(collections.admins).doc(decoded.uid), db.collection(collections.sessions).doc(sessionHash(session)));
  if (!admin.exists || admin.data()?.active !== true) return null;
  const record = storedSession.data();
  if (!record || record.uid !== decoded.uid || record.expiresAt.toMillis() <= Date.now() || record.version !== (admin.data()?.sessionVersion ?? 0)) return null;
  return { uid: decoded.uid, email: decoded.email || admin.data()!.email };
}

const sessionHash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function createAdminSession(idToken: string, uid: string) {
  const signedCookie = await firebaseAuth().createSessionCookie(idToken, { expiresIn: SESSION_SECONDS * 1000 });
  const session = `${signedCookie}~${randomBytes(24).toString("base64url")}`;
  const db = database();
  await db.runTransaction(async tx => {
    const admin = await tx.get(db.collection(collections.admins).doc(uid));
    if (admin.data()?.active !== true) throw new HttpError(401, "Email atau kata sandi tidak sesuai.");
    tx.create(db.collection(collections.sessions).doc(sessionHash(session)), { uid, version: admin.data()?.sessionVersion ?? 0, expiresAt: Timestamp.fromMillis(Date.now() + SESSION_SECONDS * 1000) });
  });
  return session;
}

export async function revokeAdminSessions(uid: string) {
  const ref = database().collection(collections.admins).doc(uid);
  await database().runTransaction(async tx => {
    const admin = await tx.get(ref);
    tx.update(ref, { sessionVersion: (admin.data()?.sessionVersion ?? 0) + 1 });
  });
  await firebaseAuth().revokeRefreshTokens(uid);
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) throw new HttpError(401, "Sesi berakhir. Silakan masuk kembali.");
  return admin;
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expected || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new HttpError(403, "Permintaan tidak diizinkan.");
  }
}

// Shared Firestore counter survives instance changes and parallel requests.
export async function consumeLoginAttempt(email: string) {
  const ref = database().collection(collections.attempts).doc(createHash("sha256").update(email.toLowerCase()).digest("hex"));
  await database().runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    const previous = snapshot.data();
    const now = Date.now();
    const active = previous && previous.resetAt > now;
    if (active && previous.count >= 8) throw new HttpError(429, "Terlalu banyak percobaan. Coba lagi dalam 15 menit.");
    tx.set(ref, { count: active ? previous.count + 1 : 1, resetAt: active ? previous.resetAt : now + 15 * 60 * 1000 });
  });
}

export async function verifyPassword(email: string, password: string) {
  await consumeLoginAttempt(email);
  const authOrigin = process.env.FIREBASE_AUTH_EMULATOR_HOST
    ? `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com`
    : "https://identitytoolkit.googleapis.com";
  const response = await fetch(`${authOrigin}/v1/accounts:signInWithPassword?key=${encodeURIComponent(webApiKey())}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }), cache: "no-store",
  });
  if (!response.ok) throw new HttpError(401, "Email atau kata sandi tidak sesuai.");
  return await response.json() as { idToken: string; localId: string };
}

export function sessionCookieOptions() {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_SECONDS };
}
