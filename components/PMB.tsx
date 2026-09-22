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
    <section id="pmb" className="py-24 bg-gradient-to-b from-[#343F6E] via-[#4D5C9D] to-[#272F50] text-white relative overflow-hidden border-b border-structure-blue-800/40">
      {/* Background Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.05] pointer-events-none" />

      {/* Ambient Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[360px] bg-[#6677BC]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1080px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-structure-rose-200 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
            <span className="text-structure-rose-300 text-xs">✦</span>
            <span>{content.admissions.eyebrow}</span>
            <span className="text-structure-rose-300 text-xs">✦</span>
          </span>
          <h2 className="font-serif text-3xl md:text-[42px] font-normal text-white mt-3 leading-tight">
            {content.admissions.title} <span className="italic font-normal text-structure-rose-200">{content.admissions.highlight}</span> {content.admissions.suffix}
          </h2>
          <p className="text-[15.5px] text-white/85 mt-4 leading-relaxed">{content.admissions.description}</p>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-7 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[42px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent z-0" />

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
                {/* Icon Container with Step Number Badge */}
                <div className="relative mb-5">
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -left-2 bg-structure-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-structure-rose-300/40 z-20">
                    {index + 1}
                  </div>

                  <div className="w-[84px] h-[84px] rounded-2xl bg-white/[0.12] border border-white/20 flex items-center justify-center text-white group-hover:bg-white/[0.20] group-hover:border-white/40 group-hover:text-structure-rose-200 transition-all duration-200 shadow-sm">
                    <Icon size={32} strokeWidth={1.75} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-[17px] font-medium text-white mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-[13px] text-white/80 leading-relaxed">
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
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-focal hover:bg-focal-hover text-white font-semibold text-[14.5px] transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl active:scale-[0.98]"
          >
            {content.admissions.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
