"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconMail,
  IconPhone,
  IconRefresh,
  IconSearch,
  IconSchool,
  IconUsers,
} from "@tabler/icons-react";
import type { AdminApplicationListItem } from "@/lib/application-store";

export default function ApplicationViewer() {
  const [applications, setApplications] = useState<AdminApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadApplications() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/applications?limit=200");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Data pendaftar belum dapat dimuat.");
      setApplications(data.applications);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Data pendaftar belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadApplications(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter(item => [item.applicationNumber, item.applicant.fullName, item.applicant.email, item.applicant.phone, item.applicant.schoolOrigin, ...item.programChoices.map(program => program.label)].some(value => value.toLowerCase().includes(query)));
  }, [applications, search]);

  return <div className="space-y-5">
    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3"><span className="rounded-xl bg-emerald-900 p-2 text-white"><IconUsers size={19} /></span><div><h3 className="text-sm font-semibold text-emerald-950">Pendaftaran masuk</h3><p className="mt-0.5 text-xs leading-relaxed text-emerald-800">Menampilkan hingga 200 pendaftaran terbaru dari formulir PMB.</p></div></div>
      <button type="button" onClick={loadApplications} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 disabled:opacity-50"><IconRefresh size={15} className={loading ? "animate-spin" : ""} /> Segarkan</button>
    </div>

    <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
      <div className="rounded-2xl border border-line bg-paper p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Total ditampilkan</p><p className="mt-1 font-serif text-3xl text-emerald-950">{loading ? "…" : applications.length}</p></div>
      <label className="relative block self-end"><span className="sr-only">Cari pendaftar</span><IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari nomor, nama, email, telepon, sekolah, atau prodi…" className="w-full rounded-xl border border-line bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100" /></label>
    </div>

    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {!loading && !error && filtered.length === 0 && <div className="rounded-2xl border border-dashed border-line py-14 text-center"><p className="font-serif text-xl text-ink">Belum ada data yang cocok</p><p className="mt-2 text-sm text-muted">Pendaftaran baru akan muncul di sini setelah formulir berhasil dikirim.</p></div>}

    <div className="space-y-3">
      {filtered.map(item => {
        const expanded = expandedId === item.id;
        return <article key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
          <button type="button" onClick={() => setExpandedId(expanded ? null : item.id)} className="grid w-full gap-3 p-4 text-left transition hover:bg-paper sm:grid-cols-[150px_minmax(0,1fr)_180px_32px] sm:items-center">
            <span><span className="block text-xs text-muted">Nomor pendaftaran</span><span className="mt-1 block text-sm font-bold text-emerald-900">{item.applicationNumber}</span></span>
            <span><span className="block text-sm font-semibold text-ink">{item.applicant.fullName}</span><span className="mt-1 block text-xs text-muted">{item.programChoices[0]?.label || "Program belum tersedia"}</span></span>
            <span><span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">{item.status.label}</span><span className="mt-1 block text-xs text-muted">{new Date(item.submittedAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB</span></span>
            {expanded ? <IconChevronUp size={20} className="text-muted" /> : <IconChevronDown size={20} className="text-muted" />}
          </button>
          {expanded && <div className="border-t border-line bg-paper/50 p-4 sm:p-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Detail title="Identitas" rows={[["Jenis kelamin", item.applicant.gender], ["Tempat, tanggal lahir", `${item.applicant.birthPlace}, ${formatDate(item.applicant.birthDate)}`], ["Alamat", item.applicant.address]]} />
              <Detail title="Kontak & sekolah" rows={[["Telepon", item.applicant.phone], ["Email", item.applicant.email], ["Asal sekolah", item.applicant.schoolOrigin]]} />
              <Detail title="Pilihan pendaftaran" rows={[["Jalur", item.pathway], ...item.programChoices.map(program => [`Pilihan ${program.priority}`, `${program.label} — ${program.faculty}`])]} />
              <Detail title="Sumber informasi" rows={[["Mengetahui UNIPDU dari", item.discoverySources.length ? item.discoverySources.join(", ") : "Tidak diisi"]]} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4">
              <a href={`tel:${item.applicant.phone}`} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-body hover:border-emerald-700"><IconPhone size={15} /> Hubungi</a>
              <a href={`mailto:${item.applicant.email}`} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-body hover:border-emerald-700"><IconMail size={15} /> Kirim email</a>
              <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs text-muted"><IconSchool size={15} /> {item.applicant.schoolOrigin}</span>
            </div>
          </div>}
        </article>;
      })}
    </div>
  </div>;
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function Detail({ title, rows }: { title: string; rows: string[][] }) {
  return <section className="rounded-xl border border-line bg-white p-4"><h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">{title}</h4><dl className="mt-3 space-y-3">{rows.map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-0.5 break-words text-sm font-medium text-body">{value || "—"}</dd></div>)}</dl></section>;
}
