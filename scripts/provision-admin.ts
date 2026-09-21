import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const { database, firebaseAuth, collections } = await import("../lib/firebase-admin");
  const { defaultContent } = await import("../lib/default-content");
  const { contentSchema } = await import("../lib/content-schema");
  const { normalizeContent } = await import("../lib/content-policy");
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 10 characters). Existing users are never reset.");
  let user;
  try { user = await firebaseAuth().getUserByEmail(email); }
  catch (error) {
    if ((error as { code: string }).code !== "auth/user-not-found") throw error;
    user = await firebaseAuth().createUser({ email, password, displayName: "Admin PMB", disabled: false });
  }
  if (user.disabled) throw new Error("The existing account is disabled. Resolve this before granting access.");
  const db = database();
  await db.runTransaction(async tx => {
    const contentRef = db.collection(collections.content).doc("main");
    const adminRef = db.collection(collections.admins).doc(user.uid);
    const [content, admin] = await Promise.all([tx.get(contentRef), tx.get(adminRef)]);
    if (!content.exists) tx.create(contentRef, { content: normalizeContent(contentSchema.parse(defaultContent)), version: 1, updatedAt: new Date().toISOString(), updatedBy: email });
    if (!admin.exists) tx.create(adminRef, { email, active: true, createdAt: new Date().toISOString() });
    else if (admin.data()?.active !== true) throw new Error("Existing admin is inactive; it was not re-enabled.");
  });
  console.log(`Admin ready: ${email}. Content initialized without overwriting existing data.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
