"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCircleCheckFilled,
  IconClipboardCheck,
  IconLoader2,
  IconMail,
  IconPhone,
  IconSchool,
  IconUser,
} from "@tabler/icons-react";
import {
  ACTIVE_ADMISSION_CYCLE,
  ADMISSION_PATHWAYS,
  DISCOVERY_SOURCES,
  GENDER_OPTIONS,
  STUDY_PROGRAMS,
  catalogItem,
} from "@/lib/admissions-catalog";
import {
  applicationSubmissionSchema,
  EMPTY_APPLICATION_DRAFT,
  type ApplicationDraft,
} from "@/lib/application-schema";
import CustomProgramSelect from "./CustomProgramSelect";
import KabupatenSearchSelect from "./KabupatenSearchSelect";
import AlamatCascadeSelect from "./AlamatCascadeSelect";

type FieldName = keyof ApplicationDraft;
type Contact = { whatsapp: string; whatsappUrl: string; email: string };

const stepDefinitions = [
  { title: "Pilihan studi", description: "Jalur dan program studi", fields: ["pathwayCode", "primaryProgramCode", "secondaryProgramCode"] as FieldName[] },
  { title: "Data pribadi", description: "Identitas calon mahasiswa", fields: ["fullName", "gender", "birthPlace", "birthDate"] as FieldName[] },
  { title: "Kontak & sekolah", description: "Informasi yang dapat dihubungi", fields: ["address", "phone", "email", "schoolOrigin"] as FieldName[] },
  { title: "Periksa kembali", description: "Pastikan semua data benar", fields: [] as FieldName[] },
] as const;

const validationKey = "00000000-0000-4000-8000-000000000000";

function errorsFor(draft: ApplicationDraft) {
  const parsed = applicationSubmissionSchema.safeParse({ ...draft, idempotencyKey: validationKey, website: "" });
  const errors: Partial<Record<FieldName, string>> = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName;
      if (field && !errors[field]) errors[field] = issue.message;
    }
  }
  return errors;
}

