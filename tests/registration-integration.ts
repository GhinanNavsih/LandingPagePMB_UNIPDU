import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultContent } from "../lib/default-content";

async function main() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Run this test using the Firestore emulator; live database use is forbidden.");
  const projectId = "demo-unipdu-landing";
  const origin = "http://localhost:3104";
  const app = initializeApp({ projectId }, `registration-${Date.now()}`);
  const db = getFirestore(app);
  await db.collection("LandingPageContent").doc("main").set({ content: defaultContent, version: 1, updatedAt: new Date().toISOString(), updatedBy: "integration" });

  let log = "";
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--port", "3104"], {
    env: { ...process.env, FIREBASE_PROJECT_ID: projectId, FIREBASE_WEB_API_KEY: "emulator-key", NEXT_DIST_DIR: ".next-registration-integration", APP_ORIGIN: origin },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", data => { log += data; });
  server.stderr.on("data", data => { log += data; });

  try {
    let ready = false;
    for (let index = 0; index < 60; index++) {
      try { if ((await fetch(`${origin}/pendaftaran`)).ok) { ready = true; break; } } catch {}
      await delay(1000);
    }
    if (!ready) throw new Error(`Server failed to start: ${log}`);

    assert.equal((await fetch(`${origin}/api/admin/applications`)).status, 401);

    const payload = {
      pathwayCode: "reguler",
      primaryProgramCode: "fst-sistem-informasi-s1",
      secondaryProgramCode: "fbbp-administrasi-bisnis-s1",
      discoverySourceCodes: ["instagram", "friend-family"],
      fullName: "Integration Applicant",
      gender: "female",
      birthPlace: "Jombang",
      birthDate: "2007-05-14",
      address: "Peterongan, Jombang, Jawa Timur",
      phone: "0812 3456 7890",
      email: "applicant@example.test",
      schoolOrigin: "SMA Integration",
      idempotencyKey: "11111111-1111-4111-8111-111111111111",
      website: "",
    };
    const submit = (data: unknown, requestOrigin = origin) => fetch(`${origin}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: requestOrigin, "User-Agent": "registration-integration", "X-Forwarded-For": "203.0.113.10" },
      body: JSON.stringify(data),
    });

    const created = await submit(payload);
    assert.equal(created.status, 201);
    const result = await created.json() as { applicationNumber: string };
    assert.match(result.applicationNumber, /^PMB26-[A-Z0-9]{8}$/);

    const applications = await db.collection("PmbApplications").get();
    assert.equal(applications.size, 1);
    const record = applications.docs[0].data();
    assert.equal(record.schemaVersion, 1);
    assert.equal(record.status.code, "submitted");
    assert.equal(record.selection.programChoices[0].code, payload.primaryProgramCode);
    assert.equal(record.applicant.contact.phoneNormalized, "6281234567890");
    assert.equal(record.search.emailLowercase, payload.email);
    assert.equal((await db.collection("PmbApplicationEvents").get()).size, 1);

    const duplicate = await submit(payload);
    assert.equal(duplicate.status, 200);
    assert.equal((await db.collection("PmbApplications").get()).size, 1);
    assert.equal((await submit({ ...payload, email: "invalid" })).status, 400);
    assert.equal((await submit(payload, "https://attacker.example")).status, 403);
    assert.equal((await submit({ ...payload, idempotencyKey: "22222222-2222-4222-8222-222222222222", website: "spam.example" })).status, 201);
    assert.equal((await db.collection("PmbApplications").get()).size, 1);
    console.log("PASS: registration validation, persistence, idempotency, origin protection, and honeypot");
  } finally {
    server.kill("SIGTERM");
    await deleteApp(app);
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
