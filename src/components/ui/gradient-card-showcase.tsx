"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Brain, Dumbbell, HandFist, HeartPulse, Sprout, Trophy, Zap, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Discipline {
  num: string;
  /** Matches a discipline option in the contact form so the CTA can preselect it. */
  value: "boxing" | "muay-thai" | "fitness";
  title: string;
  tagline: string;
  desc: string;
  items: string[];
  icon: LucideIcon;
  /** Resting panel — gold family only; the pink→orange brand gradient is reserved for the hover glow. */
  gradientFrom: string;
  gradientTo: string;
}

const disciplines: Discipline[] = [
  {
    num: "01",
    value: "boxing",
    title: "Boxing",
    tagline: "The sweet science",
    desc: "The fundamentals of Western boxing — sharp technique, smart movement and relentless conditioning.",
    items: [
      "Stance & movement",
      "Footwork",
      "Punching technique",
      "Combinations",
      "Defensive techniques",
      "Timing & distance",
      "Pad work",
      "Conditioning",
    ],
    icon: HandFist,
    gradientFrom: "#e3c78f",
    gradientTo: "#9c7b45",
  },
  {
    num: "02",
    value: "muay-thai",
    title: "Muay Thai",
    tagline: "The art of eight limbs",
    desc: "Punches, kicks, knees and elbows — striking ability built through movement, drills and conditioning.",
    items: [
      "Basic Muay Thai techniques",
      "Pad work",
      "Bag work",
      "Combination drills",
      "Defensive movement",
      "Clinch fundamentals",
      "Conditioning",
    ],
    icon: Zap,
    gradientFrom: "#c9a86a",
    gradientTo: "#6e5530",
  },
  {
    num: "03",
    value: "fitness",
    title: "Martial Arts & Fitness",
    tagline: "Body & mind",
    desc: "Structured physical development that builds the athlete behind the technique.",
    items: [
      "Cardiovascular endurance",
      "Strength",
      "Speed",
      "Agility",
      "Coordination",
      "Flexibility",
      "Mental resilience",
    ],
    icon: Dumbbell,
    gradientFrom: "#d6b87c",
    gradientTo: "#7d6236",
  },
];

const goals: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Sprout, title: "Beginners", desc: "No experience required — learn the fundamentals at your pace." },
  { icon: HeartPulse, title: "Fitness", desc: "High-intensity movement, drills and conditioning that stay engaging." },
  { icon: Brain, title: "Self-development", desc: "Discipline, confidence, perseverance and mental resilience." },
  { icon: Trophy, title: "Competitive", desc: "Sharpen technique, conditioning and preparation for competition." },
];

const BRAND_GRADIENT = "linear-gradient(315deg, #f5a623, #e0217d)";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: i * 0.12 } }),
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } } as const;

// Shared geometry for the skewed panel and its glow
const panelClass =
  "absolute inset-y-0 left-[50px] w-1/2 rounded-2xl skew-x-[15deg] transition-all duration-500 group-hover:left-[20px] group-hover:w-[calc(100%-90px)] group-hover:skew-x-0";

