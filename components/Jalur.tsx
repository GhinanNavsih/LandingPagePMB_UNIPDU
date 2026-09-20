"use client";

import { motion } from "framer-motion";
import { IconFileSearch, IconUsers, IconBriefcase, IconCircleCheck } from "@tabler/icons-react";

export default function Jalur() {
  const pathways = [
    {
      icon: IconFileSearch,
      title: "Jalur PMDK",
      subtitle: "Penelusuran Minat & Kemampuan",
      desc: "Seleksi masuk tanpa tes tertulis berbasis prestasi akademik (nilai rapor) maupun prestasi non-akademik.",
      details: [
        "Seleksi berdasarkan Nilai Rapor (Sem. 1-5)",
        "Kesempatan mendapat Beasiswa Khusus",
        "Terbuka untuk lulusan 2 tahun terakhir",
      ],
      badge: "Prestasi & Rapor",
    },
    {
      icon: IconUsers,
      title: "Jalur Reguler",
      subtitle: "Seleksi Umum",
      desc: "Jalur penerimaan umum bagi lulusan SMA/SMK/MA sederajat melalui tes potensi akademik secara online.",
      details: [
        "Tes Potensi Akademik (TPA) online",
        "Tersedia berbagai pilihan kelas",
        "Akses program KIP Kuliah & Beasiswa Mitra",
      ],
      badge: "Terbuka Umum",
      featured: true,
    },
    {
      icon: IconBriefcase,
      title: "Jalur RPL",
      subtitle: "Rekognisi Pembelajaran Lampau",
      desc: "Jalur khusus bagi pekerja/profesional untuk mengonversi pengalaman kerja menjadi SKS akademik.",
      details: [
        "Konversi masa kerja/pelatihan menjadi SKS",
        "Masa studi S1 lebih singkat (~2 tahun)",
        "Jadwal kuliah fleksibel (hybrid/malam)",
      ],
      badge: "Pekerja / Lulusan D3",
    },
  ];

  return (
    <section id="jalur" className="py-24 bg-paper">
      <div className="max-w-[1080px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-emerald-800 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
            <span className="text-gold text-xs">✦</span>
            <span>Jalur Penerimaan</span>
            <span className="text-gold text-xs">✦</span>
          </span>
          <h2 className="font-serif text-3xl md:text-[42px] font-normal text-ink mt-3 leading-tight">
            Pilihan <span className="italic font-normal text-emerald-800">Jalur Masuk</span> Calon Mahasiswa
          </h2>
          <p className="text-[15.5px] text-muted mt-4 leading-relaxed">
            Tentukan skema seleksi yang paling sesuai dengan kualifikasi akademik, prestasi, maupun kebutuhan profesional Anda.
          </p>
        </div>

        {/* Grid Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pathways.map((path, idx) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white border rounded-2xl p-7 md:p-8 transition-all duration-200 flex flex-col justify-between ${
                  path.featured
                    ? "border-gold/60 shadow-[0_12px_32px_-8px_rgba(197,147,40,0.12)] relative"
                    : "border-line hover:border-emerald-700/30 shadow-[0_4px_16px_rgba(18,27,22,0.02)]"
                }`}
              >
                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`p-3.5 rounded-xl border ${
                        path.featured
                          ? "bg-gold-soft text-emerald-900 border-gold-border"
                          : "bg-paper text-emerald-800 border-line"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide uppercase ${
                        path.featured
                          ? "bg-emerald-900 text-amber-200"
                          : "bg-paper text-muted border border-line"
                      }`}
                    >
                      {path.badge}
                    </span>
                  </div>

                  {/* Titles */}
                  <h3 className="font-serif text-2xl font-medium text-ink leading-tight">{path.title}</h3>
                  <h4 className="text-[11.5px] font-medium text-muted tracking-wide uppercase mt-1">
                    {path.subtitle}
                  </h4>

                  {/* Description */}
                  <p className="text-[14px] text-body/90 leading-relaxed mt-4">{path.desc}</p>

                  <div className="my-6 border-t border-line" />

                  {/* Details List */}
                  <ul className="space-y-3">
                    {path.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <span className="text-emerald-800 mt-0.5 flex-shrink-0">
                          <IconCircleCheck size={17} />
                        </span>
                        <span className="text-[13.5px] text-body leading-normal font-medium">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button */}
                <div className="mt-8">
                  <a
                    href="https://pmb.unipdu.ac.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center block px-4 py-3 rounded-xl font-medium text-[14px] transition-all duration-200 active:scale-[0.98] ${
                      path.featured
                        ? "bg-emerald-900 text-white hover:bg-emerald-950 shadow-sm"
                        : "bg-paper border border-line text-body hover:bg-white hover:border-emerald-700/40 hover:text-emerald-900"
                    }`}
                  >
                    Daftar Melalui {path.title}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
