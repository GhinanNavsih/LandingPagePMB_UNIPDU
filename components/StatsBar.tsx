"use client";

import { useContent } from "./ContentProvider";

import { motion } from "framer-motion";

export default function StatsBar() {
  const content = useContent();
  const stats = content.stats;

  return (
    <section className="py-14 bg-paper border-b border-line">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="bg-white border border-line rounded-2xl p-6 text-center transition-all duration-200 hover:border-emerald-700/30 shadow-[0_2px_10px_-2px_rgba(18,27,22,0.03)] hover:shadow-[0_12px_28px_-8px_rgba(18,27,22,0.07)]"
            >
              <div className="font-serif text-3xl md:text-[36px] font-medium text-emerald-900 leading-none">
                {stat.value}
              </div>
              <div className="text-[12.5px] font-medium text-muted mt-2.5 leading-snug">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
