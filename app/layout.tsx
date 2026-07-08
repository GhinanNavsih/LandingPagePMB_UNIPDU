import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNIPDU — Universitas Pesantren Tinggi Darul 'Ulum",
  description:
    "Toward World Class Islamic University. Universitas berbasis pesantren, berwawasan entrepreneurship di Jombang, Jawa Timur.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
