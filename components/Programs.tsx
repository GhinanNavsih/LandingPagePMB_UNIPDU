"use client";

import { useContent } from "./ContentProvider";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBook,
  IconActivity,
  IconBriefcase,
  IconCpu,
  IconSchool,
  IconCheck,
} from "@tabler/icons-react";

export default function Programs() {
  const content = useContent();
  const icons = [IconBook, IconActivity, IconBriefcase, IconCpu, IconSchool];
  const faculties = content.programs.faculties.map((faculty, index) => ({ ...faculty, id: String(index), icon: icons[index % icons.length] }));

  const [activeTab, setActiveTab] = useState("0");
  const activeFaculty = faculties.find((f) => f.id === activeTab) || faculties[0];

  return (
    <section id="programs" className="py-24 bg-paper relative overflow-hidden">
      <div className="max-w-[1080px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-emerald-800 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
            <span className="text-gold text-xs">✦</span>
            <span>{content.programs.eyebrow}</span>
            <span className="text-gold text-xs">✦</span>
          </span>
          <h2 className="font-serif text-3xl md:text-[42px] font-normal text-ink mt-3 leading-tight">
            {content.programs.title} <span className="italic font-normal text-emerald-800">{content.programs.highlight}</span> {content.programs.suffix}
          </h2>
          <p className="text-[15.5px] text-muted mt-4 leading-relaxed">{content.programs.description}</p>
        </div>

        {/* Desktop Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3.5 mb-10">
          {faculties.map((fac) => {
            const Icon = fac.icon;
            const isActive = activeTab === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => setActiveTab(fac.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-[13.5px] font-medium transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "bg-emerald-900 border-emerald-950 text-white shadow-sm"
                    : "bg-white border-line text-body hover:bg-paper hover:border-emerald-700/30 hover:text-emerald-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-amber-300" : "text-emerald-800"} />
                <span>{fac.name}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isActive ? "bg-emerald-950 text-amber-200 border border-emerald-800/60" : "bg-paper-alt text-muted border border-line"
                  }`}
                >
                  {fac.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="bg-white border border-line rounded-2xl p-7 md:p-10 shadow-[0_4px_24px_-4px_rgba(18,27,22,0.04)] min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-line">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl border border-emerald-200/60 bg-emerald-50 text-emerald-800">
                    <activeFaculty.icon size={26} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-ink">
                      Fakultas {activeFaculty.name}
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      {content.site.university}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-line bg-paper text-xs font-medium text-emerald-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span>{activeFaculty.programs.length} Program Studi Pilihan</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFaculty.programs.map((prog, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-start gap-3.5 p-4.5 rounded-xl bg-paper border border-line hover:border-emerald-700/30 hover:bg-white hover:shadow-[0_8px_20px_-6px_rgba(18,27,22,0.04)] transition-all duration-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100/70 border border-emerald-300/60 flex items-center justify-center text-emerald-800 mt-0.5 flex-shrink-0">
                      <IconCheck size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[14.5px] font-medium text-body leading-snug">
                      {prog}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
