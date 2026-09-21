"use client";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";

const items = [
  {
    number: "01",
    title: "Media",
    tag: "Discover",
    description: "Spotlights, founder stories, and new openings that put local businesses on the map.",
  },
  {
    number: "02",
    title: "Community",
    tag: "Connect",
    description: "A network of owners, operators, and creators who show up for each other.",
  },
  {
    number: "03",
    title: "Events",
    tag: "Experience",
    description: "Mixers, panels, and coverage that turn a room full of strangers into regulars.",
  },
  {
    number: "04",
    title: "Growth",
    tag: "Grow",
    description: "Creative support to build your brand, design your product, and tell your story.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-x border-gray-200 px-4 sm:px-6 py-14 md:py-25">
        <Reveal className="w-full lg:w-[58%] space-y-6">
          <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">WHAT WE DO</h2>
          <ScrollRevealText
            className="text-xl sm:text-2xl lg:text-3xl text-[#1E1E1E] leading-[150%] font-medium"
            text="We're an event management club dedicated to helping local organizations thrive through expert planning, promotion, and execution. From small gatherings to large-scale events, we craft seamless experiences and memorable moments that foster community engagement and lasting connections."
          />
        </Reveal>

        <StaggerGroup className="w-full lg:w-[42%] grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((item) => (
            <StaggerItem
              key={item.number}
              className="relative overflow-hidden rounded-xs border border-[rgba(74,93,249,0.12)] bg-[rgba(74,93,249,0.06)] backdrop-blur-[10px] p-5 space-y-6"
            >
              <span className="pointer-events-none absolute -top-2 right-0 text-[#4A5DF9] text-[40px] md:text-[48px] font-extrabold leading-[120%] opacity-10">
                {item.number}
              </span>
              <div className="space-y-1 text-[#1E1E1E]">
                <h3 className="text-xl md:text-2xl font-semibold">{item.title}</h3>
                <p className="text-xs">{item.tag}</p>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
