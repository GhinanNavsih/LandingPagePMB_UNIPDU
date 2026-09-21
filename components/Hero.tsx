"use client";

import { useContent } from "./ContentProvider";

import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";

export default function Hero() {
  const content = useContent();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={content.hero.videoUrl} type="video/mp4" />
      </video>

      {/* Cinematic Islamic Emerald Overlay for readability and prestige */}
      <div className="absolute inset-0 bg-emerald-950/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-emerald-950/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,147,40,0.15),transparent_60%)] pointer-events-none" />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10 w-full text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 backdrop-blur-md border border-gold/30 text-amber-200 text-xs font-medium tracking-wide mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>{content.hero.badge}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-[62px] font-normal text-white leading-[1.18] max-w-4xl mx-auto drop-shadow-md"
        >
          {content.hero.title}{" "}
          <span className="italic font-normal text-amber-300">{content.hero.highlight}</span> {content.hero.suffix}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[16px] md:text-[18px] text-emerald-50/85 leading-relaxed max-w-2xl mx-auto mt-6"
        >
          {content.hero.description}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href={content.site.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-emerald-950 font-semibold text-[15px] transition-all duration-200 shadow-lg shadow-gold/20 hover:shadow-xl flex items-center justify-center gap-2.5 group active:scale-[0.98]"
          >
            {content.site.registrationLabel}
            <IconArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#programs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-[15px] backdrop-blur-md transition-all duration-200 flex items-center justify-center active:scale-[0.98]"
          >
            {content.hero.secondaryLabel}
          </a>
        </motion.div>

        {/* Accreditation & Stats Badge preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 inline-flex items-center gap-6 px-6 py-3 rounded-xl border border-white/15 bg-emerald-950/40 backdrop-blur-md shadow-sm"
        >
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-emerald-100/70 tracking-wide">Akreditasi Institusi</span>
            <span className="font-serif text-[15px] font-semibold text-amber-200">{content.accreditation.rating}</span>
          </div>
          <div className="w-px h-7 bg-white/15" />
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-emerald-100/70 tracking-wide">SK BAN-PT</span>
            <span className="text-xs font-semibold text-white/90">{content.accreditation.decree}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
