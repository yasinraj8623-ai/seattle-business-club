import Image from "next/image";

import Form from "./_components/Form";
import TieIcon from "@/components/icons/TieIcon";
import ClubIcon from "@/components/icons/ClubIcon";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";
import { FadeIn, Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Metadata } from "next";

const included = [
  { icon: BriefcaseIcon, title: "Business Spotlight" },
  { icon: ClubIcon, title: "Club Merchandise & Perks" },
  { icon: TieIcon, title: "Business & Founder Networking" },
];

export const metadata: Metadata = {
  title: "Apply for Membership",
  description: "Helping Seattle businesses get discovered, connected, and growing.",
  alternates: { canonical: "/join" },

  openGraph: {
    title: "Join Seattle Business Club",
    description: "Apply for membership: business spotlight, founder networking, and club perks.",
    url: "/join",
  },
};

export default function JoinPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <Image
          className="absolute -z-20 inset-0 w-full h-full object-center object-cover"
          fill
          priority
          src="/images/join-form-background.png"
          alt="Background Image"
        />

        <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 md:px-16 lg:px-20 pt-32 sm:pt-40 md:pt-48 lg:pt-60 pb-16 md:pb-25">
          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
            <FadeIn className="lg:max-w-xl shrink-0">
              <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">Apply for membership</h2>
              <h3 className="text-white text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[120%] mt-6">
                Join{" "}
                <span className="bg-[linear-gradient(90deg,#93B1EB_0%,#4A5DF9_100%)] bg-clip-text text-transparent font-bold inline">
                  Seattle Business Club
                </span>
              </h3>
              <p className="text-white text-base sm:text-lg md:text-[20px] leading-[150%] mt-4">
                Businesses and startups get professional support to build their brands, design their products, and tell
                their stories — so growth isn&rsquo;t left to chance.
              </p>
            </FadeIn>

            <div className="w-full lg:max-w-3xl space-y-6">
              <Reveal className="flex flex-col items-start gap-4 pt-8 px-4 sm:px-6 pb-6 border border-[rgba(36,36,36,0.60)] bg-[rgba(0,0,0,0.64)] backdrop-blur-md">
                <h2 className="text-[#F5F4F0] text-center text-xl sm:text-[24px] font-bold tracking-[-0.2px]">
                  What&rsquo;s Included
                </h2>

                <StaggerGroup className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {included.map((item) => {
                    const Icon = item.icon;
                    return (
                      <StaggerItem
                        key={item.title}
                        className="w-full border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.04)] p-3 space-y-6"
                      >
                        <Icon />
                        <p className="text-[#F5F4F0] font-semibold leading-5">{item.title}</p>
                      </StaggerItem>
                    );
                  })}
                </StaggerGroup>
              </Reveal>

              <Form />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
