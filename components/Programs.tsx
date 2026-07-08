"use client";

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
  const faculties = [
    {
      id: "fai",
      name: "Agama Islam",
      short: "FAI",
      icon: IconBook,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      programs: [
        "S1 Pendidikan Agama Islam (PAI)",
        "S1 Hukum Keluarga (Ahwal Al-Syakhsiyah)",
        "S1 Pendidikan Guru Madrasah Ibtidaiyah (PGMI)",
      ],
    },
    {
      id: "fik",
      name: "Ilmu Kesehatan",
      short: "FIK",
      icon: IconActivity,
      color: "bg-sky-50 text-sky-600 border-sky-100",
      programs: [
        "S1 Ilmu Keperawatan",
        "S1 Kebidanan",
        "D3 Keperawatan",
        "D3 Kebidanan",
        "Profesi Ners",
        "Profesi Bidan",
      ],
    },
    {
      id: "fbbp",
      name: "Bisnis & Pendidikan",
      short: "FBBP",
      icon: IconBriefcase,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
      programs: [
        "S1 Administrasi Bisnis",
        "S1 Sastra Inggris",
        "S1 Pendidikan Bahasa Inggris",
        "S1 Pendidikan Matematika",
        "D3 Bahasa Jepang",
      ],
    },
    {
      id: "fst",
      name: "Sains & Teknologi",
      short: "FST",
      icon: IconCpu,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      programs: ["S1 Sistem Informasi", "S1 Matematika"],
    },
    {
      id: "s2",
      name: "Pascasarjana",
      short: "S2",
      icon: IconSchool,
      color: "bg-purple-50 text-purple-600 border-purple-100",
      programs: ["Magister Manajemen Pendidikan Islam (S2)"],
    },
  ];

  const [activeTab, setActiveTab] = useState("fai");
  const activeFaculty = faculties.find((f) => f.id === activeTab) || faculties[0];

  return (
    <section id="programs" className="py-20 bg-canvas">
      <div className="max-w-[1060px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-pink font-semibold text-xs tracking-wider uppercase">
            Pilihan Program Studi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mt-3">
            Temukan Bidang Minat Terbaikmu
          </h2>
          <p className="text-[16px] text-muted mt-4">
            UNIPDU Jombang menawarkan beragam program studi terakreditasi untuk jenjang Diploma, Sarjana, Profesi, hingga Pascasarjana.
          </p>
        </div>

        {/* Desktop Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {faculties.map((fac) => {
            const Icon = fac.icon;
            const isActive = activeTab === fac.id;
            return (
              <button
                key={fac.id}
                onClick={() => setActiveTab(fac.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-[14px] font-semibold transition-all duration-200 focus:outline-none ${
                  isActive
                    ? "bg-pink border-pink text-white shadow-sm"
                    : "bg-canvas border-line text-body hover:bg-paper hover:border-pink-border hover:text-pink"
                }`}
              >
                <Icon size={18} />
                <span>{fac.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-white/20 text-white" : "bg-paper text-muted border border-line"
                  }`}
                >
                  {fac.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="bg-paper border border-line rounded-2xl p-6 md:p-8 min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-line">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-xl border ${activeFaculty.color}`}>
                    <activeFaculty.icon size={26} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink">
                      Fakultas {activeFaculty.name}
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      Universitas Pesantren Tinggi Darul 'Ulum Jombang
                    </p>
                  </div>
                </div>
                <div className="inline-flex px-3 py-1.5 rounded-lg border border-line bg-canvas text-xs font-semibold text-body">
                  {activeFaculty.programs.length} Program Studi Pilihan
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeFaculty.programs.map((prog, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-canvas border border-line hover:border-pink-border hover:shadow-[0_4px_12px_-4px_rgba(23,17,26,0.04)] transition-all duration-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-pink-soft border border-pink-border flex items-center justify-center text-pink mt-0.5 flex-shrink-0">
                      <IconCheck size={12} strokeWidth={3} />
                    </div>
                    <span className="text-[15px] font-semibold text-body leading-snug">
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
