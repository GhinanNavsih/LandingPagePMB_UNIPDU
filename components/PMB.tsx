"use client";

import { motion } from "framer-motion";
import {
  IconUserPlus,
  IconCreditCard,
  IconFileText,
  IconClipboardCheck,
  IconConfetti,
} from "@tabler/icons-react";

export default function PMB() {
  const steps = [
    {
      icon: IconUserPlus,
      title: "Registrasi Akun",
      desc: "Buat akun calon mahasiswa di portal pendaftaran dengan email aktif.",
    },
    {
      icon: IconCreditCard,
      title: "Biaya Pendaftaran",
      desc: "Lakukan pembayaran biaya pendaftaran secara online untuk aktivasi formulir.",
    },
    {
      icon: IconFileText,
      title: "Lengkapi Berkas & Biodata",
      desc: "Isi biodata lengkap dan unggah dokumen pendukung seperti scan Ijazah, Rapor, dan KK.",
    },
    {
      icon: IconClipboardCheck,
      title: "Ujian Seleksi (Online)",
      desc: "Ikuti ujian seleksi online sesuai jadwal dan program studi yang dipilih.",
    },
    {
      icon: IconConfetti,
      title: "Daftar Ulang & Kelulusan",
      desc: "Lihat pengumuman kelulusan di dashboard, lalu lakukan proses daftar ulang.",
    },
  ];

  return (
    <section id="pmb" className="py-20 bg-ink text-white relative overflow-hidden">
      {/* Background Subtle Shape */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-[1060px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-pink-bright font-semibold text-xs tracking-wider uppercase">
            Alur Pendaftaran
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
            Cara Mendaftar Online di UNIPDU
          </h2>
          <p className="text-[16px] text-white/72 mt-4 leading-relaxed">
            Proses penerimaan mahasiswa baru dilakukan sepenuhnya secara online. Ikuti 5 langkah mudah berikut ini:
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px bg-white/10 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center relative z-10 group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-2 bg-pink-bright text-ink text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="w-[88px] h-[88px] rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-pink-bright mb-5 group-hover:bg-white/[0.08] group-hover:border-pink-bright/30 transition-all duration-200 shadow-inner">
                  <Icon size={34} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-white/72 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Box */}
        <div className="mt-16 text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-pink-bright text-ink font-bold text-[15px] hover:bg-white hover:text-ink transition-all duration-200 shadow-md active:scale-[0.98]"
          >
            Mulai Registrasi Akun PMB
          </a>
        </div>
      </div>
    </section>
  );
}
