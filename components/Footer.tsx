"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal, slideInLeft, slideInRight } from "@/components/motion/reveal";

const exploreLinks = [
  { label: "Services", href: "#" },
  { label: "Work", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Network Events", href: "#" },
];

export default function Footer() {
  return (
    <footer>
      <div className="max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="border-x border-gray-200 pt-12 md:pt-25 pb-10">
          <Reveal className="flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-0 sm:px-6">
            <div className="space-y-5 md:space-y-7 flex-1 p-8 md:p-14 [background:radial-gradient(37.14%_142.39%_at_6.53%_-41.91%,rgba(255,255,255,0.20)_0%,rgba(30,30,30,0)_100%),#000710] flex flex-col justify-center">
              <Image
                loading="eager"
                width={135}
                height={40}
                src="/SBC-Logo.svg"
                alt="Brand Logo"
                className="w-28 md:w-33.75 h-auto"
              />
              <p className="text-white/60 leading-[150%]">
                A <span className="italic">media &amp; creative agency</span> helping Seattle&rsquo;s local businesses
                grow through storytelling.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row [background:radial-gradient(37.14%_142.39%_at_6.53%_-41.91%,rgba(255,255,255,0.20)_0%,rgba(30,30,30,0)_100%),#000710]">
              <div className="border-r-0 sm:border-r border-b sm:border-b-0 border-white/10 px-6 md:px-8 py-8 md:py-14 space-y-4">
                <p className="font-outfit text-white text-sm font-medium leading-[120%] tracking-[0.7px] uppercase">
                  EXPLORE
                </p>
                <ul className="text-white/60 text-sm leading-[140%] space-y-2.5">
                  {exploreLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-white/60 text-sm leading-[140%]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-r-0 sm:border- border-white/10 px-6 md:px-8 py-8 md:py-14 space-y-4">
                <p className="font-outfit text-white text-sm font-medium leading-[120%] tracking-[0.7px] uppercase">
                  SAY HELLO
                </p>
                <div className="text-white/60 text-sm leading-[140%] space-y-2.5">
                  <p>hello@seattlebusiness.co</p>
                  <p>Capitol Hill, Seattle WA</p>
                  <p>(206) 555-0147</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 flex flex-col border-b border-gray-200 sm:px-6 overflow-hidden">
            <h2 className="select-none font-outfit text-[19vw] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[290px] leading-none uppercase [leading-trim:both] [text-edge:cap]">
              <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={slideInLeft}
                className="block text-[#1E1E1E] font-bold tracking-tight"
              >
                SEATTLE
              </motion.span>
              <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={slideInRight}
                transition={{ delay: 0.08 }}
                className="block text-[#979BA3] text-right font-normal tracking-tight"
              >
                BUSINESS
              </motion.span>
            </h2>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 md:px-10 py-6 bg-[#1E1E1E]">
        <p className="text-white/60 text-sm leading-[120%] text-center">
          &copy; 2026 Seattle Business. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
