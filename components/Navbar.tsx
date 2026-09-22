"use client";

import { useContent } from "./ContentProvider";

import { useState, useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";

export default function Navbar() {
  const content = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Program Studi", href: "#programs" },
    { name: "Akreditasi", href: "#akreditasi" },
    { name: "Jalur Seleksi", href: "#jalur" },
    { name: "Cara Daftar", href: "#pmb" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-[0_4px_20px_-4px_rgba(21,23,28,0.05)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1080px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <Image
            src="/logo-unipdu.png"
            alt="Logo UNIPDU Jombang"
            width={48}
            height={40}
            className="transition-transform group-hover:scale-105 object-contain"
          />
          <div className="flex flex-col">
            <span className={`font-serif text-[17px] font-semibold leading-tight transition-colors duration-300 ${isScrolled ? "text-structure-blue-900" : "text-white"}`}>
              {content.site.name}
            </span>
            <span className={`text-[11px] tracking-wide font-medium transition-colors duration-300 ${isScrolled ? "text-neutral-500" : "text-white/75"}`}>
              {content.site.university}
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[14px] font-medium transition-colors duration-200 ${
                  isScrolled
                    ? "text-neutral-700 hover:text-structure-blue-600"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <a
            href={content.site.registrationUrl}
            className="px-5 py-2.5 rounded-xl font-semibold text-[13.5px] bg-focal hover:bg-focal-hover text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            {content.site.registrationLabel}
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 transition-colors focus:outline-none ${isScrolled ? "text-structure-blue-900 hover:text-structure-blue-700" : "text-white hover:text-white/70"}`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-xl py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[15px] font-medium text-neutral-700 hover:text-structure-blue-600 transition-colors py-1.5"
            >
              {link.name}
            </a>
          ))}
          <a
            href={content.site.registrationUrl}
            onClick={() => setIsOpen(false)}
            className="w-full text-center mt-2 px-5 py-3 rounded-xl bg-focal hover:bg-focal-hover text-white font-semibold text-[14px] transition-colors shadow-sm"
          >
            {content.site.registrationLabel}
          </a>
        </div>
      )}
    </nav>
  );
}
