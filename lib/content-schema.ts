import { z } from "zod";

const text = z.string().trim().min(1, "Wajib diisi").max(500);
const paragraph = z.string().trim().min(1, "Wajib diisi").max(5000);
const httpsUrl = z.string().max(2000).url("Masukkan URL lengkap").refine((value) => URL.canParse(value) && new URL(value).protocol === "https:", "Gunakan URL https://");
const mediaUrl = z.string().refine((value) => /^\/(?!\/)[\w./%=-]+$/.test(value) || (value.startsWith("https://") && URL.canParse(value)), "Gunakan path /berkas atau URL https://");
const heading = { eyebrow: text, title: text, highlight: text, suffix: z.string().max(500), description: paragraph };
export const contentSchema = z.object({
  site: z.object({ name: text, university: text, description: paragraph, registrationUrl: httpsUrl, registrationLabel: text, metaTitle: text, metaDescription: paragraph }).strict(),
  hero: z.object({ badge: text, title: text, highlight: text, suffix: text, description: paragraph, videoUrl: mediaUrl, secondaryLabel: text }).strict(),
  announcements: z.array(text).min(1).max(20),
  stats: z.array(z.object({ value: text, label: text }).strict()).min(1).max(10),
  programs: z.object({ ...heading, faculties: z.array(z.object({ name: text, short: text, programs: z.array(text).min(1).max(40) }).strict()).min(1).max(20) }).strict(),
  accreditation: z.object({ eyebrow: text, title: text, rating: text, suffix: text, description: paragraph, decree: text, authority: text, validUntil: text, points: z.array(text).min(1).max(10) }).strict(),
  admissions: z.object({ ...heading, buttonLabel: text, steps: z.array(z.object({ title: text, desc: paragraph }).strict()).min(1).max(10) }).strict(),
  pathways: z.object({ ...heading, items: z.array(z.object({ title: text, subtitle: text, desc: paragraph, details: z.array(text).min(1).max(10), badge: text, featured: z.boolean() }).strict()).min(1).max(10) }).strict(),
  contact: z.object({ address: paragraph, whatsapp: text, whatsappUrl: httpsUrl.refine(value => URL.canParse(value) && new URL(value).hostname === "wa.me" && /^\/\d{8,16}$/.test(new URL(value).pathname), "Gunakan https://wa.me/nomor"), email: z.string().email().max(254), hours: text, closed: text }).strict(),
  chatbot: z.object({ greeting: paragraph, questions: z.array(text).min(1).max(8), knowledge: z.string().trim().min(1).max(80000), lockedDormitories: z.string().trim().min(1).max(50000).optional() }).strict(),
}).strict();

export type SiteContent = z.infer<typeof contentSchema>;
export type AdminContent = Omit<SiteContent, "chatbot"> & { chatbot: Omit<SiteContent["chatbot"], "knowledge" | "lockedDormitories"> & { knowledge: string } };
export type PublicContent = Omit<SiteContent, "chatbot"> & { chatbot: Omit<SiteContent["chatbot"], "knowledge" | "lockedDormitories"> };
export function adminContent(content: SiteContent): AdminContent {
  const { lockedDormitories: _lockedDormitories, ...chatbot } = content.chatbot;
  return { ...content, chatbot };
}
export function publicContent(content: SiteContent): PublicContent {
  const { knowledge: _knowledge, lockedDormitories: _lockedDormitories, ...chatbot } = content.chatbot;
  return { ...content, chatbot };
}
