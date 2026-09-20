"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MouseEvent, ReactNode } from "react";

const MotionLink = motion.create(Link);

const textVariants = {
  rest: { y: 0 },
  hover: { y: "-100%" },
};

const textVariantsUp = {
  rest: { y: "100%" },
  hover: { y: 0 },
};

const iconVariantsOut = {
  rest: { x: 0, y: 0 },
  hover: { x: "150%", y: "-150%" },
};

const iconVariantsIn = {
  rest: { x: "-150%", y: "150%" },
  hover: { x: 0, y: 0 },
};

interface SolidLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M5.25 12.75L12.75 5.25M12.75 12.75V5.25H5.25"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SolidLinkButton({ href, children, className = "", onClick }: SolidLinkButtonProps) {
  return (
    <MotionLink
      href={href}
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      className={`bg-white/10 backdrop-blur-[10px] p-0.5 inline-block ${className}`}
    >
      <div className="flex justify-center items-center gap-2 px-3.5 py-2.5 bg-[#4A5DF9] bg-[radial-gradient(47.16%_130.25%_at_68.75%_-16.25%,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0)_100%)]">
        <span className="relative overflow-hidden h-5 flex items-center">
          <span className="block relative">
            <motion.span
              variants={textVariants}
              transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
              className="text-white text-sm font-medium leading-5 block"
            >
              {children}
            </motion.span>
            <motion.span
              variants={textVariantsUp}
              transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
              className="text-white text-sm font-medium leading-5 block absolute left-0 top-0"
            >
              {children}
            </motion.span>
          </span>
        </span>

        <span className="relative overflow-hidden size-4.5 shrink-0">
          <motion.div
            variants={iconVariantsOut}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ArrowIcon />
          </motion.div>
          <motion.div
            variants={iconVariantsIn}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ArrowIcon />
          </motion.div>
        </span>
      </div>
    </MotionLink>
  );
}
