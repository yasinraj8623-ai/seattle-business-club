"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import SolidLinkButton from "@/components/ui/SolidLinkButton";
import BorderLinkButton from "@/components/ui/BorderLinkButton";
import { handleAnchorClick } from "@/lib/Smoothscroll";

gsap.registerPlugin(ScrollSmoother);

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-160 sm:h-180 md:h-200 lg:h-225 w-full overflow-hidden">
      <div data-speed="0.85" className="absolute inset-0 scale-115">
        <Image
          src="/images/hero-background.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-bottom-right -scale-x-100"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(0deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.50) 100%),
            radial-gradient(67.86% 48.45% at 62.78% 69.81%, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0) 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-[1600px] h-full mx-auto px-5 sm:px-6 md:px-10">
        <div className="hidden md:block absolute inset-y-0 inset-x-5 sm:inset-x-6 md:inset-x-10 max-w-108.5 bg-[rgb(91_156_255/5%)] backdrop-blur-[7.5px]" />

        <div className="relative h-full flex flex-col md:flex-row gap-10 md:gap-20 justify-center">
          <div data-speed="1.35" className="md:pl-8 lg:pl-19.25 flex flex-col justify-center">
            <motion.div variants={container} initial="hidden" animate="visible">
              <h1 className="font-outfit">
                <motion.span
                  variants={item}
                  className="block uppercase font-bold text-[16vw] sm:text-[110px] md:text-[150px] lg:text-[200px] xl:text-[250.541px] leading-none tracking-[-2px] sm:tracking-[-4px] lg:tracking-[-7.516px] bg-[linear-gradient(99deg,#FFF_40.61%,#4A5DF9_101.24%)] bg-clip-text text-transparent [text-box-trim:trim-both] [text-box-edge:cap]"
                >
                  Seattle
                </motion.span>
                <motion.span
                  variants={item}
                  className="inline-block text-white text-right uppercase font-normal text-[8vw] sm:text-[56px] md:text-[76px] lg:text-[100px] xl:text-[126.082px] leading-[70%] tracking-[-1px] sm:tracking-[-2px] lg:tracking-[-3.782px]"
                >
                  Business Club
                </motion.span>
              </h1>

              <motion.p
                variants={item}
                className="text-white font-normal text-base sm:text-lg md:text-[20px] leading-[130%] capitalize max-w-full md:max-w-md lg:max-w-213 my-6 md:my-8"
              >
                Seattle Business Club is a media and community platform that helps Seattle businesses get discovered,
                connected, and grow.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap items-center gap-4">
                <SolidLinkButton href="#services" onClick={(e) => handleAnchorClick(e, "#services")}>
                  See What We Do
                </SolidLinkButton>
                <BorderLinkButton href="/join">Join the Club</BorderLinkButton>
              </motion.div>
            </motion.div>
          </div>

          <div data-speed="0.55" className="hidden lg:block self-center -translate-y-60">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: [0, -14, 0] }}
              transition={{
                opacity: { duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.3 },
              }}
            >
              <Image
                width={128}
                height={227}
                src="/images/hero-image.jpg"
                alt="Hero Image"
                className="object-contain md:w-32 h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
