"use client";
import { useEffect, useState } from "react";
import { IconCheck, IconDeviceFloppy, IconExternalLink, IconLogout, IconLoader2 } from "@tabler/icons-react";
import type { ContentRecord } from "@/lib/content-store";
import { contentSchema, type SiteContent } from "@/lib/content-schema";
import ContentFields, { type FieldValue } from "./ContentFields";
import ChatLogViewer from "./ChatLogViewer";

type ActiveTab = keyof SiteContent | "account" | "chatlogs";

const sections: { key: keyof SiteContent; title: string; note: string }[] = [
  { key: "site", title: "Identitas & tautan", note: "Identitas kampus, tombol pendaftaran, dan informasi mesin pencari." },
  { key: "hero", title: "Beranda utama", note: "Judul utama dan video penyambut pengunjung." },
  { key: "announcements", title: "Pengumuman berjalan", note: "Informasi singkat pada baris pengumuman." },
  { key: "stats", title: "Statistik kampus", note: "Angka dan keterangan ringkasan kampus." },
  { key: "programs", title: "Fakultas & program studi", note: "Kelola daftar fakultas beserta program studinya." },
  { key: "accreditation", title: "Akreditasi", note: "Peringkat, nomor SK, dan masa berlaku akreditasi." },
  { key: "admissions", title: "Alur pendaftaran", note: "Tahapan pendaftaran calon mahasiswa baru." },
  { key: "pathways", title: "Jalur penerimaan", note: "Pilihan jalur, syarat, dan penjelasan seleksi." },
  { key: "contact", title: "Kontak & layanan", note: "Kontak resmi yang digunakan pengunjung untuk menghubungi PMB." },
  { key: "chatbot", title: "Pengetahuan chatbot", note: "Kelola informasi biaya, beasiswa, asrama, dan jawaban PMB." },
];

const extraSections: { key: "chatlogs" | "account"; title: string; note: string }[] = [
  { key: "chatlogs", title: "Log Pertanyaan Chatbot", note: "Pantau riwayat pertanyaan calon mahasiswa, tren kata kunci, dan topik yang perlu ditambahkan ke knowledge base." },
  { key: "account", title: "Akun admin", note: "Ganti kata sandi untuk akun Anda. Setelah berhasil, semua sesi harus masuk kembali." },
];

