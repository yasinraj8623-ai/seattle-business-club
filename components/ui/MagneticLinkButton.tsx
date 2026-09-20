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

type ButtonVariant = "primary" | "secondary";

const variantStyles: Record<ButtonVariant, { wrapper: string; text: string }> = {
  primary: {
    wrapper: "bg-white/10",
    text: "text-white",
  },
  secondary: {
    wrapper: "bg-[rgba(74,93,249,0.10)]",
    text: "text-[#4A5DF9]",
  },
};

interface MagneticLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
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

export default function MagneticLinkButton({
  href,
  children,
  className = "",
  variant = "primary",
}: MagneticLinkButtonProps) {
  const styles = variantStyles[variant];

  return (
    <MotionLink
      href={href}
      initial="rest"
      whileHover="hover"
      className={`relative inline-flex items-center ${styles.wrapper} backdrop-blur-[10px] p-0.5 overflow-hidden ${className}`}
    >
      <span className="relative overflow-hidden px-4.5 py-2.5 h-5 flex items-center">
        <span className="block relative">
          <motion.span
            variants={textVariants}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className={`${styles.text} font-manrope text-sm font-medium leading-5 block`}
          >
            {children}
          </motion.span>
          <motion.span
            variants={textVariantsUp}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className={`${styles.text} font-manrope text-sm font-medium leading-5 block absolute left-0 top-0`}
          >
            {children}
          </motion.span>
        </span>
      </span>

      <div className="relative size-9 flex items-center justify-center overflow-hidden bg-[#4A5DF9] bg-[radial-gradient(47.16%_130.25%_at_68.75%_-16.25%,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0)_100%)]">
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
      </div>
    </MotionLink>
  );
}
