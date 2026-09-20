import HeroSection from "@/app/(home)/_components/HeroSection";
import EventCoverage from "./_components/EventCoverage";
import ServicesSection from "./_components/ServicesSection";
import FeaturedSection from "./_components/FeaturedSection";
import NetworkEvents from "./_components/NetworkEvents";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <ServicesSection />

      <FeaturedSection />

      <CTASection />

      <EventCoverage />

      <NetworkEvents />
    </main>
  );
}
