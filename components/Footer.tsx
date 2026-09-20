"use client";

import Image from "next/image";
import { IconBrandWhatsapp, IconMail, IconMapPin, IconClock } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-emerald-950 text-white border-t border-emerald-900/80 pt-16 pb-10">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <Image
                src="/logo-unipdu.png"
                alt="Logo UNIPDU Jombang"
                width={46}
                height={38}
                className="object-contain"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-semibold text-white tracking-tight">
                  PMB UNIPDU
                </span>
                <span className="text-[11px] font-medium text-emerald-100/70">
                  Universitas Pesantren Tinggi Darul 'Ulum
                </span>
              </div>
            </a>
            <p className="text-[13.5px] text-emerald-100/70 leading-relaxed max-w-sm">
              Mendidik generasi sarjana dan profesional yang memadukan keunggulan ilmu pengetahuan modern dengan kedalaman spiritualitas dan akhlakul karimah pesantren.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-[15px] font-medium text-amber-200 tracking-wide">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-[13.5px] text-emerald-100/75 hover:text-amber-200 transition-colors">
                  Beranda Utama
                </a>
              </li>
              <li>
                <a href="#programs" className="text-[13.5px] text-emerald-100/75 hover:text-amber-200 transition-colors">
                  Program Studi & Fakultas
                </a>
              </li>
              <li>
                <a href="#akreditasi" className="text-[13.5px] text-emerald-100/75 hover:text-amber-200 transition-colors">
                  Akreditasi BAN-PT
                </a>
              </li>
              <li>
                <a href="#jalur" className="text-[13.5px] text-emerald-100/75 hover:text-amber-200 transition-colors">
                  Jalur Seleksi Masuk
                </a>
              </li>
              <li>
                <a href="#pmb" className="text-[13.5px] text-emerald-100/75 hover:text-amber-200 transition-colors">
                  Alur & Cara Mendaftar
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-[15px] font-medium text-amber-200 tracking-wide">
              Sekretariat PMB
            </h4>
            <ul className="space-y-3.5 text-[13.5px] text-emerald-100/80">
              <li className="flex items-start gap-3">
                <span className="text-gold mt-0.5 flex-shrink-0">
                  <IconMapPin size={18} />
                </span>
                <span className="leading-snug">
                  Kompleks Pondok Pesantren Darul 'Ulum Peterongan, Jombang, Jawa Timur 61481
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold flex-shrink-0">
                  <IconBrandWhatsapp size={18} />
                </span>
                <a
                  href="https://wa.me/62895804182000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-200 transition-colors font-medium"
                >
                  0895 8041 82000 (WhatsApp PMB)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-gold flex-shrink-0">
                  <IconMail size={18} />
                </span>
                <a href="mailto:pmb@unipdu.ac.id" className="hover:text-amber-200 transition-colors font-medium">
                  pmb@unipdu.ac.id
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold mt-0.5 flex-shrink-0">
                  <IconClock size={18} />
                </span>
                <span className="leading-snug text-xs text-emerald-100/70">
                  Pelayanan: Sabtu–Kamis: 08.00–14.00 WIB
                  <br />
                  <span className="text-amber-200 font-medium">Hari Jumat Libur</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-emerald-100/60 font-medium">
            &copy; {new Date().getFullYear()} Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU). Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-amber-200/90 font-medium">Terakreditasi Baik Sekali • BAN-PT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
