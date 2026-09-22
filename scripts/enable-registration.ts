import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const { database, collections } = await import("../lib/firebase-admin");
  const { contentSchema } = await import("../lib/content-schema");
  const { normalizeContent } = await import("../lib/content-policy");
  const db = database();
  const ref = db.collection(collections.content).doc("main");
  let changed = false;

  await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) throw new Error("LandingPageContent/main belum tersedia. Jalankan admin:provision terlebih dahulu.");
    const data = snapshot.data()!;
    const content = normalizeContent(contentSchema.parse(data.content));
    if (content.site.registrationUrl === "/pendaftaran") return;
    const updatedAt = new Date().toISOString();
    const version = Number.isInteger(data.version) ? data.version + 1 : 1;
    const updatedContent = { ...content, site: { ...content.site, registrationUrl: "/pendaftaran" } };
    transaction.set(ref, { ...data, content: updatedContent, version, updatedAt, updatedBy: "system:registration-route" });
    transaction.create(db.collection(collections.audit).doc(), { action: "registration-route-enabled", version, actor: "system:registration-route", at: updatedAt });
    changed = true;
  });

  console.log(changed ? "Landing-page registration links now use /pendaftaran." : "Landing-page registration links already use /pendaftaran.");
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
