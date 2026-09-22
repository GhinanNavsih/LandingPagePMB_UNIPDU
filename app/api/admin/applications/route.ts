import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError } from "@/lib/admin-http";
import { listApplications } from "@/lib/application-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const requested = Number.parseInt(new URL(request.url).searchParams.get("limit") || "100", 10);
    const limit = Number.isFinite(requested) ? Math.min(Math.max(requested, 10), 200) : 100;
    const applications = await listApplications(limit);
    return NextResponse.json({ applications }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return apiError(error);
  }
}
