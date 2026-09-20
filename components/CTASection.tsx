"use client";

import { DocumentIcon, PenIcon, SparkleIcon } from "./icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import SolidLinkButton from "./ui/SolidLinkButton";
import Image from "next/image";
// import { handleAnchorClick } from "@/lib/Smoothscroll";

const services = [
  { icon: SparkleIcon, title: "Build Your Brand", description: "Branding & visual identity." },
  { icon: PenIcon, title: "Design Your Product", description: "UI/UX, MVP & SaaS design." },
  { icon: DocumentIcon, title: "Tell Your Story", description: "Videos & content." },
];

export default function CTASection() {
  return (
    <section>
      <div className="relative overflow-hidden py-14 md:py-25">
        <Image
          src="/images/cta-bg.png"
          alt=""
          fill
          data-speed="0.85"
          className="object-cover -z-30 pointer-events-none scale-115"
        />
        <div className="absolute inset-0 bg-black/50 -z-20" />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(67.86% 48.45% at 62.78% 69.81%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.00) 100%)",
          }}
        />

        <div className="relative max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-10 lg:gap-16 px-4 sm:px-6">
            <Reveal className="max-w-full lg:max-w-150 space-y-8 lg:space-y-10">
              <div>
                <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">BUSINESS GROWTH</h2>
                <h3 className="mt-6 text-white text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[120%]">
                  Through our creative partner,
                  <br />
                  <span className="bg-[linear-gradient(90deg,#93B1EB_0%,#4A5DF9_100%)] bg-clip-text text-transparent font-bold inline">
                    Remusa.
                  </span>
                </h3>
                <p className="text-white leading-[150%] mt-4">
                  Businesses and startups get professional support to build their brands, design their products, and
                  tell their stories — so growth isn&rsquo;t left to chance.
                </p>
              </div>

              <SolidLinkButton href="https://remusa.agency">Explore Services</SolidLinkButton>
            </Reveal>

            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:gap-3 gap-3 w-full lg:w-auto shrink-0">
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                  <StaggerItem
                    key={i}
                    className="min-h-45 md:min-h-55 lg:min-w-68 flex flex-col justify-between p-5 border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] backdrop-blur-[10px]"
                  >
                    <div className="flex justify-end">
                      <Icon />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-outfit text-white text-xl md:text-2xl font-medium leading-[120%] tracking-[-0.5px]">
                        {service.title}
                      </h3>
                      <p className="text-white/60 leading-[120%]">{service.description}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
