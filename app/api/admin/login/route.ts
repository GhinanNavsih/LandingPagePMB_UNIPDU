import { NextResponse } from "next/server";
import { z } from "zod";
import { checkOrigin, verifyPassword, createAdminSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin-auth";
import { apiError, readJson } from "@/lib/admin-http";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const { email, password } = z.object({ email: z.string().trim().email().max(254).transform(value => value.toLowerCase()), password: z.string().min(1).max(256) }).parse(await readJson(request));
    const credentials = await verifyPassword(email, password);
    const session = await createAdminSession(credentials.idToken, credentials.localId);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, session, sessionCookieOptions());
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) { return apiError(error); }
}
