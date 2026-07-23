import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/homepage/HeroSection";
import { TrustedBy } from "@/components/homepage/TrustedBy";
import { FeatureCards } from "@/components/homepage/FeatureCards";
import { DestinationsSection } from "@/components/homepage/DestinationsSection";
import { BrochureSection } from "@/components/homepage/BrochureSection";
import { ProgramsSection } from "@/components/homepage/ProgramsSection";
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection";
import { StatsSection } from "@/components/homepage/StatsSection";
import { FactsSection } from "@/components/homepage/FactsSection";
import { StudentLifeSection } from "@/components/homepage/StudentLifeSection";
import { GalleryStrip } from "@/components/homepage/GalleryStrip";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import { CTASection } from "@/components/homepage/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustedBy />
        <FeatureCards />
        <DestinationsSection />
        <BrochureSection />
        <ProgramsSection />
        <GalleryStrip />
        <HowItWorksSection />
        <StatsSection />
        <FactsSection />
        <StudentLifeSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
