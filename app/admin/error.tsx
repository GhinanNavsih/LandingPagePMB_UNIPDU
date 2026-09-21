"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return <main className="min-h-screen grid place-items-center p-6"><div className="max-w-md bg-white border rounded-2xl p-8"><h1 className="text-2xl font-serif">Admin belum dapat dimuat</h1><p className="mt-3">Koneksi layanan sedang bermasalah. Silakan coba lagi.</p><button className="mt-6 bg-emerald-900 text-white rounded-xl px-5 py-3" onClick={reset}>Coba lagi</button></div></main>;
}
