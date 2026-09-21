"use client";

import { useContent } from "./ContentProvider";

export default function RunningText() {
  const content = useContent();
  const announcements = content.announcements;

  // Duplicate for seamless loop
  const items = [...announcements, ...announcements];

  return (
    <section className="relative overflow-hidden bg-emerald-950 border-y border-emerald-900/70 py-3.5 select-none">
      {/* Edge gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-emerald-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-emerald-950 to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-8 text-[13px] font-medium text-emerald-100/90 tracking-wide"
          >
            <span>{text}</span>
            <span className="text-gold text-xs">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
