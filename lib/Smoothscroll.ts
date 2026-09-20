import { MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollSmoother);

export function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string, currentPath?: string) {
  if (href === "#") {
    e.preventDefault();
    return;
  }

  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;

  const id = href.slice(hashIndex + 1);
  if (!id) return;

  if (currentPath !== undefined) {
    const targetPath = href.slice(0, hashIndex) || "/";
    if (currentPath !== targetPath) return; // not on the right page yet — let Link navigate normally
  }

  const target = document.getElementById(id);
  if (!target) return;

  e.preventDefault();

  const smoother = ScrollSmoother.get();
  if (smoother) {
    // "top top+=110" offsets for the fixed navbar so the section isn't hidden under it.
    smoother.scrollTo(target, true, "top top+=110");
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
