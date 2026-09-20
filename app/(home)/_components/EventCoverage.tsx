"use client";

import { Reveal } from "@/components/motion/reveal";
import ScrollStack from "@/components/scroll/ScrollStack";
import MagneticLinkButton from "@/components/ui/MagneticLinkButton";

const coverage = [
  { video: "/videos/brand-storytelling-night.mp4", location: "Capitol Hill Studio", title: "Brand Storytelling Night" },
  {
    video: "/videos/creators-local-brands-mixer.mp4",
    location: "Ballard Commons",
    title: "Creators × Local Brands Mixer",
  },
];

export default function EventCoverage() {
  return (
    <section className="relative py-14 md:py-25 space-y-10 md:space-y-12 overflow-x-clip">
      <div className="absolute -z-10 inset-0 h-full w-full">
        <div className="h-full w-full max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
          <div className="h-full w-full border-x border-gray-200" />
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
        <Reveal className="px-4 sm:px-6 space-y-3">
          <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">EVENT COVERAGE</h2>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <h2 className="text-[#1E1E1E] text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[120%]">
              We bring a camera and guest list
            </h2>
            <div>
              <MagneticLinkButton className="text-nowrap" href="/events" variant="secondary">
                Explore Events
              </MagneticLinkButton>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="bg-[#1E1E1E]">
        <ScrollStack startMode="bottom" className="relative max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
          {coverage.map((item, i) => (
            <div
              key={i}
              className="relative min-h-[88vh] flex flex-col justify-center py-12 px-4 sm:px-10 md:px-12 lg:px-16 xl:px-30 space-y-6 md:space-y-8.5 bg-[#1E1E1E]"
            >
              <div className="relative overflow-hidden aspect-video">
                <video
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls={false}
                  disablePictureInPicture
                  disableRemotePlayback
                  tabIndex={-1}
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[#4A5DF9] leading-[120%]">{item.location}</p>
                <p className="text-2xl md:text-3xl text-white tracking-[-0.6px] font-outfit">{item.title}</p>
              </div>
            </div>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
