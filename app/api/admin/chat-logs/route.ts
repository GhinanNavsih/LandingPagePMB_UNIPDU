import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { apiError } from "@/lib/admin-http";
import { getChatLogs } from "@/lib/chat-logger";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get("limit") || "100", 10);
    const limit = isNaN(limitParam) ? 100 : Math.min(Math.max(limitParam, 10), 300);

    const analytics = await getChatLogs(limit);
    return NextResponse.json(analytics, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
