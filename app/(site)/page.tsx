import HeroSection from "@/app/(site)/_components/HeroSection";
import EventCoverage from "./_components/EventCoverage";
import ServicesSection from "./_components/ServicesSection";
import FeaturedSection from "./_components/FeaturedSection";
import NetworkEvents from "./_components/NetworkEvents";
import CTASection from "@/components/CTASection";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Seattle Business Club",
    locale: "en_US",
    title: "Seattle Business Club",
    description: "Helping Seattle businesses get discovered, connected, and growing.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Seattle Business Club",
      },
    ],
  },
};

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
