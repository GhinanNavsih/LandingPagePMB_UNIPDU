import { z } from "zod";
import {
  ADMISSION_PATHWAYS,
  DISCOVERY_SOURCES,
  GENDER_OPTIONS,
  STUDY_PROGRAMS,
} from "./admissions-catalog";

const pathwayCodes = ADMISSION_PATHWAYS.map(item => item.code) as [string, ...string[]];
const programCodes = STUDY_PROGRAMS.map(item => item.code) as [string, ...string[]];
const sourceCodes = DISCOVERY_SOURCES.map(item => item.code) as [string, ...string[]];
const genderCodes = GENDER_OPTIONS.map(item => item.code) as [string, ...string[]];

const requiredText = (label: string, maximum: number) => z.string().trim().min(1, `${label} wajib diisi.`).max(maximum, `${label} terlalu panjang.`);
const birthDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal lahir wajib diisi.").refine(value => {
  const date = new Date(`${value}T00:00:00.000Z`);
  const [year, month, day] = value.split("-").map(Number);
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day && year >= 1940 && date.getTime() <= Date.now();
}, "Tanggal lahir tidak valid.");

export const applicationSubmissionSchema = z.object({
  pathwayCode: z.enum(pathwayCodes, { message: "Pilih jalur pendaftaran." }),
  primaryProgramCode: z.enum(programCodes, { message: "Pilih program studi pertama." }),
  secondaryProgramCode: z.union([z.enum(programCodes), z.literal("")]),
  discoverySourceCodes: z.array(z.enum(sourceCodes)).max(DISCOVERY_SOURCES.length),
  fullName: requiredText("Nama lengkap", 120).min(3, "Nama lengkap minimal 3 karakter."),
  gender: z.enum(genderCodes, { message: "Pilih jenis kelamin." }),
  birthPlace: requiredText("Tempat lahir", 100),
  birthDate,
  address: requiredText("Alamat", 500).min(8, "Alamat minimal 8 karakter."),
  phone: requiredText("Nomor telepon", 30).refine(value => /^[+\d\s().-]+$/.test(value), "Nomor telepon hanya boleh berisi angka dan tanda pemisah.").refine(value => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15;
  }, "Masukkan nomor telepon aktif yang valid."),
  email: z.string().trim().min(1, "Email wajib diisi.").email("Masukkan alamat email yang valid.").max(254),
  schoolOrigin: requiredText("Asal sekolah", 180).min(2, "Asal sekolah minimal 2 karakter."),
  idempotencyKey: z.string().uuid("Identitas pengiriman tidak valid."),
  website: z.string().max(200).optional().default(""),
}).strict().superRefine((value, context) => {
  if (value.secondaryProgramCode && value.secondaryProgramCode === value.primaryProgramCode) {
    context.addIssue({ code: "custom", path: ["secondaryProgramCode"], message: "Pilihan kedua harus berbeda dari pilihan pertama." });
  }
});

export type ApplicationSubmission = z.infer<typeof applicationSubmissionSchema>;
export type ApplicationDraft = Omit<ApplicationSubmission, "idempotencyKey" | "website">;

export const EMPTY_APPLICATION_DRAFT: ApplicationDraft = {
  pathwayCode: "" as ApplicationDraft["pathwayCode"],
  primaryProgramCode: "" as ApplicationDraft["primaryProgramCode"],
  secondaryProgramCode: "",
  discoverySourceCodes: [],
  fullName: "",
  gender: "" as ApplicationDraft["gender"],
  birthPlace: "",
  birthDate: "",
  address: "",
  phone: "",
  email: "",
  schoolOrigin: "",
};

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return digits;
}
