"use client";

import { motion } from "framer-motion";

export default function StatsBar() {
  const stats = [
    { value: "5", label: "Fakultas Pilihan" },
    { value: "15+", label: "Program Studi" },
    { value: "8", label: "Program Beasiswa" },
    { value: "100+", label: "Dosen Profesional" },
    { value: "Baik Sekali", label: "Akreditasi Institusi" },
  ];

  return (
    <section className="py-12 bg-paper border-y border-line">
      <div className="max-w-[1060px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-canvas border border-line rounded-xl p-5 text-center transition-all duration-200 hover:border-pink-border shadow-[0_2px_8px_-3px_rgba(23,17,26,0.03)] hover:shadow-[0_8px_16px_-6px_rgba(23,17,26,0.05)]"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-pink tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-semibold text-muted mt-1 leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
