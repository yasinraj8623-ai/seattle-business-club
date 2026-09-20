"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

/** Shared easing — a soft "decelerate" curve that matches the rest of the UI's calm feel. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -72 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 72 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.04 },
  },
};

type RevealProps = HTMLMotionProps<"div"> & {
  /** Extra delay before the animation starts, in seconds. */
  delay?: number;
};

/** Fades + slides a block into place once it scrolls into view. Plays once. */
export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Parent for a grid/list — staggers each StaggerItem child in as it enters view. */
export function StaggerGroup({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** A single item inside a StaggerGroup. Must be a direct child. */
export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay }} {...props}>
      {children}
    </motion.div>
  );
}