function DisciplineCard({ d, index }: { d: Discipline; index: number }) {
  const Icon = d.icon;
  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      {...inView}
      className="group relative w-full max-w-[400px] py-10 transition-all duration-500"
    >
      {/* Skewed gold panel */}
      <span aria-hidden className={panelClass} style={{ background: `linear-gradient(315deg, ${d.gradientFrom}, ${d.gradientTo})` }} />
      {/* Soft gold bloom at rest, brand-gradient glow on hover */}
      <span
        aria-hidden
        className={cn(panelClass, "opacity-40 blur-[30px] group-hover:opacity-0")}
        style={{ background: `linear-gradient(315deg, ${d.gradientFrom}, ${d.gradientTo})` }}
      />
      <span
        aria-hidden
        className={cn(panelClass, "opacity-0 blur-[34px] group-hover:opacity-70")}
        style={{ background: BRAND_GRADIENT }}
      />

      {/* Floating glass blobs */}
      <span aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <span className="animate-blob absolute top-0 left-0 size-0 rounded-xl border border-bone/10 bg-bone/10 opacity-0 shadow-[0_5px_15px_rgba(0,0,0,0.25)] backdrop-blur-[10px] transition-all duration-300 group-hover:top-[-10px] group-hover:left-[50px] group-hover:size-[90px] group-hover:opacity-100" />
        <span className="animate-blob animation-delay-1000 absolute right-0 bottom-0 size-0 rounded-xl border border-bone/10 bg-bone/10 opacity-0 shadow-[0_5px_15px_rgba(0,0,0,0.25)] backdrop-blur-[10px] transition-all duration-500 group-hover:right-[50px] group-hover:bottom-[-10px] group-hover:size-[90px] group-hover:opacity-100" />
      </span>

      {/* Content */}
      <div className="relative left-0 z-20 rounded-2xl border border-gold/15 bg-charcoal/75 p-7 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 group-hover:-left-[25px] group-hover:border-gold/30 md:p-8 md:group-hover:py-10">
        <div className="flex items-start justify-between">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold transition-colors duration-500 group-hover:border-gold/60 group-hover:bg-gold group-hover:text-charcoal">
            <Icon className="size-7" strokeWidth={1.6} />
          </span>
          <span className="font-display text-4xl leading-none text-stone/40 transition-colors duration-500 group-hover:text-gold/70">
            {d.num}
          </span>
        </div>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{d.tagline}</p>
        <h3 className="mt-2 font-display text-4xl leading-[0.95] tracking-wide text-bone">{d.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-stone">{d.desc}</p>

        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-gold/10 pt-5" aria-label={`${d.title} training includes`}>
          {d.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs leading-snug text-bone/85">
              <span aria-hidden className="mt-1.5 size-1 shrink-0 rotate-45 bg-gold" />
              {item}
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          data-discipline={d.value}
          className="bg-strike-gradient mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow duration-300 hover:shadow-[0_0_28px_-4px_rgba(224,33,125,0.7)]"
        >
          Train {d.title === "Martial Arts & Fitness" ? "with us" : d.title}
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </motion.article>
  );
}

export default function SkewCards() {
  return (
    <section
      id="disciplines"
      aria-labelledby="disciplines-heading"
      className="relative overflow-hidden border-t border-gold/10 bg-background py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.08)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <motion.div variants={fadeUp} {...inView}>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="text-stone">05</span>
              <span className="h-px w-8 bg-gold" />
              Training Disciplines
            </p>
            <h2
              id="disciplines-heading"
              className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              Three disciplines. <span className="text-gold">One standard.</span>
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} custom={1} {...inView} className="max-w-md text-[15px] leading-relaxed text-stone">
            StrikeZone brings together different aspects of martial arts and combat sports under one training
            environment — progressive, structured and built on technique.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid justify-items-center gap-6 md:mt-16 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {disciplines.map((d, i) => (
            <DisciplineCard key={d.num} d={d} index={i} />
          ))}
        </div>

        {/* Training for different goals */}
        <motion.div variants={fadeUp} {...inView} className="mt-20 md:mt-28">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h3 className="font-display text-3xl tracking-wide text-bone md:text-4xl">
              Training for <span className="text-gold">every goal</span>
            </h3>
            <p className="max-w-sm text-sm text-stone">
              Every student joins for a different reason. Our training is built to accommodate them all.
            </p>
          </div>
          <ul className="mt-8 grid overflow-hidden rounded-2xl border border-gold/15 sm:grid-cols-2 lg:grid-cols-4">
            {goals.map(({ icon: Icon, title, desc }, i) => (
              <li
                key={title}
                className={cn(
                  "group/goal relative bg-charcoal-2/40 p-6 transition-colors duration-500 hover:bg-charcoal-2 md:p-8",
                  i > 0 && "border-t border-gold/15 sm:border-t-0",
                  i % 2 === 1 && "sm:border-l sm:border-gold/15",
                  i >= 2 && "sm:border-t sm:border-gold/15 lg:border-t-0",
                  i === 2 && "lg:border-l lg:border-gold/15"
                )}
              >
                <span
                  aria-hidden
                  className="bg-strike-gradient absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover/goal:scale-x-100"
                />
                <Icon className="size-6 text-gold" strokeWidth={1.6} />
                <p className="mt-5 font-display text-2xl tracking-wide text-bone">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">{desc}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
