import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { TrailerSection } from "@/components/site/trailer-section";
import { GameInfo } from "@/components/site/game-info";
import { Pricing } from "@/components/site/pricing";
import { Faq } from "@/components/site/faq";
import { FinalCta } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";
import { CheckoutDialog } from "@/components/site/checkout-dialog";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrailerSection />
        <GameInfo />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <CheckoutDialog />
    </div>
  );
}
