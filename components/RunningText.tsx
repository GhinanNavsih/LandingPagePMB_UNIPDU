"use client";

import { useContent } from "./ContentProvider";

export default function RunningText() {
  const content = useContent();
  const announcements = content.announcements;

  // Duplicate for seamless loop
  const items = [...announcements, ...announcements];

  return (
    <section className="relative overflow-hidden bg-[#4D5C9D] border-y border-structure-blue-400/40 py-3.5 select-none">
      {/* Edge gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#4D5C9D] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#4D5C9D] to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-8 text-[13px] font-medium text-white tracking-wide"
          >
            <span>{text}</span>
            <span className="text-structure-rose-200 text-xs">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
