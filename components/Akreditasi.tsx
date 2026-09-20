"use client";

import { motion } from "framer-motion";
import { IconAward, IconCircleCheck } from "@tabler/icons-react";

export default function Akreditasi() {
  return (
    <section id="akreditasi" className="py-24 bg-canvas border-b border-line">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-emerald-800 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
              <span className="text-gold text-xs">✦</span>
              <span>Penjaminan Mutu Akademik</span>
            </span>
            <h2 className="font-serif text-3xl md:text-[42px] font-normal text-ink leading-tight">
              Terakreditasi <span className="italic font-normal text-emerald-800">"Baik Sekali"</span> oleh BAN-PT
            </h2>
            <p className="text-[15.5px] text-body/90 leading-relaxed">
              Standar mutu pendidikan dan tata kelola akademik di UNIPDU Jombang telah resmi teruji dan terstandarisasi secara nasional oleh Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT). Komitmen kami adalah konsistensi menghadirkan pembelajaran unggul berbasis integritas ilmiah dan moralitas pesantren.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="text-emerald-800 flex-shrink-0 mt-0.5">
                  <IconCircleCheck size={21} />
                </div>
                <span className="text-[14.5px] font-medium text-body">
                  Surat Keputusan Akreditasi Institusi BAN-PT No. 377/SK/BAN-PT/Ak/PT/V/2023
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="text-emerald-800 flex-shrink-0 mt-0.5">
                  <IconCircleCheck size={21} />
                </div>
                <span className="text-[14.5px] font-medium text-body">
                  Kurikulum terintegrasi sains modern dengan nilai-nilai luhur akhlakul karimah
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="text-emerald-800 flex-shrink-0 mt-0.5">
                  <IconCircleCheck size={21} />
                </div>
                <span className="text-[14.5px] font-medium text-body">
                  Didukung para dosen dan guru besar lulusan universitas ternama dalam dan luar negeri
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
              className="w-full max-w-sm bg-white border border-line rounded-2xl p-8 text-center shadow-[0_8px_30px_-6px_rgba(18,27,22,0.06)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-900 via-gold to-emerald-900" />
              <div className="w-16 h-16 rounded-full bg-gold-soft border border-gold-border flex items-center justify-center text-gold mx-auto mb-5 shadow-xs">
                <IconAward size={34} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-emerald-950 tracking-wide">
                BAIK SEKALI
              </h3>
              <p className="text-[11.5px] font-medium text-muted tracking-wider uppercase mt-1">
                Peringkat Akreditasi Institusi
              </p>
              <div className="my-6 border-t border-line border-dashed" />
              <p className="text-xs text-muted leading-relaxed">
                Badan Akreditasi Nasional Perguruan Tinggi
                <br />
                <span className="font-semibold text-ink text-[13px] block mt-1.5">
                  No. 377/SK/BAN-PT/Ak/PT/V/2023
                </span>
              </p>
              <div className="mt-6 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200/70 text-[11.5px] font-medium text-emerald-900">
                Berlaku Sah hingga 24 Mei 2028
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
