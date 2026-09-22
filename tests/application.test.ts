import test from "node:test";
import assert from "node:assert/strict";
import { applicationSubmissionSchema, normalizePhone } from "../lib/application-schema";

const validApplication = {
  pathwayCode: "reguler",
  primaryProgramCode: "fst-sistem-informasi-s1",
  secondaryProgramCode: "fbbp-administrasi-bisnis-s1",
  discoverySourceCodes: ["instagram", "friend-family"],
  fullName: "Ahmad Fulan",
  gender: "male",
  birthPlace: "Jombang",
  birthDate: "2007-05-14",
  address: "Peterongan, Jombang, Jawa Timur",
  phone: "0812 3456 7890",
  email: "ahmad@example.com",
  schoolOrigin: "SMA Contoh Jombang",
  idempotencyKey: "00000000-0000-4000-8000-000000000000",
  website: "",
};

test("accepts every requested registration field without a unique-code field", () => {
  const parsed = applicationSubmissionSchema.parse(validApplication);
  assert.equal(parsed.primaryProgramCode, "fst-sistem-informasi-s1");
  assert.deepEqual(parsed.discoverySourceCodes, ["instagram", "friend-family"]);
  assert.equal(normalizePhone(parsed.phone), "6281234567890");
  assert.equal(applicationSubmissionSchema.safeParse({ ...validApplication, uniqueCode: "d4486d" }).success, false);
});

test("rejects duplicate program choices and malformed personal data", () => {
  assert.equal(applicationSubmissionSchema.safeParse({ ...validApplication, secondaryProgramCode: validApplication.primaryProgramCode }).success, false);
  assert.equal(applicationSubmissionSchema.safeParse({ ...validApplication, phone: "123" }).success, false);
  assert.equal(applicationSubmissionSchema.safeParse({ ...validApplication, phone: "call-me-081234567890" }).success, false);
  assert.equal(applicationSubmissionSchema.safeParse({ ...validApplication, birthDate: "2999-01-01" }).success, false);
  assert.equal(applicationSubmissionSchema.safeParse({ ...validApplication, email: "bukan-email" }).success, false);
});
