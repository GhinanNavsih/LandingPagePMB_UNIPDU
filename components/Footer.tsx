"use client";

import { IconBrandWhatsapp, IconMail, IconMapPin, IconClock } from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer id="kontak" className="bg-paper border-t border-line pt-16 pb-8">
      <div className="max-w-[1060px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-line">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-pink flex items-center justify-center text-white font-bold text-lg shadow-sm">
                U
              </span>
              <span className="font-extrabold text-ink tracking-tight text-lg leading-none">
                PMB UNIPDU
              </span>
            </a>
            <p className="text-sm text-body leading-relaxed max-w-sm">
              Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) berkomitmen untuk melahirkan sarjana profesional yang berkarakter Islami dan siap bersaing secara global.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[14px] font-bold text-ink tracking-wider uppercase">Menu Pintas</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-body hover:text-pink transition-colors font-medium">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#programs" className="text-sm text-body hover:text-pink transition-colors font-medium">
                  Program Studi
                </a>
              </li>
              <li>
                <a href="#akreditasi" className="text-sm text-body hover:text-pink transition-colors font-medium">
                  Akreditasi Institusi
                </a>
              </li>
              <li>
                <a href="#jalur" className="text-sm text-body hover:text-pink transition-colors font-medium">
                  Jalur Seleksi
                </a>
              </li>
              <li>
                <a href="#pmb" className="text-sm text-body hover:text-pink transition-colors font-medium">
                  Alur Pendaftaran
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[14px] font-bold text-ink tracking-wider uppercase">Hubungi Kami</h4>
            <ul className="space-y-3.5 text-sm text-body">
              <li className="flex items-start gap-3">
                <span className="text-pink mt-0.5 flex-shrink-0">
                  <IconMapPin size={18} />
                </span>
                <span className="leading-snug">
                  Komplek Ponpes Darul 'Ulum Peterongan, Jombang, Jawa Timur
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink flex-shrink-0">
                  <IconBrandWhatsapp size={18} />
                </span>
                <a
                  href="https://wa.me/62895804182000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink transition-colors font-semibold"
                >
                  0895 8041 82000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink flex-shrink-0">
                  <IconMail size={18} />
                </span>
                <a href="mailto:pmb@unipdu.ac.id" className="hover:text-pink transition-colors font-semibold">
                  pmb@unipdu.ac.id
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink mt-0.5 flex-shrink-0">
                  <IconClock size={18} />
                </span>
                <span className="leading-snug text-xs text-muted font-medium">
                  Sabtu–Kamis: 08.00–14.00 WIB
                  <br />
                  <span className="text-pink font-semibold">Jumat Libur</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted font-medium">
            &copy; {new Date().getFullYear()} Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU). All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-muted font-semibold">Terakreditasi Baik Sekali</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
