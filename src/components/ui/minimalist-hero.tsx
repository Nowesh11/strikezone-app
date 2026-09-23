"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinimalistHeroProps {
  eyebrow: string;
  mainText: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  overlayText: { part1: string[]; part2: string[] };
  /** Plain-language version of the stylised headline, for screen readers and crawlers. */
  headingContext?: string;
  stats: { value: string; label: string }[];
  socialLinks: { icon: ReactNode; href: string; label: string }[];
  motto: string;
  locationText: string;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

const SocialIcon = ({ href, icon, label }: { href: string; icon: ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex size-9 items-center justify-center rounded-full border border-gold/20 text-stone transition-all duration-300 hover:border-gold hover:text-gold"
  >
    {icon}
  </a>
);

export const MinimalistHero = ({
  eyebrow,
  mainText,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  overlayText,
  headingContext,
  stats,
  socialLinks,
  motto,
  locationText,
  className,
}: MinimalistHeroProps) => {
  return (
    <section
      id="home"
      className={cn(
        "relative flex min-h-svh w-full flex-col items-center overflow-hidden bg-background px-6 pt-28 pb-8 md:px-12 lg:h-svh lg:min-h-[760px] lg:pt-32",
        className
      )}
    >
      {/* Atmosphere: warm vignette + outlined watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.10)_0%,rgba(26,26,26,0)_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
        <span className="text-outline-gold absolute -bottom-6 left-1/2 -translate-x-1/2 font-display text-[22vw] leading-none whitespace-nowrap select-none">
          STRIKEZONE
        </span>
      </div>

      {/* Main content */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.15fr_1fr] lg:gap-6">
        {/* Left: intro */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease }}
          className="z-20 order-3 text-center lg:order-1 lg:text-left"
        >
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-8 bg-gold" />
            {eyebrow}
          </p>
          <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-stone lg:mx-0">{mainText}</p>

          <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={primaryCta.href}
              className="bg-strike-gradient group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-shadow duration-300 hover:shadow-[0_0_36px_-6px_rgba(224,33,125,0.7)]"
            >
              {primaryCta.label}
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={secondaryCta.href}
              className="border-b border-gold/40 pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold"
            >
              {secondaryCta.label}
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 divide-x divide-gold/15 border-y border-gold/15 py-5">
            {stats.map((s) => (
              <div key={s.label} className="px-3 first:pl-0 last:pr-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl leading-none text-gold">{s.value}</dd>
                <dd className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Center: fighter over gold disc */}
        <div className="relative order-1 flex h-[420px] items-end justify-center sm:h-[520px] lg:order-2 lg:h-full">
          <motion.div
            aria-hidden
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 size-[300px] -translate-x-1/2 -translate-y-[46%] rounded-full bg-gold sm:size-[380px] xl:size-[460px]"
          />
          <motion.div
            aria-hidden
            initial={{ scale: 0.8, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.35 }}
            className="absolute top-1/2 left-1/2 size-[350px] -translate-x-1/2 -translate-y-[46%] rounded-full border border-dashed border-gold/35 sm:size-[440px] xl:size-[530px]"
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.45 }}
            className="relative z-10 h-full w-full"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              preload
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4, ease }}
            className="absolute bottom-[16%] left-0 z-20 rounded-full bg-flare px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal sm:left-4"
          >
            Boxing · Muay Thai · Taekwondo
          </motion.span>
        </div>

        {/* Right: headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="z-20 order-2 flex justify-center text-center lg:order-3 lg:justify-end lg:text-right"
        >
          {/* Each part is one line on mobile/tablet, and splits into stacked words on desktop */}
          <h1 className="font-display text-[clamp(2.25rem,10.5vw,4.5rem)] leading-[0.95] tracking-wide text-bone lg:text-[5rem] lg:leading-[0.86] xl:text-[6.25rem] 2xl:text-[7.5rem]">
            {/* The stylised slogan alone says nothing about what this place is
                or where it is, so the accessible heading leads with that. */}
            {headingContext && <span className="sr-only">{headingContext}. </span>}
            {[overlayText.part1, overlayText.part2].map((lines, p) => (
              <span key={p} className={cn("block whitespace-nowrap lg:whitespace-normal", p === 1 && "text-gold")}>
                {lines.map((line, i) => (
                  <span key={line} className="lg:block">
                    {line}
                    {i < lines.length - 1 && " "}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </motion.div>
      </div>

      {/* Footer strip */}
      <motion.footer
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease }}
        className="relative z-30 mt-10 flex w-full max-w-7xl flex-col items-center gap-5 border-t border-gold/15 pt-6 sm:flex-row sm:justify-between lg:mt-4"
      >
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <SocialIcon key={link.label} {...link} />
          ))}
        </div>
        <p className="hidden text-[11px] font-semibold uppercase tracking-[0.4em] text-gold/80 md:block">
          {motto}
        </p>
        <p className="flex items-center gap-2 text-xs font-medium text-stone">
          <MapPin className="size-4 text-gold" />
          {locationText}
        </p>
      </motion.footer>
    </section>
  );
};
