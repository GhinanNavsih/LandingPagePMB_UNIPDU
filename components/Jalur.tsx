"use client";

import { useContent } from "./ContentProvider";
import Link from "next/link";

import { motion } from "framer-motion";
import { IconFileSearch, IconUsers, IconBriefcase, IconCircleCheck } from "@tabler/icons-react";

function getPathwayParam(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("pmdk")) return "pmdk";
  if (lower.includes("rpl")) return "rpl";
  if (lower.includes("reguler")) return "reguler";
  return "reguler";
}

export default function Jalur() {
  const content = useContent();
  const icons = [IconFileSearch, IconUsers, IconBriefcase];
  const pathways = content.pathways.items.map((item, index) => ({ ...item, icon: icons[index % icons.length] }));

  return (
    <section id="jalur" className="py-24 bg-canvas">
      <div className="max-w-[1080px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-structure-blue-600 font-semibold text-xs tracking-widest uppercase inline-flex items-center gap-2">
            <span className="text-structure-rose-500 text-xs">✦</span>
            <span>{content.pathways.eyebrow}</span>
            <span className="text-structure-rose-500 text-xs">✦</span>
          </span>
          <h2 className="font-serif text-3xl md:text-[42px] font-normal text-structure-blue-900 mt-3 leading-tight">
            {content.pathways.title} <span className="italic font-normal text-structure-rose-600">{content.pathways.highlight}</span> {content.pathways.suffix}
          </h2>
          <p className="text-[15.5px] text-neutral-500 mt-4 leading-relaxed">{content.pathways.description}</p>
        </div>

        {/* Grid Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pathways.map((path, idx) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white border rounded-2xl p-7 md:p-8 transition-all duration-200 flex flex-col justify-between ${
                  path.featured
                    ? "border-structure-rose-400/60 shadow-[0_12px_32px_-8px_rgba(220,94,132,0.12)] relative"
                    : "border-neutral-200 hover:border-structure-blue-300 shadow-[0_4px_16px_rgba(21,23,28,0.02)]"
                }`}
              >
                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`p-3.5 rounded-xl border ${
                        path.featured
                          ? "bg-structure-rose-50 text-structure-rose-700 border-structure-rose-200"
                          : "bg-canvas text-structure-blue-600 border-neutral-200"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide uppercase ${
                        path.featured
                          ? "bg-structure-blue-900 text-structure-rose-200"
                          : "bg-canvas text-neutral-500 border border-neutral-200"
                      }`}
                    >
                      {path.badge}
                    </span>
                  </div>

                  {/* Titles */}
                  <h3 className="font-serif text-2xl font-medium text-structure-blue-900 leading-tight">{path.title}</h3>
                  <h4 className="text-[11.5px] font-medium text-neutral-500 tracking-wide uppercase mt-1">
                    {path.subtitle}
                  </h4>

                  {/* Description */}
                  <p className="text-[14px] text-neutral-700 leading-relaxed mt-4">{path.desc}</p>

                  <div className="my-6 border-t border-neutral-200" />

                  {/* Details List */}
                  <ul className="space-y-3">
                    {path.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <span className="text-structure-blue-600 mt-0.5 flex-shrink-0">
                          <IconCircleCheck size={17} />
                        </span>
                        <span className="text-[13.5px] text-neutral-700 leading-normal font-medium">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button */}
                <div className="mt-8">
                  <Link
                    href={`/pendaftaran?jalur=${getPathwayParam(path.title)}`}
                    className="w-full text-center block px-4 py-3 rounded-xl font-semibold text-[14px] text-white bg-structure-rose-500 hover:bg-structure-rose-600 shadow-md shadow-structure-rose-500/20 transition-all duration-200 active:scale-[0.98]"
                  >
                    Daftar Melalui {path.title}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
