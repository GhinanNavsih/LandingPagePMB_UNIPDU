import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RunningText from "@/components/RunningText";
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
      <RunningText />
      <StatsBar />
      <Programs />
      <Akreditasi />
      <PMB />
      <Jalur />
      <Footer />
    </main>
  );
}
