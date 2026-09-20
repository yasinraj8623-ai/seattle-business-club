"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

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

const colorVariants = {
  rest: { color: "#1E1E1E", borderColor: "#1E1E1E" },
  hover: { color: "#4A5DF9", borderColor: "#4A5DF9" },
};

interface UnderlineLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 17L17 7M17 17V7H7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function UnderlineLinkButton({ href, children, className = "" }: UnderlineLinkButtonProps) {
  return (
    <MotionLink href={href} initial="rest" whileHover="hover">
      <motion.div
        variants={colorVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`py-2 inline-flex items-center gap-3 font-medium leading-4 uppercase whitespace-nowrap border-b ${className}`}
      >
        <span className="relative overflow-hidden h-4 flex items-center">
          <span className="block relative">
            <motion.span
              variants={textVariants}
              transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
              className="block"
            >
              {children}
            </motion.span>
            <motion.span
              variants={textVariantsUp}
              transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
              className="block absolute left-0 top-0"
            >
              {children}
            </motion.span>
          </span>
        </span>

        <span className="relative overflow-hidden size-6 shrink-0">
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
      </motion.div>
    </MotionLink>
  );
}
