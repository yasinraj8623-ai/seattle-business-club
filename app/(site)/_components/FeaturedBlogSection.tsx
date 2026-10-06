"use client";

import Image from "next/image";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import SolidLinkButton from "@/components/ui/SolidLinkButton";
import Link from "next/link";

const featuredblogs = [
  {
    image: "image-1",
    publishedDate: "October 15, 2023",
    title: "7 Event Ticket-Pricing Strategies to Maximize Attendance",
  },
  {
    image: "image-2",
    publishedDate: "October 10, 2023",
    title: "Layers, Not Labels: How to Channel the Power of Event Mashups",
  },
  {
    image: "image-3",
    publishedDate: "October 5, 2023",
    title: "How to Plan an Event: Your Ultimate Event Planning Guide",
  },
  {
    image: "image-4",
    publishedDate: "September 28, 2023",
    title: "Exciting Team Workshop Ideas for Memorable Events",
  },
];

export default function FeaturedBlogSection() {
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
          <Reveal className="px-4 sm:px-6 space-y-3">
            <h2 className="text-sm font-bold text-[#4A5DF9] tracking-wide">BLOG</h2>
            <div className="flex items-center justify-between gap-5 md:gap-10">
              <h3 className="text-white text-[28px] sm:text-[32px] md:text-[40px] font-medium leading-[120%]">
                Featured Blog
              </h3>
              <SolidLinkButton href="/blogs">Explore more</SolidLinkButton>
            </div>
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-5 items-stretch px-4 sm:px-0">
            {featuredblogs.map((blog, i) => (
              <StaggerItem key={i} className="group h-full flex flex-col rounded-xs overflow-hidden isolate">
                <Link href={`/blogs/${blog.image}`} className="h-full flex flex-col">
                  <div className="relative aspect-3/2 shrink-0">
                    <Image
                      src={`/images/${blog.image}.jpg`}
                      alt={blog.title}
                      fill
                      sizes="(min-width: 1600px) 365px, (min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col p-5 space-y-6 border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] backdrop-blur-[10px] transition-colors duration-300 group-hover:bg-white">
                    <p className="text-[#4A5DF9] text-xs leading-[120%]">{blog.publishedDate}</p>

                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <h3 className="text-white text-xl md:text-2xl font-outfit font-medium leading-[120%] tracking-[-0.5px] transition-colors duration-300 group-hover:text-black">
                        {blog.title}
                      </h3>

                      <p className="text-white/60 leading-[120%] text-right group-hover:text-[#4A5DF9] transition-colors duration-300">
                        Read more...
                      </p>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
