import { NextResponse } from "next/server";
import { checkOrigin, currentAdmin, revokeAdminSessions, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin-auth";
import { apiError } from "@/lib/admin-http";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const admin = await currentAdmin();
    if (admin) await revokeAdminSessions(admin.uid);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (error) { return apiError(error); }
}
