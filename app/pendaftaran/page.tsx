import type { Metadata } from "next";
import { Suspense } from "react";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { getContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pendaftaran Mahasiswa Baru | UNIPDU",
  description: "Formulir pendaftaran mahasiswa baru Universitas Pesantren Tinggi Darul 'Ulum Jombang.",
  robots: { index: true, follow: true },
};

export default async function RegistrationPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { content } = await getContent();
  const resolvedParams = searchParams ? await searchParams : undefined;
  const rawJalur = typeof resolvedParams?.jalur === "string" ? resolvedParams.jalur : undefined;

  let initialPathway: string | undefined;
  if (rawJalur) {
    const val = rawJalur.toLowerCase();
    if (val.includes("pmdk")) initialPathway = "pmdk";
    else if (val.includes("rpl")) initialPathway = "rpl";
    else if (val.includes("reguler")) initialPathway = "reguler";
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center">Memuat formulir...</div>}>
      <RegistrationForm
        key={initialPathway || "default"}
        contact={{
          whatsapp: content.contact.whatsapp,
          whatsappUrl: content.contact.whatsappUrl,
          email: content.contact.email,
        }}
        initialPathway={initialPathway}
      />
    </Suspense>
  );
}
