"use client";

import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-canvas">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e9e4e8_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-soft/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1060px] mx-auto px-6 relative z-10 w-full text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-soft border border-pink-border text-pink font-semibold text-xs tracking-wider uppercase mb-6"
        >
          <span>Penerimaan Mahasiswa Baru • 2026/2027</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Mulai Langkah Suksesmu Bersama{" "}
          <span className="text-pink">Unipdu Jombang</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[16px] md:text-[18px] text-muted leading-relaxed max-w-2xl mx-auto mt-6"
        >
          Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) menggabungkan keunggulan akademik dengan nilai-nilai luhur pesantren untuk mencetak generasi berprestasi dan berkarakter mulia.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-pink text-white font-semibold text-[15px] hover:bg-pink-dark transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Daftar Sekarang
            <IconArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#programs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-canvas border border-line text-body font-semibold text-[15px] hover:bg-paper hover:border-pink-border hover:text-pink transition-all duration-200 flex items-center justify-center active:scale-[0.98]"
          >
            Lihat Program Studi
          </a>
        </motion.div>

        {/* Accreditation & Stats Badge preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 inline-flex items-center gap-6 px-5 py-3 rounded-xl border border-line bg-paper/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted">Akreditasi Institusi</span>
            <span className="text-sm font-bold text-ink">Baik Sekali</span>
          </div>
          <div className="w-px h-8 bg-line" />
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted">Keputusan BAN-PT</span>
            <span className="text-sm font-bold text-ink">377/SK/BAN-PT/2023</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
