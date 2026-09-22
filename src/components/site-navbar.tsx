"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string };

interface SiteNavbarProps {
  items: NavItem[];
  activeHref?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function SiteNavbar({ items, activeHref = "#home", ctaLabel, ctaHref }: SiteNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(activeHref);

  // Scroll-spy: highlight the nav item whose section is crossing the middle of the viewport
  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-gold/15 bg-charcoal/80 py-3 backdrop-blur-xl"
          : "border-b border-transparent py-5 md:py-7"
      )}
    >
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-12"
        aria-label="Primary"
      >
        <a href="#home" aria-label="StrikeZone Martial Arts — home" className="shrink-0">
          <BrandLockup preload className={cn("transition-all duration-500", scrolled ? "w-36 md:w-40" : "w-40 md:w-48")} />
        </a>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-9">
          {items.map((item) => {
            const active = item.href === current;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors xl:tracking-[0.22em]",
                    active ? "text-bone" : "text-stone hover:text-bone"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "bg-strike-gradient absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={ctaHref}
            className="bg-strike-gradient group hidden items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_0_0_rgba(224,33,125,0)] transition-shadow duration-300 hover:shadow-[0_0_28px_-4px_rgba(224,33,125,0.65)] sm:inline-flex"
          >
            {ctaLabel}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-11 items-center justify-center rounded-full border border-gold/30 text-bone transition-colors hover:border-gold lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex h-dvh flex-col bg-charcoal px-6 py-5 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <BrandLockup className="w-40" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-11 items-center justify-center rounded-full border border-gold/30 text-bone"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="mt-14 flex flex-col gap-2">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-baseline gap-4 border-b border-gold/10 py-3 font-display text-5xl tracking-wide",
                      item.href === current ? "text-bone" : "text-stone"
                    )}
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.2em] text-gold">
                      0{i + 1}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <a
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="bg-strike-gradient mt-auto flex items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-[0.2em] text-white"
            >
              {ctaLabel}
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
