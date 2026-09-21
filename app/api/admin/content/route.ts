import { NextResponse } from "next/server";
import { z } from "zod";
import { checkOrigin, requireAdmin } from "@/lib/admin-auth";
import { getContent, saveContent } from "@/lib/content-store";
import { contentSchema } from "@/lib/content-schema";
import { apiError, readJson } from "@/lib/admin-http";

export const dynamic = "force-dynamic";
export async function GET() {
  try { await requireAdmin(); return NextResponse.json(await getContent(), { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try {
    checkOrigin(request);
    const admin = await requireAdmin();
    const data = z.object({ content: contentSchema, version: z.number().int().nonnegative() }).strict().parse(await readJson(request));
    return NextResponse.json(await saveContent(data.content, data.version, admin.email));
  } catch (error) { return apiError(error); }
}