export default function AdminEditor({ initial, email }: { initial: ContentRecord; email: string }) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial.content);
  const [active, setActive] = useState<ActiveTab>("site");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved.content);
  const allSections = [...sections, ...extraSections];
  const section = allSections.find(s => s.key === active);
  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) { if (dirty) { event.preventDefault(); event.returnValue = ""; } }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  async function request(url: string, method: string, body?: unknown) {
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) throw new Error(`${result.error} Buka halaman masuk di tab baru agar perubahan Anda tetap tersimpan di formulir ini.`);
      throw new Error(result.error || "Permintaan gagal.");
    }
    return result;
  }
  async function save() {
    if (busy || !dirty) return;
    const parsed = contentSchema.safeParse(draft);
    setError(""); setMessage("");
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const key = issue.path[0] as keyof SiteContent;
      setActive(key); setError(`${sections.find(s => s.key === key)?.title}: ${issue.message}. Periksa kolom yang ditandai.`);
      setTimeout(() => document.getElementById(`field-${issue.path.join(".")}`)?.focus(), 0);
      return;
    }
    setBusy("Menyimpan dan mempublikasikan perubahan…");
    try {
      const result: ContentRecord = await request("/api/admin/content", "PUT", { content: parsed.data, version: saved.version });
      setSaved(result); setDraft(result.content); setMessage("Perubahan berhasil dipublikasikan. Landing page dan chatbot kini menggunakan informasi terbaru.");
    } catch (error) { setError(error instanceof Error ? error.message : "Gagal menyimpan."); }
    finally { setBusy(""); }
  }
  async function logout() {
    if (busy || (dirty && !window.confirm("Perubahan belum dipublikasikan. Keluar dan buang perubahan?"))) return;
    setBusy("Keluar dari akun…"); setError("");
    try { await request("/api/admin/logout", "POST"); setDraft(saved.content); window.location.assign("/admin/login"); }
    catch (error) { setError(error instanceof Error ? error.message : "Gagal keluar."); setBusy(""); }
  }
  async function password(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = new FormData(event.currentTarget);
    if (form.get("newPassword") !== form.get("confirm")) { setError("Konfirmasi kata sandi tidak sama."); return; }
    setBusy("Memperbarui kata sandi…"); setError("");
    try {
      await request("/api/admin/password", "POST", { currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") });
      setMessage("Kata sandi diperbarui. Silakan masuk kembali.");
      window.location.assign("/admin/login");
    } catch (error) { setError(error instanceof Error ? error.message : "Gagal memperbarui kata sandi."); setBusy(""); }
  }
  return <div className="min-h-screen bg-paper pb-40 sm:pb-24">
    <header className="bg-white border-b border-line"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap justify-between gap-4 items-center">
      <div className="flex gap-3 items-center"><img src="/logo-unipdu.png" alt="UNIPDU" className="w-11" /><div><h1 className="font-serif text-xl text-emerald-950">Admin PMB UNIPDU</h1><p className="text-xs text-muted break-all">{email}</p></div></div>
      <div className="flex gap-4 items-center"><a href="/" target="_blank" rel="noopener noreferrer" className="text-sm inline-flex items-center gap-2 text-emerald-800">Lihat halaman <IconExternalLink size={16} /></a><button onClick={logout} disabled={!!busy} className="text-sm inline-flex items-center gap-2 px-3 py-2 border rounded-lg disabled:opacity-50"><IconLogout size={16} /> Keluar</button></div>
    </div></header>
    <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 grid lg:grid-cols-[240px_minmax(0,1fr)] gap-8">
      <aside className="min-w-0"><p className="uppercase text-[10px] font-semibold tracking-widest text-muted mb-3">Konten landing page</p><nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-3" aria-label="Bagian konten">
        {sections.map(item => <button key={item.key} disabled={!!busy} onClick={() => { setActive(item.key as typeof active); setMessage(""); }} aria-current={active === item.key ? "page" : undefined} className={`whitespace-nowrap text-left px-4 py-3 rounded-xl text-sm transition-colors ${active === item.key ? "bg-emerald-900 text-white" : "hover:bg-white text-body"}`}>{item.title}</button>)}
      </nav>
      <p className="uppercase text-[10px] font-semibold tracking-widest text-muted mb-3 mt-5">Wawasan & Sistem</p>
      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-3" aria-label="Bagian wawasan dan sistem">
        {extraSections.map(item => (
          <button key={item.key} disabled={!!busy} onClick={() => { setActive(item.key as typeof active); setMessage(""); }} aria-current={active === item.key ? "page" : undefined} className={`whitespace-nowrap text-left px-4 py-3 rounded-xl text-sm transition-colors ${active === item.key ? "bg-emerald-900 text-white" : "hover:bg-white text-body"}`}>
            {item.key === "chatlogs" ? (
              <span className="flex items-center justify-between gap-2">
                <span>{item.title}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">AI</span>
              </span>
            ) : item.title}
          </button>
        ))}
      </nav>
      <p className="hidden lg:block text-xs text-muted mt-5 leading-relaxed">Terakhir dipublikasikan<br /><span className="text-body">{saved.updatedAt ? new Date(saved.updatedAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB" : "Konten awal"}</span></p></aside>
      <main className="min-w-0"><div className="mb-6"><p className="text-xs uppercase tracking-widest text-emerald-800 mb-2">Pengelolaan informasi</p><h2 className="font-serif text-3xl text-ink">{section?.title || "Akun admin"}</h2><p className="text-sm text-muted mt-3">{section?.note || "Ganti kata sandi untuk akun Anda. Setelah berhasil, semua sesi harus masuk kembali."}</p></div>
        {error && <div role="alert" className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">{error} <a href="/admin/login" target="_blank" rel="noopener noreferrer" className="underline">Halaman masuk</a></div>}
        {message && <p role="status" className="mb-5 p-4 flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm"><IconCheck size={18} className="shrink-0" />{message}</p>}
        <div className="bg-white border border-line rounded-2xl p-5 sm:p-8">
          {active === "account" ? <form onSubmit={password} className="space-y-5 max-w-md"><fieldset disabled={!!busy || dirty} className="space-y-5 disabled:opacity-50">
            {[["currentPassword", "Kata sandi saat ini"], ["newPassword", "Kata sandi baru (minimal 10 karakter)"], ["confirm", "Konfirmasi kata sandi baru"]].map(([name, label]) => <label key={name} className="block text-sm font-medium">{label}<input name={name} type="password" autoComplete={name === "currentPassword" ? "current-password" : "new-password"} required minLength={name === "currentPassword" ? 1 : 10} maxLength={256} className="mt-2 w-full rounded-xl border border-line px-4 py-3" /></label>)}
            <button className="px-5 py-3 rounded-xl bg-emerald-900 text-white text-sm">Perbarui kata sandi</button>
          </fieldset>{dirty && <p className="text-sm text-amber-800">Publikasikan atau buang perubahan konten sebelum mengganti kata sandi.</p>}</form> : active === "chatlogs" ? <ChatLogViewer /> : <fieldset disabled={!!busy} className="disabled:opacity-60"><ContentFields key={active} path={active} label={section?.title} value={draft[active] as FieldValue} onChange={value => { setDraft(previous => ({ ...previous, [active]: value } as SiteContent)); setMessage(""); }} /></fieldset>}
        </div>
      </main>
    </div>
    <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-line z-30"><div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-3"><p className="text-xs sm:text-sm text-muted">{dirty ? "Ada perubahan yang belum dipublikasikan" : active === "chatlogs" ? "Pertanyaan chatbot otomatis dicatat langsung dari widget AI" : "Semua perubahan telah tersimpan"}</p><div className="flex gap-3"><button disabled={!dirty || !!busy} onClick={() => { if (window.confirm("Buang semua perubahan yang belum dipublikasikan?")) { setDraft(saved.content); setError(""); } }} className="text-sm px-3 py-2 disabled:opacity-30">Buang perubahan</button><button disabled={!dirty || !!busy} onClick={save} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-900 text-white text-sm font-medium disabled:opacity-40"><IconDeviceFloppy size={18} /> Simpan & publikasikan</button></div></div></div>
    {busy && <div role="status" aria-live="polite" className="fixed inset-0 z-50 bg-emerald-950/30 backdrop-blur-sm flex items-center justify-center p-6"><div className="bg-white rounded-2xl p-7 shadow-xl flex items-center gap-4"><IconLoader2 className="animate-spin text-emerald-800" />{busy}</div></div>}
  </div>;
}
