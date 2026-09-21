import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./admin-auth";
import { ContentConflict } from "./content-store";

export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "Gunakan format JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Data tidak ditemukan.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 250000) { await reader.cancel(); throw new HttpError(413, "Konten terlalu besar."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new HttpError(400, "Data tidak valid."); }
}

export function apiError(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof ContentConflict) return NextResponse.json({ error: error.message }, { status: 409 });
  if (error instanceof ZodError) return NextResponse.json({ error: "Periksa isian: " + error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join("; ") }, { status: 400 });
  console.error("Admin operation failed", error instanceof Error ? error.message : "Unknown error");
  return NextResponse.json({ error: "Layanan belum dapat memproses permintaan. Coba lagi sebentar." }, { status: 500 });
}
