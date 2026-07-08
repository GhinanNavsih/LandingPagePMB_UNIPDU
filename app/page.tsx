import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Programs from "@/components/Programs";
import Akreditasi from "@/components/Akreditasi";
import PMB from "@/components/PMB";
import Jalur from "@/components/Jalur";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <Programs />
      <Akreditasi />
      <PMB />
      <Jalur />
      <Footer />
    </main>
  );
}
