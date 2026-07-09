"use client";

import { useState, useEffect } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";

export default function Navbar() {
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
          ? "bg-canvas/90 backdrop-blur-md border-b border-line py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1060px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <Image
            src="/logo-unipdu.png"
            alt="Logo UNIPDU Jombang"
            width={55}
            height={45}
            className="transition-transform group-hover:scale-105 object-fill"
          />
          <div className="flex flex-col">
            <span className={`font-extrabold tracking-tight text-lg leading-none transition-colors duration-300 ${isScrolled ? "text-ink" : "text-white"}`}>
              PMB UNIPDU
            </span>
            <span className={`text-[10px] font-medium mt-0.5 transition-colors duration-300 ${isScrolled ? "text-muted" : "text-white/70"}`}>
              Jombang • East Java
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[15px] font-medium transition-colors duration-300 ${
                  isScrolled
                    ? "text-body hover:text-pink"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <a
            href="/login"
            className="px-5 py-2.5 rounded-lg bg-pink text-white font-semibold text-[15px] hover:bg-pink-dark transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Daftar Sekarang
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 transition-colors focus:outline-none ${isScrolled ? "text-ink hover:text-pink" : "text-white hover:text-white/70"}`}
          aria-label="Toggle Menu"
        >
          {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-canvas border-b border-line shadow-lg py-6 px-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-5 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[15px] font-medium text-body hover:text-pink transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setIsOpen(false)}
            className="w-full text-center px-5 py-3 rounded-lg bg-pink text-white font-semibold text-[15px] hover:bg-pink-dark transition-colors shadow-sm"
          >
            Daftar Sekarang
          </a>
        </div>
      )}
    </nav>
  );
}

