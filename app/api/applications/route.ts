import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkOrigin, HttpError } from "@/lib/admin-auth";
import { readJson } from "@/lib/admin-http";
import { applicationSubmissionSchema } from "@/lib/application-schema";
import { submissionFingerprint, submitApplication } from "@/lib/application-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = applicationSubmissionSchema.parse(await readJson(request));
    if (input.website) {
      return NextResponse.json({ ok: true, applicationNumber: "PMB26-RECEIVED" }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    const result = await submitApplication(input, submissionFingerprint(request));
    return NextResponse.json({ ok: true, applicationNumber: result.applicationNumber, duplicate: result.duplicate }, { status: result.duplicate ? 200 : 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Periksa kembali data pendaftaran." }, { status: 400 });
    console.error("Application submission failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Pendaftaran belum dapat disimpan. Coba lagi sebentar." }, { status: 500 });
  }
}
