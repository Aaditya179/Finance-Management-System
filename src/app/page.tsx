import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Advantages from "@/components/Advantages";
import TradeRealTime from "@/components/TradeRealTime";
import Footer from "@/components/Footer";
import NoiseTexture from "@/components/NoiseTexture";

export default function Home() {
  return (
    <main className="min-h-screen relative selection:bg-brand-dark/30 selection:text-white pt-10">
      <NoiseTexture />
      <Navbar />
      <Hero />
      <Features />
      <Advantages />
      <TradeRealTime />
      <Footer />
    </main>
  );
}
