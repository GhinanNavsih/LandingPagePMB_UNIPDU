import { NextResponse } from "next/server";
import { z } from "zod";
import { checkOrigin, requireAdmin, verifyPassword, revokeAdminSessions, SESSION_COOKIE, sessionCookieOptions, HttpError } from "@/lib/admin-auth";
import { firebaseAuth } from "@/lib/firebase-admin";
import { apiError, readJson } from "@/lib/admin-http";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const admin = await requireAdmin();
    const body = z.object({ currentPassword: z.string().min(1).max(256), newPassword: z.string().min(10, "Minimal 10 karakter").max(256) }).parse(await readJson(request));
    const credentials = await verifyPassword(admin.email, body.currentPassword);
    if (credentials.localId !== admin.uid) throw new HttpError(403, "Akun tidak sesuai.");
    await firebaseAuth().updateUser(admin.uid, { password: body.newPassword });
    await revokeAdminSessions(admin.uid);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (error) { return apiError(error); }
}
