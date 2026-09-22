"use client";

export type FieldValue = string | boolean | FieldValue[] | { [key: string]: FieldValue };
const labels: Record<string, string> = {
  name: "Nama", university: "Nama universitas", description: "Deskripsi", registrationUrl: "Path atau URL pendaftaran", registrationLabel: "Teks tombol pendaftaran", metaTitle: "Judul di mesin pencari", metaDescription: "Deskripsi di mesin pencari",
  badge: "Label", title: "Judul", highlight: "Teks yang disorot", suffix: "Lanjutan judul", videoUrl: "URL video latar (MP4)", secondaryLabel: "Teks tombol program studi", value: "Nilai", label: "Keterangan",
  eyebrow: "Label bagian", faculties: "Fakultas", short: "Singkatan", programs: "Program studi", rating: "Peringkat", decree: "Nomor SK", authority: "Lembaga akreditasi", validUntil: "Masa berlaku", points: "Poin pendukung",
  buttonLabel: "Teks tombol", steps: "Tahapan", desc: "Deskripsi", items: "Jalur", subtitle: "Subjudul", details: "Rincian", featured: "Sorot jalur ini", address: "Alamat", whatsapp: "Nomor WhatsApp (tampilan)", whatsappUrl: "URL WhatsApp", email: "Email", hours: "Jam pelayanan", closed: "Hari libur", greeting: "Pesan pembuka", questions: "Pertanyaan awal", knowledge: "Pengetahuan chatbot",
};
const limits: Record<string, number> = { announcements: 20, stats: 10, faculties: 20, programs: 40, points: 10, steps: 10, items: 10, details: 10, questions: 8 };
function emptyLike(value: FieldValue): FieldValue {
  if (typeof value === "string") return "";
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [emptyLike(value[0])];
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, emptyLike(item)]));
}

export default function ContentFields({ value, onChange, path, label }: { value: FieldValue; onChange: (value: FieldValue) => void; path: string; label?: string }) {
  const key = path.split(".").at(-1)!;
  if (key === "lockedDormitories") return null;
  const title = label || labels[key] || key;
  const id = `field-${path}`;
  if (typeof value === "boolean") return <label htmlFor={id} className="flex items-center gap-3 text-sm py-2"><input id={id} type="checkbox" checked={value} onChange={event => onChange(event.target.checked)} className="accent-emerald-800 w-4 h-4" />{title}</label>;
  if (typeof value === "string") {
    const multiline = ["description", "desc", "address", "greeting", "knowledge"].includes(key);
    const inputClass = "mt-2 block w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm font-normal text-ink focus:outline-emerald-800";
    return <label htmlFor={id} className="block text-sm font-medium text-body">{title}
      {multiline ? <textarea id={id} rows={key === "knowledge" ? 24 : 4} maxLength={key === "knowledge" ? 80000 : 5000} value={value} onChange={event => onChange(event.target.value)} className={inputClass} /> : <input id={id} type={key === "email" ? "email" : "text"} maxLength={500} value={value} onChange={event => onChange(event.target.value)} className={inputClass} />}
      {key === "knowledge" && <span className="block text-xs text-muted mt-2">Informasi ini digunakan untuk menjawab pertanyaan pengunjung. Sebagian informasi resmi dikelola terpusat oleh sistem.</span>}
      {key === "videoUrl" && <span className="block text-xs text-muted mt-2">Gunakan URL HTTPS video MP4 atau path video yang sudah tersedia, misalnya /DJI_0484.MP4.</span>}
    </label>;
  }
  if (Array.isArray(value)) return <div className="space-y-4">
    <div className="flex justify-between items-center gap-3"><h3 className="font-medium">{title}</h3><span className="text-xs text-muted">{value.length} item</span></div>
    {value.map((item, index) => <div key={index} className="rounded-xl border border-line bg-paper/60 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-emerald-800">{title} {index + 1}</span><div className="flex items-center gap-2 text-xs">
        <button type="button" aria-label={`Naikkan ${title} ${index + 1}`} disabled={index === 0} className="rounded border px-2 py-1 disabled:opacity-30" onClick={() => { const copy = [...value]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; onChange(copy); }}>↑</button>
        <button type="button" aria-label={`Turunkan ${title} ${index + 1}`} disabled={index === value.length - 1} className="rounded border px-2 py-1 disabled:opacity-30" onClick={() => { const copy = [...value]; [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]; onChange(copy); }}>↓</button>
        <button type="button" disabled={value.length === 1} className="text-red-700 px-2 py-1 disabled:opacity-30" onClick={() => onChange(value.filter((_, i) => i !== index))}>Hapus</button>
      </div></div>
      <ContentFields value={item} path={`${path}.${index}`} label={typeof item === "string" ? `${title} ${index + 1}` : undefined} onChange={next => onChange(value.map((old, i) => i === index ? next : old))} />
    </div>)}
    <button type="button" disabled={value.length >= (limits[key] || 20)} className="rounded-xl border border-emerald-800/30 text-emerald-900 px-4 py-2 text-sm hover:bg-emerald-50 disabled:opacity-40" onClick={() => onChange([...value, emptyLike(value[0])])}>+ Tambah {title.toLowerCase()}</button>
  </div>;
  return <div className="space-y-5">{Object.entries(value).filter(([key]) => key !== "lockedDormitories").map(([key, child]) => <ContentFields key={key} path={`${path}.${key}`} value={child} onChange={next => onChange({ ...value, [key]: next })} />)}</div>;
}
