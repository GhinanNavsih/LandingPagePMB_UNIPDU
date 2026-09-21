import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const { database, collections } = await import("../lib/firebase-admin");
  const { contentSchema } = await import("../lib/content-schema");
  const { defaultContent } = await import("../lib/default-content");
  const { normalizeContent } = await import("../lib/content-policy");
  const db = database();
  const ref = db.collection(collections.content).doc("main");
  let changed = false;

  await db.runTransaction(async tx => {
    const snapshot = await tx.get(ref);
    const now = new Date().toISOString();
    if (!snapshot.exists) {
      const content = normalizeContent(defaultContent);
      tx.create(ref, { content, version: 1, updatedAt: now, updatedBy: "system:dormitory-lock" });
      tx.create(db.collection(collections.audit).doc(), { action: "dormitory-lock", version: 1, actor: "system:dormitory-lock", at: now });
      changed = true;
      return;
    }

    const data = snapshot.data()!;
    const content = normalizeContent(contentSchema.parse(data.content));
    if (JSON.stringify(data.content) === JSON.stringify(content)) return;
    const version = Number.isInteger(data.version) ? data.version : 0;
    const nextVersion = version + 1;
    tx.set(ref, { ...data, content, version: nextVersion, updatedAt: now, updatedBy: "system:dormitory-lock" });
    tx.create(db.collection(collections.audit).doc(), { action: "dormitory-lock", version: nextVersion, actor: "system:dormitory-lock", at: now });
    changed = true;
  });

  console.log(changed ? "Dormitory information is now server-managed." : "Dormitory information was already server-managed.");
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
