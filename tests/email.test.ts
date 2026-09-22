import test from "node:test";
import assert from "node:assert/strict";
import { sendApplicationConfirmationEmail } from "../lib/email";

test("sendApplicationConfirmationEmail in dev mock mode returns success and mock ID", async () => {
  // Ensure no SMTP is set for mock test
  const previousHost = process.env.SMTP_HOST;
  const previousUser = process.env.SMTP_USER;
  const previousPass = process.env.SMTP_PASS;

  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;

  try {
    const result = await sendApplicationConfirmationEmail({
      applicationNumber: "PMB26-OAEACJPZ",
      fullName: "Ahmad Fulan",
      recipientEmail: "ahmad@example.com",
      pathwayName: "Jalur Reguler",
      primaryProgramName: "Sistem Informasi (S1)",
      secondaryProgramName: "Administrasi Bisnis (S1)",
      schoolOrigin: "SMA Darul Ulum",
    });

    assert.equal(result.success, true);
    assert.equal(result.mocked, true);
    assert.ok(result.messageId?.includes("PMB26-OAEACJPZ"));
  } finally {
    if (previousHost) process.env.SMTP_HOST = previousHost;
    if (previousUser) process.env.SMTP_USER = previousUser;
    if (previousPass) process.env.SMTP_PASS = previousPass;
  }
});
