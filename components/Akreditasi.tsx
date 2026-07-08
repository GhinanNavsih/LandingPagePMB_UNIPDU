"use client";

import { motion } from "framer-motion";
import { IconAward, IconCircleCheck } from "@tabler/icons-react";

export default function Akreditasi() {
  return (
    <section id="akreditasi" className="py-20 bg-paper border-y border-line">
      <div className="max-w-[1060px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-pink font-semibold text-xs tracking-wider uppercase">
              Penjaminan Mutu Akademik
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight">
              Terakreditasi "Baik Sekali" Oleh BAN-PT
            </h2>
            <p className="text-[16px] text-body leading-relaxed">
              Kualitas pendidikan di UNIPDU Jombang telah resmi diakui dan terstandarisasi secara nasional oleh Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT). Komitmen kami adalah terus menyelenggarakan pendidikan berkualitas tinggi yang relevan dengan tuntutan zaman.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="text-pink flex-shrink-0">
                  <IconCircleCheck size={20} />
                </div>
                <span className="text-[15px] font-semibold text-body">
                  SK Akreditasi Institusi No. 377/SK/BAN-PT/Ak/PT/V/2023
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-pink flex-shrink-0">
                  <IconCircleCheck size={20} />
                </div>
                <span className="text-[15px] font-semibold text-body">
                  Kurikulum berbasis kompetensi dan nilai-nilai akhlakul karimah
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-pink flex-shrink-0">
                  <IconCircleCheck size={20} />
                </div>
                <span className="text-[15px] font-semibold text-body">
                  Dosen lulusan universitas ternama dalam dan luar negeri
                </span>
              </div>
            </div>
          </div>

          {/* Badge Display */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm bg-canvas border border-line rounded-2xl p-8 text-center shadow-[0_4px_20px_-4px_rgba(23,17,26,0.04)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-pink" />
              <div className="w-16 h-16 rounded-full bg-pink-soft border border-pink-border flex items-center justify-center text-pink mx-auto mb-6">
                <IconAward size={36} />
              </div>
              <h3 className="text-2xl font-bold text-ink">BAIK SEKALI</h3>
              <p className="text-xs font-semibold text-muted tracking-wider uppercase mt-1">
                Peringkat Akreditasi Institusi
              </p>
              <div className="my-6 border-t border-line border-dashed" />
              <p className="text-xs text-muted leading-relaxed">
                Keputusan BAN-PT
                <br />
                <span className="font-bold text-ink text-sm block mt-1">
                  No. 377/SK/BAN-PT/Ak/PT/V/2023
                </span>
              </p>
              <div className="mt-6 px-4 py-2 rounded-lg bg-paper border border-line text-[11px] font-semibold text-muted">
                Berlaku hingga 24 Mei 2028
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
