"use client";

export default function RunningText() {
  const announcements = [
    "📢 Penerimaan Mahasiswa Baru UNIPDU 2026/2027 Telah Dibuka!",
    "🏆 Akreditasi Institusi \"Baik Sekali\" — SK BAN-PT No. 377/SK/BAN-PT/Ak/PT/V/2023",
    "🎓 5 Fakultas & 15+ Program Studi Unggulan",
    "🎁 Tersedia 8 Program Beasiswa untuk Mahasiswa Baru",
    "📋 Jalur Masuk: PMDK (Rapor), Reguler (TPA Online), RPL (Pekerja/D3)",
    "💻 Pendaftaran 100% Online — Daftar Sekarang di Portal PMB!",
  ];

  // Duplicate for seamless loop
  const items = [...announcements, ...announcements];

  return (
    <section className="relative overflow-hidden bg-pink py-3 select-none">
      {/* Gradient fades on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-pink to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-pink to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-8 text-sm font-semibold text-white/95 tracking-wide"
          >
            {text}
            <span className="text-white/40">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
