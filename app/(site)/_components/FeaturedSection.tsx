"use client";

import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

const featured = [
  {
    image: "image-1",
    tags: ["Cafe", "Roaster"],
    title: "Fremont Roasting Co.",
    description: "A second-generation roaster turning a corner shop into the neighborhood's living room.",
  },
  {
    image: "image-2",
    tags: ["Restaurant"],
    title: "Pike & Vine",
    description: "Market-driven plates from two chefs who met working the same lunch rush.",
  },
  {
    image: "image-3",
    tags: ["Maker", "Retail"],
    title: "Salt Marsh Ceramics",
    description: "Wheel-thrown tableware sold to the restaurants that inspired it.",
  },
  {
    image: "image-4",
    tags: ["Cafe", "Roaster"],
    title: "Fremont Roasting Co.",
    description: "A second-generation roaster turning a corner shop into the neighborhood's living room.",
  },
];

export default function FeaturedSection() {
  return (
    <section id="features" className="relative overflow-hidden">
      <Image
        src="/images/bg-featured-section.jpg"
        alt=""
        fill
        priority
        data-speed="0.8"
        className="object-cover -z-20 bg-no-repeat scale-115"
      />
      <div className="absolute inset-0 bg-black/80 -z-10" />

      <div className="relative max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="border-x border-[rgba(255,255,255,0.10)] py-14 md:py-25 space-y-10 md:space-y-16">
          <Reveal className="space-y-5 px-4 sm:px-0">
            <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">FEATURED BUSINESSES CLUB</h2>
            <h3 className="text-white text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[120%]">
              The names worth
              <br />
              knowing this month
            </h3>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-5 items-stretch px-4 sm:px-0">
            {featured.map((biz, i) => (
              <StaggerItem key={i} className="h-full flex flex-col rounded-xs overflow-hidden isolate">
                <div className="relative aspect-3/2 shrink-0">
                  <Image
                    src={`/images/${biz.image}.jpg`}
                    alt={biz.title}
                    fill
                    sizes="(min-width: 1600px) 365px, (min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col p-5 space-y-6 border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] backdrop-blur-[10px]">
                  <p className="text-[#4A5DF9] text-xs leading-[120%]">{biz.tags.join(" · ")}</p>
                  <div className="space-y-1.5">
                    <h3 className="text-white text-xl md:text-2xl font-outfit font-medium leading-[120%] tracking-[-0.5px]">
                      {biz.title}
                    </h3>
                    <p className="text-white/60 leading-[120%]">{biz.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
