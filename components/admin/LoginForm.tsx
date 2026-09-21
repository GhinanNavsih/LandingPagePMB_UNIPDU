"use client";
import { useState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconLock, IconLoader2 } from "@tabler/icons-react";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      window.location.assign("/admin");
    } catch (error) { setError(error instanceof Error ? error.message : "Gagal terhubung. Coba lagi."); setBusy(false); }
  }
  return <main className="min-h-screen bg-paper flex items-center justify-center px-5 py-12">
    <div className="w-full max-w-md">
      <Link href="/" className="inline-flex gap-2 items-center text-sm text-emerald-800 mb-8"><IconArrowLeft size={16} /> Kembali ke landing page</Link>
      <div className="bg-white border border-line rounded-2xl p-7 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-8"><img src="/logo-unipdu.png" alt="UNIPDU" className="w-12" /><div><p className="font-serif text-xl text-emerald-950">PMB UNIPDU</p><p className="text-xs text-muted">Pengelolaan informasi</p></div></div>
        <h1 className="text-3xl font-serif text-ink">Masuk sebagai admin</h1>
        <p className="text-sm text-muted mt-3 mb-7">Perbarui informasi penerimaan mahasiswa baru dalam satu tempat.</p>
        <form onSubmit={submit} className="space-y-5">
          <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
            <label className="block text-sm font-medium">Email admin<input name="email" type="email" autoComplete="username" required maxLength={254} className="mt-2 w-full rounded-xl border border-line px-4 py-3 focus:outline-emerald-800" /></label>
            <label className="block text-sm font-medium">Kata sandi<input name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 w-full rounded-xl border border-line px-4 py-3 focus:outline-emerald-800" /></label>
            {error && <p role="alert" className="rounded-xl bg-red-50 text-red-800 p-3 text-sm">{error}</p>}
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-900 text-white py-3 font-medium hover:bg-emerald-950">{busy ? <IconLoader2 size={18} className="animate-spin" /> : <IconLock size={18} />}{busy ? "Sedang masuk…" : "Masuk"}</button>
          </fieldset>
        </form>
      </div>
    </div>
  </main>;
}
