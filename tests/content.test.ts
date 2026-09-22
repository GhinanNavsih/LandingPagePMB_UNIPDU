import test from "node:test";
import assert from "node:assert/strict";
import { adminContent, contentSchema, publicContent } from "../lib/content-schema";
import { LOCKED_DORMITORY_KNOWLEDGE, normalizeContent } from "../lib/content-policy";
import { defaultContent } from "../lib/default-content";
import { chatbotInstruction } from "../lib/chatbot-instruction";

test("existing landing information is valid and private chatbot instructions stay server-side", () => {
  const content = contentSchema.parse(defaultContent);
  assert.equal(content.site.registrationUrl, "/pendaftaran");
  assert.ok(content.chatbot.knowledge.includes("RINCIAN BIAYA"));
  const normalized = normalizeContent(content);
  assert.equal(normalized.chatbot.knowledge.includes("7. INFORMASI ASRAMA / PONDOK PESANTREN MAHASISWA:"), false);
  assert.equal(normalized.chatbot.lockedDormitories, LOCKED_DORMITORY_KNOWLEDGE);
  assert.equal("lockedDormitories" in adminContent(normalized).chatbot, false);
  assert.equal("knowledge" in publicContent(content).chatbot, false);
});

test("rejects executable links, invalid contact details, and empty public lists", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,test", "http://unsafe.test", "//unsafe.test"]) {
    const copy = structuredClone(defaultContent); copy.site.registrationUrl = url;
    assert.equal(contentSchema.safeParse(copy).success, false, url);
  }
  const copy = structuredClone(defaultContent);
  copy.hero.videoUrl = "//unsafe.test/video.mp4";
  copy.contact.whatsappUrl = "https://unrelated.example/";
  copy.programs.faculties = [];
  assert.equal(contentSchema.safeParse(copy).success, false);
});

test("enforces text size and rejects unrecognized payload fields", () => {
  assert.equal(contentSchema.safeParse({ ...defaultContent, admin: true }).success, false);
  const copy = structuredClone(defaultContent); copy.chatbot.knowledge = "a".repeat(80001);
  assert.equal(contentSchema.safeParse(copy).success, false);
});

test("chatbot receives the published contact and program information with priority", () => {
  const copy = structuredClone(defaultContent);
  copy.contact.whatsapp = "TEST-CONTACT-123";
  copy.programs.faculties[0].programs = ["Program terbaru"];
  const instructions = chatbotInstruction(copy);
  assert.ok(instructions.includes("TEST-CONTACT-123"));
  assert.ok(instructions.includes("Program terbaru"));
  assert.ok(instructions.includes("utamakan data ini"));
  assert.ok(instructions.includes(LOCKED_DORMITORY_KNOWLEDGE));
});

test("normalization ignores submitted dormitory changes", () => {
  const copy = structuredClone(defaultContent);
  copy.chatbot.knowledge = `${copy.chatbot.knowledge}\n\n7. INFORMASI ASRAMA / PONDOK PESANTREN MAHASISWA:\n- Data palsu\n8. INFORMASI KONTAK & SEKRETARIAT:`;
  copy.chatbot.lockedDormitories = "Data palsu";
  const normalized = normalizeContent(contentSchema.parse(copy));
  assert.equal(normalized.chatbot.lockedDormitories, LOCKED_DORMITORY_KNOWLEDGE);
  assert.equal(normalized.chatbot.knowledge.includes("Data palsu"), false);
});
