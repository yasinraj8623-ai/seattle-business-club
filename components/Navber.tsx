"use client";

import { useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import MagneticLinkButton from "./ui/MagneticLinkButton";
import { handleAnchorClick } from "@/lib/Smoothscroll";

gsap.registerPlugin(ScrollSmoother);

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Features", href: "/#features" },
  { label: "Events", href: "/#network-events" },
  { label: "Gallery", href: "#" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const NavLink = ({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={(e) => onClick?.(e, href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-block py-1"
    >
      <motion.span
        className="inline-block"
        animate={{ y: hovered ? -2 : 0, color: hovered ? "#ffffff" : "rgba(255,255,255,0.8)" }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {label}
      </motion.span>
      <motion.span
        className="absolute left-0 -bottom-0.5 h-px w-full bg-white origin-center"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </Link>
  );
};

const Navber = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const mobilePanelId = useId();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-100 max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10 pt-2 md:pt-5">
      <motion.div
        className="flex items-center justify-between gap-4 md:gap-10 px-4 md:px-6 py-3 md:py-4 rounded-xs border border-white/10 bg-[#1E1E1E]/70 backdrop-blur-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Link href="/" className="shrink-0">
          <Image
            loading="eager"
            width={135}
            height={40}
            src="/SBC-Logo.svg"
            alt="Brand Logo"
            className="w-24 sm:w-28 md:w-33.75 h-auto"
          />
        </Link>

        <div className="hidden lg:flex items-center justify-between gap-20">
          <nav>
            <ul className="text-white/80 flex items-center gap-8 text-sm font-manrope font-medium leading-[120%] uppercase">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink label={link.label} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} />
                </li>
              ))}
            </ul>
          </nav>
          <MagneticLinkButton href="/join">Join the Club</MagneticLinkButton>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <div className="hidden sm:block">
            <MagneticLinkButton href="/join">Join the Club</MagneticLinkButton>
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls={mobilePanelId}
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 bg-white/10 backdrop-blur-[10px]"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} className="block h-px w-5 bg-white" />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-px w-5 bg-white" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} className="block h-px w-5 bg-white" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={mobilePanelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden lg:hidden rounded-xs border border-white/10 bg-[#1E1E1E]/70 backdrop-blur-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.25)] mt-2"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.05 }}
              className="p-4"
            >
              <ul className="flex flex-col gap-1 text-white/80 text-sm font-manrope font-medium uppercase">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="block py-3 px-2 transition-colors hover:text-white hover:bg-white/5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-3 sm:hidden" onClick={() => setOpen(false)}>
                  <MagneticLinkButton href="/join">Join the Club</MagneticLinkButton>
                </li>
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navber;
