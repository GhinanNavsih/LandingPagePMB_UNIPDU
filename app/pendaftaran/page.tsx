import type { Metadata } from "next";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { getContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pendaftaran Mahasiswa Baru | UNIPDU",
  description: "Formulir pendaftaran mahasiswa baru Universitas Pesantren Tinggi Darul 'Ulum Jombang.",
  robots: { index: true, follow: true },
};

export default async function RegistrationPage() {
  const { content } = await getContent();
  return <RegistrationForm contact={{ whatsapp: content.contact.whatsapp, whatsappUrl: content.contact.whatsappUrl, email: content.contact.email }} />;
}
