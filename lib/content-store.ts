import "server-only";
import { cache } from "react";
import { database, collections } from "./firebase-admin";
import { contentSchema, type SiteContent } from "./content-schema";
import { defaultContent } from "./default-content";
import { normalizeContent } from "./content-policy";

export type ContentRecord = { content: SiteContent; version: number; updatedAt: string | null; updatedBy: string | null };
export const getContent = cache(async (): Promise<ContentRecord> => {
  const snapshot = await database().collection(collections.content).doc("main").get();
  if (!snapshot.exists) return { content: normalizeContent(defaultContent), version: 0, updatedAt: null, updatedBy: null };
  const data = snapshot.data()!;
  return { content: normalizeContent(contentSchema.parse(data.content)), version: data.version, updatedAt: data.updatedAt, updatedBy: data.updatedBy };
});

export class ContentConflict extends Error {}
export async function saveContent(content: SiteContent, version: number, actor: string) {
  const validated = normalizeContent(contentSchema.parse(content));
  const db = database();
  const ref = db.collection(collections.content).doc("main");
  const record = { content: validated, version: version + 1, updatedAt: new Date().toISOString(), updatedBy: actor };
  await db.runTransaction(async tx => {
    const current = await tx.get(ref);
    if ((current.data()?.version ?? 0) !== version) throw new ContentConflict("Konten telah diperbarui dari sesi lain. Muat ulang halaman sebelum menyimpan.");
    tx.set(ref, record);
    tx.create(db.collection(collections.audit).doc(), { action: "publish", version: record.version, actor, at: record.updatedAt });
  });
  return record;
}
