"use client";

import { useContent } from "./ContentProvider";

import { motion } from "framer-motion";
import {
  IconUserPlus,
  IconCreditCard,
  IconFileText,
  IconClipboardCheck,
  IconConfetti,
} from "@tabler/icons-react";

export default function PMB() {
  const content = useContent();
  const icons = [IconUserPlus, IconCreditCard, IconFileText, IconClipboardCheck, IconConfetti];
  const steps = content.admissions.steps.map((step, index) => ({ ...step, icon: icons[index % icons.length] }));

  return (
    <section id="pmb" className="py-24 bg-gradient-to-b from-emerald-950 via-[#07241a] to-emerald-950 text-white relative overflow-hidden border-b border-emerald-900/60">
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#eedaa8_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.035] pointer-events-none" />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-amber-300 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
            <span className="text-gold text-xs">✦</span>
            <span>{content.admissions.eyebrow}</span>
            <span className="text-gold text-xs">✦</span>
          </span>
          <h2 className="font-serif text-3xl md:text-[42px] font-normal text-white mt-3 leading-tight">
            {content.admissions.title} <span className="italic font-normal text-amber-300">{content.admissions.highlight}</span> {content.admissions.suffix}
          </h2>
          <p className="text-[15.5px] text-emerald-100/75 mt-4 leading-relaxed">{content.admissions.description}</p>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-7 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[42px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-center text-center relative z-10 group"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-2.5 -right-1 bg-gold text-emerald-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-amber-200">
                  {index + 1}
                </div>

                {/* Icon Container */}
                <div className="w-[84px] h-[84px] rounded-2xl bg-white/[0.04] border border-white/12 flex items-center justify-center text-amber-300 mb-5 group-hover:bg-white/[0.08] group-hover:border-gold/50 transition-all duration-200 shadow-inner">
                  <Icon size={32} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <h3 className="font-serif text-[17px] font-medium text-white mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[13px] text-emerald-100/70 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Box */}
        <div className="mt-16 text-center">
          <a
            href={content.site.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-emerald-950 font-semibold text-[14.5px] transition-all duration-200 shadow-lg shadow-gold/20 active:scale-[0.98]"
          >
            {content.admissions.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
