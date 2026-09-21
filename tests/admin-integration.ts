import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { initializeApp, deleteApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { chromium } from "@playwright/test";
import { defaultContent } from "../lib/default-content";
import { LOCKED_DORMITORY_KNOWLEDGE } from "../lib/content-policy";

async function main() {
  if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error("Run this test using Firebase emulators; live database use is forbidden.");
  const projectId = "demo-unipdu-landing";
  const origin = "http://localhost:3101";
  const password = "Integration-password-42!";
  const app = initializeApp({ projectId });
  const auth = getAuth(app), db = getFirestore(app);
  const admin = await auth.createUser({ email: `admin-${Date.now()}@example.test`, password });
  const outsider = await auth.createUser({ email: `visitor-${Date.now()}@example.test`, password });
  await db.collection("LandingPageAdmins").doc(admin.uid).set({ active: true, email: admin.email });
  await db.collection("LandingPageContent").doc("main").set({ content: defaultContent, version: 1, updatedAt: new Date().toISOString(), updatedBy: "integration" });
  let log = "";
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--port", "3101"], { env: { ...process.env, FIREBASE_PROJECT_ID: projectId, FIREBASE_WEB_API_KEY: "emulator-key", NEXT_DIST_DIR: ".next-admin-integration", APP_ORIGIN: origin }, stdio: ["ignore", "pipe", "pipe"] });
  server.stdout.on("data", data => { log += data; }); server.stderr.on("data", data => { log += data; });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) { try { if ((await fetch(origin + "/admin/login")).ok) { ready = true; break; } } catch {} await delay(1000); }
    if (!ready) throw new Error(`Server failed to start: ${log}`);
    const api = (path: string, method = "GET", data?: unknown, cookie?: string, requestOrigin = origin) => fetch(origin + path, { method, headers: { "Content-Type": "application/json", Origin: requestOrigin, ...(cookie ? { Cookie: cookie } : {}) }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
    assert.equal((await api("/api/admin/content")).status, 401);
    assert.equal((await api("/api/admin/content", "PUT", { content: defaultContent, version: 1 })).status, 401);
    assert.equal((await api("/api/admin/login", "POST", { email: admin.email, password }, undefined, "https://attacker.example")).status, 403);
    assert.equal((await api("/api/admin/login", "POST", { email: outsider.email, password })).status, 401);
    console.log("PASS: anonymous and non-admin access, cross-origin login blocked");

    browser = await chromium.launch({ channel: "chrome", headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto(origin + "/admin");
    await page.getByLabel("Email admin").fill(admin.email!);
    await page.getByLabel("Kata sandi", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Masuk", exact: true }).click();
    await page.waitForURL(origin + "/admin");
    await page.getByRole("heading", { name: "Identitas & tautan", exact: true }).waitFor();
    assert.equal(await page.getByText("Asrama Chosyi'ah", { exact: false }).count(), 0);
    await page.screenshot({ path: "/tmp/unipdu-admin-editor.png", fullPage: true });
    await page.getByRole("button", { name: "Beranda utama", exact: true }).click();
    const badge = `Pendaftaran dibuka — verifikasi ${Date.now()}`;
    await page.getByLabel("Label", { exact: true }).fill(badge);
    await page.getByRole("button", { name: "Simpan & publikasikan" }).click();
    await page.getByText("Perubahan berhasil dipublikasikan.", { exact: false }).waitFor();
    const record = (await db.collection("LandingPageContent").doc("main").get()).data()!;
    assert.equal(record.content.hero.badge, badge); assert.equal(record.version, 2);
    assert.ok((await db.collection("LandingPageAudit").get()).size > 0);
    const html = await (await fetch(origin)).text(); assert.ok(html.includes(badge));
    assert.ok(!html.includes("RINCIAN BIAYA PENDIDIKAN"), "private knowledge must not appear in public page data");
    console.log("PASS: browser login, editing, database persistence, audit and public rendering");

    const cookies = await context.cookies();
    const session = cookies.find(cookie => cookie.name === "__session")!;
    assert.ok(session.httpOnly); assert.equal(session.sameSite, "Lax");
    const cookie = `__session=${session.value}`;
    assert.equal((await api("/api/admin/content", "PUT", { content: defaultContent, version: 1 }, cookie)).status, 409);
    const invalid = structuredClone(defaultContent); invalid.site.registrationUrl = "javascript:alert(1)";
    assert.equal((await api("/api/admin/content", "PUT", { content: invalid, version: 2 }, cookie)).status, 400);
    assert.equal((await api("/api/admin/content", "PUT", { content: defaultContent, version: 2 }, cookie, "https://attacker.example")).status, 403);
    console.log("PASS: stale writes, unsafe links and cross-origin writes rejected");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: "/tmp/unipdu-admin-editor-mobile.png", fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.getByRole("button", { name: "Pengumuman berjalan", exact: true }).click();
    await page.getByRole("button", { name: "+ Tambah pengumuman berjalan" }).click();
    await page.locator('input[id^="field-announcements"]').last().fill("Pengumuman baru");
    await page.getByRole("button", { name: "Simpan & publikasikan" }).click();
    await page.getByText("Perubahan berhasil dipublikasikan.", { exact: false }).waitFor();
    assert.equal((await db.collection("LandingPageContent").doc("main").get()).data()!.content.announcements.at(-1), "Pengumuman baru");
    const current = (await db.collection("LandingPageContent").doc("main").get()).data()!;
    const adminContentResponse = await api("/api/admin/content", "GET", undefined, cookie);
    const adminContentPayload = await adminContentResponse.json();
    assert.equal(adminContentPayload.content.chatbot.lockedDormitories, undefined);
    assert.equal(adminContentPayload.content.chatbot.knowledge.includes("7. INFORMASI ASRAMA / PONDOK PESANTREN MAHASISWA:"), false);
    const tampered = structuredClone(current.content);
    tampered.chatbot.knowledge += "\n\n7. INFORMASI ASRAMA / PONDOK PESANTREN MAHASISWA:\n- Data palsu\n8. INFORMASI KONTAK & SEKRETARIAT:";
    tampered.chatbot.lockedDormitories = "Data palsu";
    const tamperResponse = await api("/api/admin/content", "PUT", { content: tampered, version: current.version }, cookie);
    assert.equal(tamperResponse.status, 200);
    const migrated = (await db.collection("LandingPageContent").doc("main").get()).data()!;
    assert.equal(migrated.content.chatbot.lockedDormitories, LOCKED_DORMITORY_KNOWLEDGE);
    assert.equal(migrated.content.chatbot.knowledge.includes("Data palsu"), false);
    assert.deepEqual(errors, []);
    console.log("PASS: responsive editor, hidden dormitory content, and server-side lock");

    await db.collection("LandingPageAdmins").doc(admin.uid).update({ active: false });
    assert.equal((await api("/api/admin/content", "GET", undefined, cookie)).status, 401);
    await db.collection("LandingPageAdmins").doc(admin.uid).update({ active: true });
    assert.equal((await api("/api/admin/logout", "POST", undefined, cookie)).status, 200);
    assert.equal((await api("/api/admin/content", "GET", undefined, cookie)).status, 401);
    console.log("PASS: admin deactivation and logout invalidate access");

    const login = await api("/api/admin/login", "POST", { email: admin.email, password });
    assert.equal(login.status, 200);
    const freshCookie = login.headers.get("set-cookie")!.split(";")[0];
    const change = await api("/api/admin/password", "POST", { currentPassword: password, newPassword: "Changed-password-43!" }, freshCookie);
    assert.equal(change.status, 200);
    assert.equal((await api("/api/admin/content", "GET", undefined, freshCookie)).status, 401);
    assert.equal((await api("/api/admin/login", "POST", { email: admin.email, password })).status, 401);
    assert.equal((await api("/api/admin/login", "POST", { email: admin.email, password: "Changed-password-43!" })).status, 200);
    const limitedEmail = `limit-${Date.now()}@example.test`;
    for (let i = 0; i < 8; i++) assert.equal((await api("/api/admin/login", "POST", { email: limitedEmail, password })).status, 401);
    assert.equal((await api("/api/admin/login", "POST", { email: limitedEmail, password })).status, 429);
    console.log("PASS: password change, session revocation, and persistent login throttling");
  } finally { await browser?.close(); server.kill("SIGTERM"); await deleteApp(app); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