function hasValue(value: ApplicationDraft[FieldName]) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function FieldShell({ name, label, required, hint, touched, editing, error, value, children }: {
  name: FieldName;
  label: string;
  required?: boolean;
  hint?: string;
  touched: boolean;
  editing: boolean;
  error?: string;
  value: ApplicationDraft[FieldName];
  children: React.ReactNode;
}) {
  const showError = touched && !editing && Boolean(error);
  const showSuccess = touched && !editing && !error && hasValue(value);
  return <div className="space-y-2">
    <div className="flex items-start justify-between gap-3">
      <label htmlFor={name} className="text-sm font-semibold text-ink">{label}{required && <span className="text-red-700"> *</span>}</label>
      {showSuccess && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><IconCircleCheckFilled size={15} /> Lengkap</span>}
    </div>
    {children}
    {hint && !showError && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
    {showError && <p id={`${name}-error`} role="alert" className="text-sm text-red-700">{error}</p>}
  </div>;
}

function ProgramSelect({ id, value, onChange, onBlur, onFocus, exclude, required }: {
  id: "primaryProgramCode" | "secondaryProgramCode";
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  exclude?: string;
  required?: boolean;
}) {
  return (
    <CustomProgramSelect
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      exclude={exclude}
      required={required}
    />
  );
}

export default function RegistrationForm({ contact }: { contact: Contact }) {
  const [draft, setDraft] = useState<ApplicationDraft>(EMPTY_APPLICATION_DRAFT);
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [editingField, setEditingField] = useState<FieldName | null>(null);
  const [showSecondary, setShowSecondary] = useState(false);
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const idempotencyKey = useRef("");
  const errors = useMemo(() => errorsFor(draft), [draft]);
  const progress = (step + 1) * 25;

  function update<K extends FieldName>(field: K, value: ApplicationDraft[K]) {
    setDraft(previous => ({ ...previous, [field]: value }));
    setErrorMessage("");
  }

  function blur(field: FieldName) {
    setEditingField(null);
    setTouched(previous => ({ ...previous, [field]: true }));
  }

  function focusFirstInvalid(fields: readonly FieldName[]) {
    const first = fields.find(field => errors[field]);
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  }

  function nextStep() {
    const fields = stepDefinitions[step].fields;
    setTouched(previous => ({ ...previous, ...Object.fromEntries(fields.map(field => [field, true])) }));
    if (fields.some(field => errors[field])) {
      focusFirstInvalid(fields);
      return;
    }
    setStep(current => Math.min(current + 1, stepDefinitions.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < stepDefinitions.length - 1) { nextStep(); return; }
    const allFields = Object.keys(draft) as FieldName[];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));
    if (Object.keys(errors).length) {
      const invalidStep = stepDefinitions.findIndex(item => item.fields.some(field => errors[field]));
      setStep(Math.max(0, invalidStep));
      focusFirstInvalid(allFields);
      return;
    }

    setBusy(true);
    setErrorMessage("");
    try {
      if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, idempotencyKey: idempotencyKey.current, website }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Pendaftaran belum dapat disimpan.");
      setApplicationNumber(result.applicationNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Pendaftaran belum dapat disimpan.");
    } finally {
      setBusy(false);
    }
  }

  if (applicationNumber) return <div className="min-h-screen bg-paper px-5 py-10 sm:py-16">
    <main className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_80px_-30px_rgba(6,26,18,0.28)]">
      <div className="bg-emerald-950 px-6 py-8 text-center text-white sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/40 bg-white/10 text-amber-300"><IconCheck size={34} strokeWidth={2} /></div>
        <h1 className="mt-5 font-serif text-3xl">Pendaftaran berhasil diterima</h1>
        <p className="mt-2 text-base leading-relaxed text-emerald-100/80">Simpan nomor pendaftaran ini untuk komunikasi dengan tim PMB.</p>
      </div>
      <div className="space-y-7 px-6 py-8 text-center sm:px-10">
        <div className="rounded-2xl border border-gold-border bg-gold-soft px-5 py-5">
          <p className="text-sm font-medium text-muted">Nomor pendaftaran</p>
          <p className="mt-1 font-serif text-3xl font-semibold tracking-wide text-emerald-950">{applicationNumber}</p>
        </div>
        <p className="text-base leading-relaxed text-body">Tim PMB dapat menghubungi Anda melalui nomor telepon atau email yang didaftarkan untuk tahapan berikutnya.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="rounded-xl border border-line px-5 py-3 text-sm font-semibold text-body transition hover:border-emerald-700 hover:text-emerald-800">Kembali ke beranda</a>
          <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-950">Hubungi PMB</a>
        </div>
      </div>
    </main>
  </div>;

  const inputClass = "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink placeholder:text-muted/60 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100";
  const fieldState = (field: FieldName) => ({ touched: Boolean(touched[field]), editing: editingField === field, error: errors[field], value: draft[field] });
  const pathway = catalogItem(ADMISSION_PATHWAYS, draft.pathwayCode);
  const primary = catalogItem(STUDY_PROGRAMS, draft.primaryProgramCode);
  const secondary = catalogItem(STUDY_PROGRAMS, draft.secondaryProgramCode);
  const gender = catalogItem(GENDER_OPTIONS, draft.gender);

  return <div className="min-h-screen bg-paper">
    <header className="border-b border-emerald-900 bg-emerald-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <Image src="/logo-unipdu.png" alt="Logo UNIPDU" width={46} height={42} className="h-10 w-auto object-contain" />
          <div className="min-w-0"><p className="font-serif text-lg leading-tight">PMB UNIPDU</p><p className="truncate text-xs text-emerald-100/70">Pendaftaran Mahasiswa Baru</p></div>
        </a>
        <span className="rounded-full border border-amber-300/30 bg-white/5 px-3 py-1.5 text-xs font-semibold text-amber-200">T.A. {ACTIVE_ADMISSION_CYCLE.label}</span>
      </div>
    </header>

    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-8 space-y-7">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"><IconArrowLeft size={17} /> Kembali ke beranda</a>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Formulir pendaftaran</p>
            <h1 className="mt-3 font-serif text-3xl leading-tight text-ink">Mulai langkah Anda di UNIPDU</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">Isi bertahap. Tanda bintang menunjukkan data yang wajib diisi.</p>
          </div>
          <ol className="space-y-2">
            {stepDefinitions.map((item, index) => <li key={item.title}>
              <button type="button" disabled={index > step} onClick={() => setStep(index)} className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${index === step ? "bg-emerald-900 text-white" : index < step ? "text-emerald-900 hover:bg-emerald-50" : "cursor-default text-muted/60"}`}>
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index === step ? "bg-amber-300 text-emerald-950" : index < step ? "bg-emerald-100 text-emerald-800" : "bg-paper-alt text-muted"}`}>{index < step ? <IconCheck size={14} /> : index + 1}</span>
                <span><span className="block text-sm font-semibold">{item.title}</span><span className={`mt-0.5 block text-xs ${index === step ? "text-emerald-100/75" : "text-muted"}`}>{item.description}</span></span>
              </button>
            </li>)}
          </ol>
          <div className="rounded-2xl border border-line bg-white p-4 text-sm">
            <p className="font-semibold text-ink">Butuh bantuan?</p>
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 text-emerald-800 hover:underline"><IconPhone size={16} /> {contact.whatsapp}</a>
            <a href={`mailto:${contact.email}`} className="mt-2 flex items-center gap-2 break-all text-emerald-800 hover:underline"><IconMail size={16} /> {contact.email}</a>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 lg:hidden"><a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><IconArrowLeft size={17} /> Kembali</a></div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-emerald-800">Langkah {step + 1} dari 4</p><h1 className="mt-1 font-serif text-3xl text-ink">{stepDefinitions[step].title}</h1></div>
          <span className="text-sm font-semibold text-muted">{progress}%</span>
        </div>
        <div className="mb-7 h-2 overflow-hidden rounded-full bg-paper-alt" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`Langkah ${step + 1} dari 4`}><div className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-gold transition-all duration-300" style={{ width: `${progress}%` }} /></div>

        <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-white p-5 shadow-[0_18px_60px_-34px_rgba(6,26,18,0.25)] sm:p-8">
          {errorMessage && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorMessage}</div>}

          {step === 0 && <div className="space-y-8">
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-ink">Pilihan jalur <span className="text-red-700">*</span></legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {ADMISSION_PATHWAYS.map(item => <label key={item.code} className={`cursor-pointer rounded-2xl border p-4 transition ${draft.pathwayCode === item.code ? "border-emerald-700 bg-emerald-50 ring-2 ring-emerald-100" : "border-line hover:border-emerald-600/50"}`}>
                  <input id={item.code === ADMISSION_PATHWAYS[0].code ? "pathwayCode" : undefined} type="radio" name="pathwayCode" value={item.code} checked={draft.pathwayCode === item.code} onChange={() => { update("pathwayCode", item.code); setTouched(previous => ({ ...previous, pathwayCode: true })); }} className="sr-only" />
                  <span className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-ink">{item.label}</span>{draft.pathwayCode === item.code && <IconCircleCheckFilled size={18} className="text-emerald-700" />}</span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted">{item.description}</span>
                </label>)}
              </div>
              {touched.pathwayCode && errors.pathwayCode && <p role="alert" className="text-sm text-red-700">{errors.pathwayCode}</p>}
            </fieldset>

            <FieldShell name="primaryProgramCode" label="Pilihan program studi pertama" required {...fieldState("primaryProgramCode")}>
              <ProgramSelect id="primaryProgramCode" value={draft.primaryProgramCode} required exclude={draft.secondaryProgramCode} onChange={value => update("primaryProgramCode", value as ApplicationDraft["primaryProgramCode"])} onFocus={() => setEditingField("primaryProgramCode")} onBlur={() => blur("primaryProgramCode")} />
            </FieldShell>

            {!showSecondary && !draft.secondaryProgramCode ? <button type="button" onClick={() => setShowSecondary(true)} className="text-sm font-semibold text-emerald-800 hover:underline">+ Tambahkan pilihan program studi kedua (opsional)</button> : <div className="space-y-3">
              <FieldShell name="secondaryProgramCode" label="Pilihan program studi kedua" hint="Pilihan ini opsional dan harus berbeda dari pilihan pertama." {...fieldState("secondaryProgramCode")}>
                <ProgramSelect id="secondaryProgramCode" value={draft.secondaryProgramCode} exclude={draft.primaryProgramCode} onChange={value => update("secondaryProgramCode", value as ApplicationDraft["secondaryProgramCode"])} onFocus={() => setEditingField("secondaryProgramCode")} onBlur={() => blur("secondaryProgramCode")} />
              </FieldShell>
              <button type="button" onClick={() => { update("secondaryProgramCode", ""); setShowSecondary(false); }} className="text-sm text-muted hover:text-red-700">Hapus pilihan kedua</button>
            </div>}
          </div>}

          {step === 1 && <div className="space-y-7">
            <FieldShell name="fullName" label="Nama lengkap" required hint="Tuliskan sesuai ijazah atau identitas resmi." {...fieldState("fullName")}>
              <div className="relative"><IconUser aria-hidden size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input id="fullName" name="fullName" autoComplete="name" value={draft.fullName} onChange={event => update("fullName", event.target.value)} onFocus={() => setEditingField("fullName")} onBlur={() => blur("fullName")} placeholder="Contoh: Ahmad Fulan" className={`${inputClass} pl-11`} /></div>
            </FieldShell>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-ink">Jenis kelamin <span className="text-red-700">*</span></legend>
              <div className="grid grid-cols-2 gap-3">
                {GENDER_OPTIONS.map(item => <label key={item.code} className={`cursor-pointer rounded-xl border px-4 py-3.5 text-center text-sm font-semibold transition ${draft.gender === item.code ? "border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100" : "border-line text-body hover:border-emerald-600/50"}`}>
                  <input id={item.code === GENDER_OPTIONS[0].code ? "gender" : undefined} type="radio" name="gender" value={item.code} checked={draft.gender === item.code} onChange={() => { update("gender", item.code); setTouched(previous => ({ ...previous, gender: true })); }} className="sr-only" />{item.label}
                </label>)}
              </div>
              {touched.gender && errors.gender && <p role="alert" className="text-sm text-red-700">{errors.gender}</p>}
            </fieldset>
            <FieldShell name="birthPlace" label="Tempat lahir" required hint="Pilih atau cari kota/kabupaten kelahiran Anda." {...fieldState("birthPlace")}>
              <KabupatenSearchSelect id="birthPlace" value={draft.birthPlace} onChange={nama => update("birthPlace", nama)} onFocus={() => setEditingField("birthPlace")} onBlur={() => blur("birthPlace")} />
            </FieldShell>
            <FieldShell name="birthDate" label="Tanggal lahir" required hint="Gunakan pemilih tanggal agar hari, bulan, dan tahun terisi sekaligus." {...fieldState("birthDate")}>
              <input id="birthDate" name="birthDate" type="date" min="1940-01-01" max={new Date().toISOString().slice(0, 10)} value={draft.birthDate} onChange={event => update("birthDate", event.target.value)} onFocus={() => setEditingField("birthDate")} onBlur={() => blur("birthDate")} className={inputClass} />
            </FieldShell>
          </div>}

          {step === 2 && <div className="space-y-7">
            <FieldShell name="address" label="Alamat lengkap" required hint="Pilih wilayah asal calon mahasiswa secara berurutan." {...fieldState("address")}>
              <AlamatCascadeSelect id="address" value={draft.address} onChange={composed => update("address", composed)} onFocus={() => setEditingField("address")} onBlur={() => blur("address")} />
            </FieldShell>
            <FieldShell name="phone" label="Nomor telepon / HP" required hint="Gunakan nomor WhatsApp aktif agar tim PMB mudah menghubungi Anda." {...fieldState("phone")}>
              <div className="relative"><IconPhone aria-hidden size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={draft.phone} onChange={event => update("phone", event.target.value)} onFocus={() => setEditingField("phone")} onBlur={() => blur("phone")} placeholder="Contoh: 0812 3456 7890" className={`${inputClass} pl-11`} /></div>
            </FieldShell>
            <FieldShell name="email" label="Email aktif" required hint="Informasi proses pendaftaran dapat dikirim ke alamat ini." {...fieldState("email")}>
              <div className="relative"><IconMail aria-hidden size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={draft.email} onChange={event => update("email", event.target.value)} onFocus={() => setEditingField("email")} onBlur={() => blur("email")} placeholder="nama@email.com" className={`${inputClass} pl-11`} /></div>
            </FieldShell>
            <FieldShell name="schoolOrigin" label="Asal sekolah" required {...fieldState("schoolOrigin")}>
              <div className="relative"><IconSchool aria-hidden size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input id="schoolOrigin" name="schoolOrigin" autoComplete="organization" value={draft.schoolOrigin} onChange={event => update("schoolOrigin", event.target.value)} onFocus={() => setEditingField("schoolOrigin")} onBlur={() => blur("schoolOrigin")} placeholder="Nama SMA, SMK, MA, pesantren, atau perguruan tinggi" className={`${inputClass} pl-11`} /></div>
            </FieldShell>
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-ink">Dari mana Anda mengetahui UNIPDU?</legend>
              <p className="text-xs text-muted">Boleh memilih lebih dari satu.</p>
              <div className="flex flex-wrap gap-2.5">
                {DISCOVERY_SOURCES.map(item => {
                  const selected = draft.discoverySourceCodes.includes(item.code);
                  return <label key={item.code} className={`cursor-pointer rounded-xl border px-3.5 py-2.5 text-sm font-medium transition ${selected ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-line bg-white text-body hover:border-emerald-600/50"}`}>
                    <input type="checkbox" value={item.code} checked={selected} onChange={() => update("discoverySourceCodes", selected ? draft.discoverySourceCodes.filter(code => code !== item.code) : [...draft.discoverySourceCodes, item.code])} className="sr-only" />
                    <span className="inline-flex items-center gap-2">{selected && <IconCheck size={15} />}{item.label}</span>
                  </label>;
                })}
              </div>
            </fieldset>
          </div>}

          {step === 3 && <div className="space-y-7">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-950">Periksa data sebelum dikirim. Anda masih dapat kembali ke bagian sebelumnya untuk memperbaikinya.</div>
            <ReviewSection title="Pilihan studi" onEdit={() => setStep(0)} rows={[
              ["Jalur", pathway?.label || "—"],
              ["Pilihan pertama", primary?.label || "—"],
              ["Pilihan kedua", secondary?.label || "Tidak ada"],
            ]} />
            <ReviewSection title="Data pribadi" onEdit={() => setStep(1)} rows={[
              ["Nama lengkap", draft.fullName],
              ["Jenis kelamin", gender?.label || "—"],
              ["Tempat, tanggal lahir", `${draft.birthPlace}, ${draft.birthDate ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${draft.birthDate}T00:00:00Z`)) : "—"}`],
            ]} />
            <ReviewSection title="Kontak & sekolah" onEdit={() => setStep(2)} rows={[
              ["Alamat", draft.address],
              ["Nomor telepon", draft.phone],
              ["Email", draft.email],
              ["Asal sekolah", draft.schoolOrigin],
              ["Mengetahui UNIPDU dari", draft.discoverySourceCodes.length ? draft.discoverySourceCodes.map(code => catalogItem(DISCOVERY_SOURCES, code)?.label).filter(Boolean).join(", ") : "Tidak diisi"],
            ]} />
            <p className="text-sm leading-relaxed text-muted">Dengan mengirimkan formulir, Anda menyetujui penggunaan data ini untuk proses Penerimaan Mahasiswa Baru UNIPDU.</p>
          </div>}

          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" aria-hidden="true" />

          <div className="mt-9 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            {step > 0 ? <button type="button" onClick={() => setStep(current => current - 1)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3.5 text-sm font-semibold text-body transition hover:border-emerald-700 hover:text-emerald-800"><IconArrowLeft size={17} /> Sebelumnya</button> : <span />}
            {step < stepDefinitions.length - 1 ? <button type="button" onClick={nextStep} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-950">Lanjutkan <IconArrowRight size={17} /></button> : <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-gold-light disabled:opacity-60"><IconClipboardCheck size={18} /> Kirim pendaftaran</button>}
          </div>
        </form>
      </section>
    </main>

    {busy && <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/35 p-6 backdrop-blur-sm"><div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-5 text-sm font-semibold text-ink shadow-2xl"><IconLoader2 className="animate-spin text-emerald-800" /> Menyimpan pendaftaran Anda…</div></div>}
  </div>;
}

function ReviewSection({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return <section className="overflow-hidden rounded-2xl border border-line">
    <div className="flex items-center justify-between gap-4 border-b border-line bg-paper px-4 py-3"><h2 className="font-serif text-lg text-ink">{title}</h2><button type="button" onClick={onEdit} className="text-sm font-semibold text-emerald-800 hover:underline">Ubah</button></div>
    <dl className="divide-y divide-line px-4">
      {rows.map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-4"><dt className="text-sm text-muted">{label}</dt><dd className="break-words text-sm font-medium text-body">{value || "—"}</dd></div>)}
    </dl>
  </section>;
}
