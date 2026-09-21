"use client";

import { useEffect, useState, useMemo } from "react";
import {
  IconSearch,
  IconRefresh,
  IconMessageCircle,
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconChevronDown,
  IconChevronUp,
  IconSparkles,
  IconTag,
  IconClock,
  IconFilter,
  IconTrendingUp,
} from "@tabler/icons-react";
import type { ChatAnalytics, ChatLogEntry } from "@/lib/chat-logger";

export default function ChatLogViewer() {
  const [data, setData] = useState<ChatAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [onlyNeedAttention, setOnlyNeedAttention] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchLogs() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/chat-logs?limit=150");
      if (!response.ok) {
        throw new Error(`Gagal memuat log (${response.status})`);
      }
      const result: ChatAnalytics = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Gagal memuat riwayat percakapan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  function copyToClipboard(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredLogs = useMemo(() => {
    if (!data?.recentLogs) return [];
    return data.recentLogs.filter(log => {
      // Filter by attention needed
      if (onlyNeedAttention && !log.hasContactReferral && log.status !== "fallback") {
        return false;
      }
      // Filter by topic
      if (selectedTopic !== "all" && !log.topics.includes(selectedTopic)) {
        return false;
      }
      // Filter by search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchQuestion = log.question.toLowerCase().includes(query);
        const matchAnswer = (log.fullAnswer || log.answerSnippet).toLowerCase().includes(query);
        if (!matchQuestion && !matchAnswer) return false;
      }
      return true;
    });
  }, [data, search, selectedTopic, onlyNeedAttention]);

  const topTopic = useMemo(() => {
    if (!data?.topicCounts) return null;
    const entries = Object.entries(data.topicCounts).filter(([k]) => k !== "Pertanyaan Umum");
    if (entries.length === 0) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Top Banner Guide */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-900 text-white shrink-0 mt-0.5">
            <IconSparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-950">
              Pusat Wawasan Pertanyaan Calon Mahasiswa
            </h4>
            <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
              Pantau pertanyaan yang paling sering diajukan untuk terus memperkaya data di tab{" "}
              <strong className="font-semibold underline">Pengetahuan chatbot</strong> (biaya, beasiswa, asrama, dll).
            </p>
          </div>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-emerald-100/50 border border-emerald-200 text-emerald-900 rounded-lg shadow-sm transition-colors shrink-0 disabled:opacity-50"
        >
          <IconRefresh size={14} className={loading ? "animate-spin" : ""} />
          Segarkan Data
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-line bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Total Pertanyaan
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <IconMessageCircle size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-emerald-950">
              {loading ? "..." : data?.totalQuestions ?? 0}
            </span>
            <span className="text-xs text-muted">pesan masuk</span>
          </div>
          <p className="text-xs text-muted mt-2">Tercatat secara otomatis dari widget AI</p>
        </div>

        <div className="p-5 rounded-2xl border border-line bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Topik Paling Populer
            </span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
              <IconTrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-medium text-ink truncate">
              {loading ? "..." : topTopic ? topTopic[0] : "Belum ada data"}
            </span>
            {topTopic && (
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 font-semibold rounded-full">
                {topTopic[1]} tanya
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-2">Berdasarkan klasifikasi otomatis kata kunci</p>
        </div>

        <div className="p-5 rounded-2xl border border-line bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Rujukan WhatsApp / Atensi
            </span>
            <div className="p-2 bg-rose-50 text-rose-800 rounded-lg">
              <IconAlertCircle size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-rose-950">
              {loading ? "..." : data?.needAttentionCount ?? 0}
            </span>
            <span className="text-xs text-muted">pertanyaan diarahkan</span>
          </div>
          <p className="text-xs text-muted mt-2">Peluang untuk melengkapi jawaban di knowledge base</p>
        </div>
      </div>

      {/* Frequent Keywords Cloud */}
      {data?.frequentKeywords && data.frequentKeywords.length > 0 && (
        <div className="p-4 rounded-xl border border-line bg-stone-50/60">
          <div className="flex items-center gap-2 mb-2.5">
            <IconTag size={15} className="text-emerald-800" />
            <h5 className="text-xs font-semibold uppercase tracking-wider text-ink">
              Kata Kunci Terbanyak Ditanyakan Calon Mahasiswa
            </h5>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.frequentKeywords.map(kw => (
              <button
                key={kw.word}
                onClick={() => setSearch(search === kw.word ? "" : kw.word)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  search.toLowerCase() === kw.word.toLowerCase()
                    ? "bg-emerald-900 text-white border-emerald-900 shadow-xs"
                    : "bg-white hover:bg-emerald-50 text-body border-line"
                }`}
                title={`Klik untuk memfilter pertanyaan yang mengandung kata "${kw.word}"`}
              >
                <span>{kw.word}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    search.toLowerCase() === kw.word.toLowerCase()
                      ? "bg-emerald-800 text-emerald-100"
                      : "bg-stone-100 text-muted"
                  }`}
                >
                  {kw.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
        <div className="relative flex-1">
          <IconSearch
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari pertanyaan calon mahasiswa atau jawaban AI..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
            >
              Hapus
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="px-3 py-2.5 bg-white border border-line rounded-xl text-xs text-body focus:outline-none focus:border-emerald-800"
          >
            <option value="all">Semua Kategori</option>
            {data?.topicCounts &&
              Object.keys(data.topicCounts).map(topic => (
                <option key={topic} value={topic}>
                  {topic} ({data.topicCounts[topic]})
                </option>
              ))}
          </select>

          <button
            onClick={() => setOnlyNeedAttention(!onlyNeedAttention)}
            className={`px-3 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              onlyNeedAttention
                ? "bg-rose-900 text-white border-rose-900"
                : "bg-white text-body border-line hover:bg-stone-50"
            }`}
          >
            <IconAlertCircle size={14} />
            Perlu Atensi
          </button>
        </div>
      </div>

      {/* Logs Listing */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <IconRefresh size={28} className="animate-spin text-emerald-800 mx-auto" />
          <p className="text-sm text-muted">Memuat daftar pertanyaan...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-line rounded-2xl bg-stone-50/50 p-6 space-y-2">
          <IconMessageCircle size={32} className="text-muted/60 mx-auto" />
          <p className="text-sm font-medium text-ink">Belum ada riwayat pertanyaan</p>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {search || selectedTopic !== "all" || onlyNeedAttention
              ? "Tidak ditemukan pertanyaan dengan filter yang dipilih. Coba sesuaikan kata pencarian."
              : "Pertanyaan yang diajukan pengunjung melalui AI Chatbot akan otomatis tercatat dan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-muted flex justify-between items-center px-1">
            <span>
              Menampilkan <strong>{filteredLogs.length}</strong> pertanyaan
            </span>
          </div>

          <div className="space-y-3">
            {filteredLogs.map(log => {
              const isExpanded = expandedId === log.id;
              const formattedDate = new Date(log.createdAt).toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={log.id}
                  className={`border rounded-2xl p-4 sm:p-5 transition-all bg-white ${
                    log.hasContactReferral || log.status === "fallback"
                      ? "border-amber-200 shadow-xs"
                      : "border-line"
                  }`}
                >
                  {/* Header Row: Category Badges & Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {log.topics.map(t => (
                        <span
                          key={t}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/60"
                        >
                          {t}
                        </span>
                      ))}

                      {log.hasContactReferral ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1">
                          <IconAlertCircle size={12} />
                          Rujukan WA PMB
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 flex items-center gap-1">
                          <IconCheck size={12} className="text-emerald-700" />
                          Terjawab AI
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted">
                      <IconClock size={13} />
                      <span>{formattedDate} WIB</span>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="flex items-start justify-between gap-3 bg-stone-50/80 rounded-xl p-3 border border-stone-200/70">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="font-serif text-base font-bold text-emerald-900 shrink-0 select-none">
                        Q:
                      </span>
                      <p className="text-sm font-semibold text-ink leading-relaxed break-words">
                        {log.question}
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(log.id, log.question)}
                      title="Salin pertanyaan"
                      className="p-1.5 hover:bg-white border border-transparent hover:border-line rounded-lg text-muted hover:text-ink transition-colors shrink-0"
                    >
                      {copiedId === log.id ? (
                        <IconCheck size={15} className="text-emerald-700" />
                      ) : (
                        <IconCopy size={15} />
                      )}
                    </button>
                  </div>

                  {/* Answer Section */}
                  <div className="mt-3 pl-1 pr-1">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-muted shrink-0 select-none mt-0.5">
                        AI:
                      </span>
                      <div className="text-xs text-body leading-relaxed flex-1">
                        {isExpanded ? (
                          <div className="whitespace-pre-wrap">{log.fullAnswer || log.answerSnippet}</div>
                        ) : (
                          <div>{log.answerSnippet}</div>
                        )}
                      </div>
                    </div>

                    {log.fullAnswer && log.fullAnswer.length > 250 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : log.id)}
                        className="mt-2 text-xs font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <IconChevronUp size={14} /> Sembunyikan jawaban lengkap
                          </>
                        ) : (
                          <>
                            <IconChevronDown size={14} /> Lihat jawaban lengkap
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
