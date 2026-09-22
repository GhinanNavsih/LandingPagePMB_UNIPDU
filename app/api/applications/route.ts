import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkOrigin, HttpError } from "@/lib/admin-auth";
import { readJson } from "@/lib/admin-http";
import { applicationSubmissionSchema } from "@/lib/application-schema";
import { submissionFingerprint, submitApplication } from "@/lib/application-store";
import { ADMISSION_PATHWAYS, STUDY_PROGRAMS, catalogItem } from "@/lib/admissions-catalog";
import { sendApplicationConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const input = applicationSubmissionSchema.parse(await readJson(request));
    if (input.website) {
      return NextResponse.json({ ok: true, applicationNumber: "PMB26-RECEIVED" }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    const result = await submitApplication(input, submissionFingerprint(request));

    if (!result.duplicate) {
      const pathway = catalogItem(ADMISSION_PATHWAYS, input.pathwayCode);
      const primary = catalogItem(STUDY_PROGRAMS, input.primaryProgramCode);
      const secondary = input.secondaryProgramCode ? catalogItem(STUDY_PROGRAMS, input.secondaryProgramCode) : null;

      // Send confirmation email asynchronously without blocking the user response
      sendApplicationConfirmationEmail({
        applicationNumber: result.applicationNumber,
        fullName: input.fullName,
        recipientEmail: input.email,
        phone: input.phone,
        pathwayName: pathway?.label || input.pathwayCode,
        primaryProgramName: primary?.label || input.primaryProgramCode,
        secondaryProgramName: secondary?.label,
        schoolOrigin: input.schoolOrigin,
      }).catch(err => {
        console.error("Non-blocking email send error:", err);
      });
    }

    return NextResponse.json({ ok: true, applicationNumber: result.applicationNumber, duplicate: result.duplicate }, { status: result.duplicate ? 200 : 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Periksa kembali data pendaftaran." }, { status: 400 });
    console.error("Application submission failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Pendaftaran belum dapat disimpan. Coba lagi sebentar." }, { status: 500 });
  }
}
