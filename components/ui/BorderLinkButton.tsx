"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const MotionLink = motion.create(Link);
const borderVariants = {
  rest: { scaleX: 0, scaleY: 0 },
  hover: { scaleX: 1, scaleY: 1 },
};

interface BorderLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function BorderLinkButton({ href, children, className = "" }: BorderLinkButtonProps) {
  return (
    <MotionLink
      href={href}
      initial="rest"
      whileHover="hover"
      className={`relative bg-white/10 backdrop-blur-[10px] px-4 py-3 text-white text-sm font-medium leading-5 inline-block transition-colors duration-300 hover:bg-white/20 ${className}`}
    >
      {/* top edge */}
      <motion.span
        variants={borderVariants}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ originX: 0 }}
        className="absolute top-0 left-0 w-full h-px bg-white"
      />
      {/* bottom edge */}
      <motion.span
        variants={borderVariants}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        style={{ originX: 1 }}
        className="absolute bottom-0 left-0 w-full h-px bg-white"
      />
      {/* left edge */}
      <motion.span
        variants={borderVariants}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        style={{ originY: 1 }}
        className="absolute top-0 left-0 h-full w-px bg-white"
      />
      {/* right edge */}
      <motion.span
        variants={borderVariants}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
        style={{ originY: 0 }}
        className="absolute top-0 right-0 h-full w-px bg-white"
      />

      {children}
    </MotionLink>
  );
}
