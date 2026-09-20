"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ChildProps = {
  className?: string;
  style?: CSSProperties;
};

type ScrollStackProps = {
  children: ReactNode;
  /** How much a covered card shrinks by the time it's fully covered (0–1). */
  scaleAmount?: number;
  /** How much a covered card dims by the time it's fully covered (0–1). */
  dimAmount?: number;
  /** Distance from the top/bottom of the viewport each card pins at, in px. */
  targetOffset?: number;
  /** Star */
  startMode?: "top" | "bottom";
  className?: string;
};

export default function ScrollStack({
  children,
  scaleAmount = 0.08,
  dimAmount = 0.4,
  targetOffset = 0,
  startMode = "top",
  className,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // useGSAP(
  //   () => {
  //     if (!containerRef.current) return;
  //     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  //     const cards = gsap.utils.toArray<HTMLElement>(".scroll-stack-card", containerRef.current);

  //     cards.forEach((card, i) => {
  //       // The last card has nothing sliding over it, so it just settles normally.
  //       if (i === cards.length - 1) return;

  //       ScrollTrigger.create({
  //         trigger: card,
  //         start: `${startMode} ${startMode}+=${targetOffset}`,
  //         end: () => `+=${card.offsetHeight}`,
  //         pin: true,
  //         pinSpacing: false,
  //         scrub: true,
  //         invalidateOnRefresh: true,
  //         onUpdate: (self) => {
  //           gsap.set(card, {
  //             scale: 1 - self.progress * scaleAmount,
  //             filter: `brightness(${1 - self.progress * dimAmount})`,
  //             transformOrigin: "center top",
  //           });
  //         },
  //       });
  //     });
  //   },
  //   { scope: containerRef },
  // );

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(".scroll-stack-card", containerRef.current);

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        ScrollTrigger.create({
          trigger: card,
          start: `${startMode} ${startMode}+=${targetOffset}`,
          end: () => `+=${card.offsetHeight}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(card, {
              scale: 1 - self.progress * scaleAmount,
              filter: `brightness(${1 - self.progress * dimAmount})`,
              transformOrigin: "center top",
            });
          },
        });
      });

      // force correct measurements after fonts/images/video metadata load
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<ChildProps>;
        return cloneElement(el, {
          className: [el.props.className ?? "", "scroll-stack-card"].filter(Boolean).join(" "),
          style: { ...el.props.style, zIndex: i + 1 },
        });
      })}
    </div>
  );
}
