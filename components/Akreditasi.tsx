"use client";

import { useContent } from "./ContentProvider";

import { motion } from "framer-motion";
import { IconAward, IconCircleCheck } from "@tabler/icons-react";

export default function Akreditasi() {
  const content = useContent();
  return (
    <section id="akreditasi" className="py-24 bg-white border-b border-neutral-200">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-structure-blue-600 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
              <span className="text-structure-rose-500 text-xs">✦</span>
              <span>{content.accreditation.eyebrow}</span>
            </span>
            <h2 className="font-serif text-3xl md:text-[42px] font-normal text-structure-blue-900 leading-tight">
              {content.accreditation.title} <span className="italic font-normal text-structure-rose-600">"{content.accreditation.rating}"</span> {content.accreditation.suffix}
            </h2>
            <p className="text-[15.5px] text-neutral-700 leading-relaxed">{content.accreditation.description}</p>

            <div className="space-y-4 pt-2">
              {['Surat Keputusan Akreditasi Institusi BAN-PT ' + content.accreditation.decree, ...content.accreditation.points].map((point, index) => (
                <div key={index} className="flex items-start gap-3.5">
                  <IconCircleCheck size={21} className="text-structure-blue-600 shrink-0" />
                  <span className="text-[14.5px] font-medium text-neutral-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Display */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-[0_8px_30px_-6px_rgba(21,23,28,0.06)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-structure-blue-900 via-structure-rose-500 to-structure-blue-900" />
              <div className="w-16 h-16 rounded-full bg-structure-rose-50 border border-structure-rose-200 flex items-center justify-center text-structure-rose-600 mx-auto mb-5 shadow-xs">
                <IconAward size={34} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-structure-blue-950 tracking-wide">
                {content.accreditation.rating.toUpperCase()}
              </h3>
              <p className="text-[11.5px] font-medium text-neutral-500 tracking-wider uppercase mt-1">
                Peringkat Akreditasi Institusi
              </p>
              <div className="my-6 border-t border-neutral-200 border-dashed" />
              <p className="text-xs text-neutral-500 leading-relaxed">
                {content.accreditation.authority}
                <br />
                <span className="font-semibold text-structure-blue-900 text-[13px] block mt-1.5">
                  {content.accreditation.decree}
                </span>
              </p>
              <div className="mt-6 px-4 py-2 rounded-xl bg-structure-blue-50 border border-structure-blue-200 text-[11.5px] font-medium text-structure-blue-900">
                {content.accreditation.validUntil}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
