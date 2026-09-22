import "server-only";
import { createHash } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import { database, collections } from "./firebase-admin";
import { HttpError } from "./admin-auth";
import { applicationSubmissionSchema, normalizePhone, type ApplicationSubmission } from "./application-schema";
import {
  ACTIVE_ADMISSION_CYCLE,
  ADMISSION_PATHWAYS,
  DISCOVERY_SOURCES,
  GENDER_OPTIONS,
  STUDY_PROGRAMS,
  catalogItem,
} from "./admissions-catalog";

const SUBMISSION_WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

export function submissionFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = request.headers.get("x-appengine-user-ip") || forwarded || "unknown";
  const agent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256").update(`${address}\n${agent}`).digest("hex");
}

function submissionKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function applicationNumber(documentId: string) {
  return `PMB26-${documentId.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase()}`;
}

export async function submitApplication(raw: ApplicationSubmission, fingerprint: string) {
  const input = applicationSubmissionSchema.parse(raw);
  const pathway = catalogItem(ADMISSION_PATHWAYS, input.pathwayCode)!;
  const primary = catalogItem(STUDY_PROGRAMS, input.primaryProgramCode)!;
  const secondary = input.secondaryProgramCode ? catalogItem(STUDY_PROGRAMS, input.secondaryProgramCode)! : null;
  const gender = catalogItem(GENDER_OPTIONS, input.gender)!;
  const sources = input.discoverySourceCodes.map(code => catalogItem(DISCOVERY_SOURCES, code)!);
  const db = database();
  const applicationRef = db.collection(collections.applications).doc();
  const number = applicationNumber(applicationRef.id);
  const keyRef = db.collection(collections.applicationKeys).doc(submissionKey(input.idempotencyKey));
  const attemptRef = db.collection(collections.applicationAttempts).doc(fingerprint);
  const eventRef = db.collection(collections.applicationEvents).doc();
  const now = Timestamp.now();

  return db.runTransaction(async transaction => {
    const [existingKey, attempt] = await Promise.all([transaction.get(keyRef), transaction.get(attemptRef)]);
    if (existingKey.exists) {
      const previous = existingKey.data()!;
      return { applicationId: previous.applicationId as string, applicationNumber: previous.applicationNumber as string, duplicate: true };
    }

    const attemptData = attempt.data();
    const resetAt = typeof attemptData?.resetAt === "number" ? attemptData.resetAt : 0;
    const activeWindow = resetAt > Date.now();
    const count = activeWindow ? Number(attemptData?.count || 0) : 0;
    if (count >= MAX_SUBMISSIONS_PER_WINDOW) throw new HttpError(429, "Terlalu banyak pendaftaran dari perangkat ini. Coba lagi dalam satu jam atau hubungi PMB.");

    const phoneNormalized = normalizePhone(input.phone);
    const submittedAt = now;
    const programChoices = [
      { priority: 1, code: primary.code, label: primary.label, facultyCode: primary.facultyCode, faculty: primary.faculty },
      ...(secondary ? [{ priority: 2, code: secondary.code, label: secondary.label, facultyCode: secondary.facultyCode, faculty: secondary.faculty }] : []),
    ];
    const record = {
      schemaVersion: 1,
      revision: 1,
      applicationNumber: number,
      cycleId: ACTIVE_ADMISSION_CYCLE.id,
      cycle: ACTIVE_ADMISSION_CYCLE,
      status: { code: "submitted", label: "Pendaftaran diterima", changedAt: submittedAt },
      applicant: {
        fullName: input.fullName,
        gender: { code: gender.code, label: gender.label },
        birth: { place: input.birthPlace, date: input.birthDate },
        address: input.address,
        contact: { phone: input.phone, phoneNormalized, email: input.email.toLowerCase() },
        education: { schoolOrigin: input.schoolOrigin },
      },
      selection: {
        pathway: { code: pathway.code, label: pathway.label },
        programChoices,
      },
      discovery: {
        sourceCodes: sources.map(item => item.code),
        sources: sources.map(item => ({ code: item.code, label: item.label })),
      },
      search: {
        fullNameLowercase: input.fullName.toLocaleLowerCase("id-ID"),
        emailLowercase: input.email.toLowerCase(),
        phoneNormalized,
      },
      submission: { channel: "web", locale: "id-ID" },
      submittedAt,
      updatedAt: submittedAt,
    };

    transaction.set(attemptRef, {
      count: count + 1,
      resetAt: activeWindow ? resetAt : Date.now() + SUBMISSION_WINDOW_MS,
      updatedAt: submittedAt,
    });
    transaction.create(applicationRef, record);
    transaction.create(keyRef, {
      applicationId: applicationRef.id,
      applicationNumber: number,
      createdAt: submittedAt,
      expiresAt: Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000),
    });
    transaction.create(eventRef, {
      schemaVersion: 1,
      applicationId: applicationRef.id,
      applicationNumber: number,
      cycleId: ACTIVE_ADMISSION_CYCLE.id,
      type: "application.submitted",
      fromStatus: null,
      toStatus: "submitted",
      actor: { type: "applicant" },
      occurredAt: submittedAt,
    });
    return { applicationId: applicationRef.id, applicationNumber: number, duplicate: false };
  });
}

export type AdminApplicationListItem = {
  id: string;
  applicationNumber: string;
  submittedAt: string;
  status: { code: string; label: string };
  applicant: {
    fullName: string;
    gender: string;
    birthPlace: string;
    birthDate: string;
    address: string;
    phone: string;
    email: string;
    schoolOrigin: string;
  };
  pathway: string;
  programChoices: { priority: number; code: string; label: string; faculty: string }[];
  discoverySources: string[];
};

export async function listApplications(limit = 100): Promise<AdminApplicationListItem[]> {
  const snapshot = await database().collection(collections.applications).orderBy("submittedAt", "desc").limit(limit).get();
  return snapshot.docs.map(document => {
    const data = document.data();
    return {
      id: document.id,
      applicationNumber: data.applicationNumber || document.id,
      submittedAt: data.submittedAt?.toDate?.().toISOString?.() || new Date(0).toISOString(),
      status: { code: data.status?.code || "unknown", label: data.status?.label || "Status belum tersedia" },
      applicant: {
        fullName: data.applicant?.fullName || "—",
        gender: data.applicant?.gender?.label || "—",
        birthPlace: data.applicant?.birth?.place || "—",
        birthDate: data.applicant?.birth?.date || "",
        address: data.applicant?.address || "—",
        phone: data.applicant?.contact?.phone || "—",
        email: data.applicant?.contact?.email || "—",
        schoolOrigin: data.applicant?.education?.schoolOrigin || "—",
      },
      pathway: data.selection?.pathway?.label || "—",
      programChoices: Array.isArray(data.selection?.programChoices) ? data.selection.programChoices.map((program: Record<string, unknown>) => ({
        priority: Number(program.priority || 0),
        code: String(program.code || ""),
        label: String(program.label || "—"),
        faculty: String(program.faculty || "—"),
      })) : [],
      discoverySources: Array.isArray(data.discovery?.sources) ? data.discovery.sources.map((source: Record<string, unknown>) => String(source.label || "")).filter(Boolean) : [],
    };
  });
}
