import "server-only";
import { database, collections } from "./firebase-admin";

export interface ChatLogEntry {
  id: string;
  question: string;
  answerSnippet: string;
  fullAnswer?: string;
  status: "answered" | "fallback" | "error";
  hasContactReferral: boolean;
  topics: string[];
  createdAt: string;
}

export interface ChatAnalytics {
  totalQuestions: number;
  needAttentionCount: number;
  topicCounts: Record<string, number>;
  frequentKeywords: { word: string; count: number }[];
  recentLogs: ChatLogEntry[];
}

// In-memory fallback ring buffer for local development or when Firebase credentials are not yet configured
const inMemoryLogs: ChatLogEntry[] = [];
const MAX_FALLBACK_LOGS = 200;

const TOPIC_RULES: { name: string; keywords: string[] }[] = [
  { name: "Biaya & Pembayaran", keywords: ["biaya", "spp", "uang", "tarif", "harga", "bayar", "cicil", "dpp", "ukt", "angsuran"] },
  { name: "Asrama / Pondok", keywords: ["asrama", "chosyiah", "chosyi'ah", "pondok", "pesantren", "kamar", "putri", "putra", "mondok", "asrama fik"] },
  { name: "Beasiswa", keywords: ["beasiswa", "kip", "kip-k", "tahfidz", "keringanan", "potongan", "bantuan", "gratis"] },
  { name: "Fakultas Ilmu Kesehatan (FIK)", keywords: ["fik", "perawat", "keperawatan", "bidan", "kebidanan", "ners", "kesehatan"] },
  { name: "Fakultas & Program Studi", keywords: ["prodi", "jurusan", "fakultas", "fti", "fai", "feb", "fbs", "sistem informasi", "teknik informatika", "hukum", "manajemen", "pai", "bahasa inggris"] },
  { name: "Pendaftaran & Syarat", keywords: ["daftar", "pendaftaran", "syarat", "cara", "alur", "gelombang", "tes", "ujian", "jadwal", "buka", "tutup"] },
  { name: "Akreditasi & Fasilitas", keywords: ["akreditasi", "fasilitas", "lokasi", "alamat", "gedung", "lab", "laboratorium"] },
];

const STOP_WORDS = new Set([
  "yang", "untuk", "dengan", "apakah", "bagaimana", "adalah", "bisa", "pada", "dari", "dalam",
  "saya", "kamu", "anda", "kami", "mereka", "mau", "ingin", "kalau", "dong", "min", "halo",
  "assalamualaikum", "assalamu'alaikum", "selamat", "siang", "pagi", "sore", "malam",
  "terima", "kasih", "tidak", "akan", "ada", "apa", "ini", "itu", "atau", "dan", "jika",
  "sudah", "belum", "bisa", "bisakah", "harus", "punya", "saat", "oleh", "tentang", "minta", "info", "nya"
]);

export function detectTopics(text: string): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      matched.push(rule.name);
    }
  }
  return matched.length > 0 ? matched : ["Pertanyaan Umum"];
}

export function extractKeywords(texts: string[]): { word: string; count: number }[] {
  const frequency: Record<string, number> = {};
  for (const text of texts) {
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter(w => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

    for (const token of tokens) {
      frequency[token] = (frequency[token] || 0) + 1;
    }
  }

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Log a user question asynchronously. Never throws an uncaught error.
 */
export async function logChatQuery(entry: {
  question: string;
  reply: string;
  status: "answered" | "fallback" | "error";
  hasContactReferral: boolean;
}): Promise<void> {
  const trimmedQuestion = (entry.question || "").trim();
  if (!trimmedQuestion) return;

  const topics = detectTopics(trimmedQuestion);
  const now = new Date().toISOString();
  const logItem: ChatLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    question: trimmedQuestion,
    answerSnippet: entry.reply.length > 250 ? `${entry.reply.slice(0, 250)}...` : entry.reply,
    fullAnswer: entry.reply,
    status: entry.status,
    hasContactReferral: entry.hasContactReferral,
    topics,
    createdAt: now,
  };

  // Always store in memory fallback
  inMemoryLogs.unshift(logItem);
  if (inMemoryLogs.length > MAX_FALLBACK_LOGS) {
    inMemoryLogs.pop();
  }

  // Persist to Firestore if available
  try {
    const db = database();
    await db.collection(collections.chatLogs).add({
      question: logItem.question,
      answerSnippet: logItem.answerSnippet,
      fullAnswer: logItem.fullAnswer,
      status: logItem.status,
      hasContactReferral: logItem.hasContactReferral,
      topics: logItem.topics,
      createdAt: logItem.createdAt,
    });
  } catch (error) {
    // Firestore may not be provisioned or credentialed in local dev; safe to ignore
    console.warn("Notice: Firestore chat log save skipped, stored in-memory buffer.", (error as Error)?.message);
  }
}

/**
 * Retrieve chat logs and compute aggregated statistics for admin dashboard
 */
export async function getChatLogs(limitCount = 100): Promise<ChatAnalytics> {
  let logs: ChatLogEntry[] = [];

  try {
    const db = database();
    const snapshot = await db
      .collection(collections.chatLogs)
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();

    if (!snapshot.empty) {
      logs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question || "",
          answerSnippet: data.answerSnippet || "",
          fullAnswer: data.fullAnswer || "",
          status: data.status || "answered",
          hasContactReferral: Boolean(data.hasContactReferral),
          topics: Array.isArray(data.topics) ? data.topics : detectTopics(data.question || ""),
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });
    }
  } catch (error) {
    console.warn("Notice: Firestore chat logs fetch skipped, using in-memory logs.", (error as Error)?.message);
  }

  // If firestore yielded fewer or no results, blend with inMemoryLogs (ensuring uniqueness by question + time)
  if (logs.length === 0) {
    logs = [...inMemoryLogs].slice(0, limitCount);
  }

  // Aggregate topics
  const topicCounts: Record<string, number> = {};
  for (const log of logs) {
    for (const t of log.topics) {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    }
  }

  // Aggregate keywords
  const frequentKeywords = extractKeywords(logs.map(l => l.question));

  const needAttentionCount = logs.filter(l => l.hasContactReferral || l.status === "fallback").length;

  return {
    totalQuestions: logs.length,
    needAttentionCount,
    topicCounts,
    frequentKeywords,
    recentLogs: logs,
  };
}
