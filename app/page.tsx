import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RunningText from "@/components/RunningText";
import StatsBar from "@/components/StatsBar";
import Programs from "@/components/Programs";
import Akreditasi from "@/components/Akreditasi";
import PMB from "@/components/PMB";
import Jalur from "@/components/Jalur";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { ContentProvider } from "@/components/ContentProvider";
import { getContent } from "@/lib/content-store";
import { publicContent } from "@/lib/content-schema";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const { content } = await getContent();
  return { title: content.site.metaTitle, description: content.site.metaDescription };
}
export default async function Page() {
  const { content } = await getContent();
  return (
    <ContentProvider content={publicContent(content)}>
      <main className="relative min-h-screen">
        <Navbar />
        <Hero />
        <RunningText />
        <StatsBar />
        <Programs />
        <Akreditasi />
        <PMB />
        <Jalur />
        <Footer />
        <Chatbot />
      </main>
    </ContentProvider>
  );
}
