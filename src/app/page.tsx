import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import StartFindingClients from "@/components/landing/StartFindingClients";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <StartFindingClients />
      <Footer />
    </main>
  );
}