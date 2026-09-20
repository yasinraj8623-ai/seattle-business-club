// components/motion/scroll-reveal-text.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Edge = "start" | "end" | "center" | number | `${number}%`;
type ScrollIntersection = `${Edge} ${Edge}`;

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  dimOpacity?: number;
  start?: ScrollIntersection;
  end?: ScrollIntersection;
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  dimOpacity: number;
}

function Word({ word, progress, range, dimOpacity }: WordProps) {
  const opacity = useTransform(progress, range, [dimOpacity, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {word}
    </motion.span>
  );
}

export function ScrollRevealText({
  text,
  className,
  dimOpacity = 0.15,
  start = "start 0.85",
  end = "start 0.35",
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [start, end],
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => {
        const range: [number, number] = [i / words.length, (i + 1) / words.length];
        return (
          <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={range} dimOpacity={dimOpacity} />
        );
      })}
    </p>
  );
}
