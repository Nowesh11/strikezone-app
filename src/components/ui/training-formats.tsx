"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowUpRight, User, Users, UsersRound, type LucideIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Training formats — a top-down boxing ring shows who's on the mats for      */
/*  each format: the coach (gold) and the students (bone) re-arrange as you     */
/*  switch between Group, Private Group and Private.                           */
/* -------------------------------------------------------------------------- */

type Point = [number, number];

interface Format {
  id: string;
  num: string;
  name: string;
  /** Value understood by the contact form's "Session type" field. */
  formValue: string;
  tag: string;
  desc: string;
  bestFor: string[];
  icon: LucideIcon;
  coach: Point;
  students: Point[];
}

// Ring floor spans roughly 70 → 330 on a 400×400 canvas
const formats: Format[] = [
  {
    id: "group",
    num: "01",
    name: "Group Class",
    formValue: "Group class",
    tag: "Train together, learn together",
    desc: "Open sessions with a structured training environment — push each other, learn from each other.",
    bestFor: ["Community energy", "Structured sessions", "All levels"],
    icon: UsersRound,
    coach: [200, 104],
    students: [
      [118, 176], [173, 176], [228, 176], [283, 176],
      [118, 231], [173, 231], [228, 231], [283, 231],
      [118, 286], [173, 286], [228, 286], [283, 286],
    ],
  },
  {
    id: "private-group",
    num: "02",
    name: "Private Group Class",
    formValue: "Private group class",
    tag: "Your crew, your coach",
    desc: "Train with your own group, with coaching tailored to your group's needs and goals.",
    bestFor: ["Friends & family", "Teams & colleagues", "Shared goals"],
    icon: Users,
    coach: [200, 118],
    students: [
      [132, 228], [178, 262], [222, 262], [268, 228],
      [200, 200], [200, 200], [200, 200], [200, 200],
      [200, 200], [200, 200], [200, 200], [200, 200],
    ],
  },
  {
    id: "private",
    num: "03",
    name: "Private Class",
    formValue: "Private class (1-to-1)",
    tag: "1-to-1 coaching",
    desc: "Coaching focused entirely on your technique, development and individual goals.",
    bestFor: ["Fastest progress", "Technique detail", "Flexible pace"],
    icon: User,
    coach: [200, 152],
    students: [
      [200, 252],
      [200, 200], [200, 200], [200, 200], [200, 200], [200, 200],
      [200, 200], [200, 200], [200, 200], [200, 200], [200, 200], [200, 200],
    ],
  },
];

const visibleCount = (f: Format) => (f.id === "group" ? 12 : f.id === "private-group" ? 4 : 1);
const spring = { type: "spring", stiffness: 140, damping: 18, mass: 0.8 } as const;

/* --------------------------------- The ring -------------------------------- */

function Ring({ format }: { format: Format }) {
  const shown = visibleCount(format);
  const [cx, cy] = format.coach;
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full" role="img" aria-label={`${format.name}: ${format.tag}`}>
      <defs>
        <radialGradient id="ring-floor" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#34302a" />
          <stop offset="1" stopColor="#222222" />
        </radialGradient>
        <radialGradient id="coach-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9a86a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#c9a86a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ring-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0217d" />
          <stop offset="1" stopColor="#f5a623" />
        </linearGradient>
      </defs>

      {/* Apron + canvas */}
      <rect x="20" y="20" width="360" height="360" rx="18" fill="#1c1c1c" stroke="rgba(201,168,106,0.18)" />
      <rect x="54" y="54" width="292" height="292" rx="6" fill="url(#ring-floor)" />
      {/* Canvas logo ring */}
      <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(201,168,106,0.10)" strokeWidth="2" />
      <circle cx="200" cy="200" r="46" fill="none" stroke="rgba(201,168,106,0.06)" strokeWidth="1" />

      {/* Ropes */}
      {[40, 46, 52].map((o, i) => (
        <rect
          key={o}
          x={o}
          y={o}
          width={400 - o * 2}
          height={400 - o * 2}
          rx="8"
          fill="none"
          stroke={i === 1 ? "url(#ring-brand)" : "rgba(201,168,106,0.55)"}
          strokeWidth={i === 1 ? 1.6 : 1.2}
          opacity={i === 1 ? 0.85 : 1}
        />
      ))}
      {/* Corner posts */}
      {[
        [40, 40],
        [360, 40],
        [40, 360],
        [360, 360],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#1a1a1a" stroke="#c9a86a" strokeWidth="2" />
          <circle cx={x} cy={y} r="3.5" fill={i === 0 ? "#e0217d" : i === 3 ? "#f5a623" : "#c9a86a"} />
        </g>
      ))}

      {/* Coach → student lines */}
      {format.students.map(([sx, sy], i) => (
        <motion.line
          key={`l${i}`}
          initial={false}
          animate={{ x1: cx, y1: cy, x2: sx, y2: sy, opacity: i < shown ? (shown === 1 ? 0.5 : 0.14) : 0 }}
          transition={spring}
          stroke="#c9a86a"
          strokeWidth={shown === 1 ? 1.5 : 1}
          strokeDasharray={shown === 1 ? "4 5" : undefined}
        />
      ))}

      {/* 1-to-1 focus ring */}
      <motion.ellipse
        initial={false}
        animate={{ opacity: shown === 1 ? 1 : 0, rx: shown === 1 ? 70 : 40, ry: shown === 1 ? 92 : 40 }}
        transition={spring}
        cx="200"
        cy="202"
        fill="none"
        stroke="url(#ring-brand)"
        strokeWidth="1.5"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />

      {/* Students */}
      {format.students.map(([sx, sy], i) => (
        <motion.g key={`s${i}`} initial={false} animate={{ x: sx, y: sy, opacity: i < shown ? 1 : 0, scale: i < shown ? 1 : 0.2 }} transition={{ ...spring, delay: i * 0.018 }}>
          <circle r="13" fill="#2e2e2e" stroke="rgba(245,240,232,0.35)" strokeWidth="1.5" />
          <circle r="5.5" fill="#f5f0e8" />
        </motion.g>
      ))}

      {/* Coach */}
      <motion.g initial={false} animate={{ x: cx, y: cy }} transition={spring}>
        <circle r="34" fill="url(#coach-glow)" />
        <circle r="16" fill="#1a1a1a" stroke="#c9a86a" strokeWidth="2.5" />
        <circle r="7" fill="#c9a86a" />
        <text y="-24" textAnchor="middle" fill="#c9a86a" style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
          COACH
        </text>
      </motion.g>
    </svg>
  );
}

/* --------------------------------- Section -------------------------------- */

export function TrainingFormats() {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });
  const reduceMotion = usePrefersReducedMotion();
  const format = formats[active];

  // Gentle auto-tour while in view, until the visitor picks a format themselves
  useEffect(() => {
    if (interacted || !inView || reduceMotion) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % formats.length), 4200);
    return () => window.clearInterval(t);
  }, [interacted, inView, reduceMotion]);

  const choose = (i: number) => {
    setInteracted(true);
    setActive(i);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = Math.max(0, tabs.indexOf(document.activeElement as HTMLButtonElement));
    const next = (current + step + tabs.length) % tabs.length;
    tabs[next]?.focus();
    choose(next);
  };

  return (
    <section
      id="formats"
      ref={sectionRef}
      aria-labelledby="formats-heading"
      className="relative overflow-hidden border-t border-gold/10 bg-background py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-12%] size-[780px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.09)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="text-stone">07</span>
              <span className="h-px w-8 bg-gold" />
              Training Formats
            </p>
            <h2
              id="formats-heading"
              className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              Choose your <span className="text-gold">training style.</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-stone">
            Train with the community, bring your own group, or get 1-to-1 coaching — StrikeZone has a class for you.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-12 md:mt-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Format selector */}
          <div role="tablist" aria-label="Training formats" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex flex-col gap-3">
            {formats.map((f, i) => {
              const selected = i === active;
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  id={`format-tab-${f.id}`}
                  aria-selected={selected}
                  aria-controls="format-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-gold/60 md:p-6",
                    selected ? "border-gold/50 bg-charcoal-2" : "border-gold/10 bg-charcoal-2/30 hover:border-gold/30"
                  )}
                >
                  {/* Auto-tour progress */}
                  {selected && !interacted && !reduceMotion && inView && (
                    <motion.span
                      key={`p${active}`}
                      aria-hidden
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 4.2, ease: "linear" }}
                      className="bg-strike-gradient absolute inset-x-0 bottom-0 h-0.5 origin-left"
                    />
                  )}
                  {selected && (interacted || reduceMotion) && (
                    <span aria-hidden className="bg-strike-gradient absolute inset-y-0 left-0 w-0.5" />
                  )}

                  <div className="flex items-center gap-4 md:gap-5">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500",
                        selected ? "border-gold bg-gold text-charcoal" : "border-gold/25 bg-gold/5 text-gold"
                      )}
                    >
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="font-display text-lg text-stone">{f.num}</span>
                        <span className={cn("font-display text-3xl tracking-wide transition-colors md:text-4xl", selected ? "text-bone" : "text-bone/70")}>
                          {f.name}
                        </span>
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{f.tag}</span>
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {selected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-sm leading-relaxed text-stone md:pl-[68px]">{f.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Ring visual + details */}
          <div id="format-panel" role="tabpanel" aria-labelledby={`format-tab-${format.id}`} className="relative mx-auto w-full max-w-[520px]">
            <div aria-hidden className="absolute inset-8 rounded-full bg-gold/10 blur-[80px]" />
            <div className="relative">
              <Ring format={format} />
            </div>

            <div className="relative mt-6 flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={format.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap justify-center gap-2 sm:justify-start"
                  aria-label={`${format.name} is best for`}
                >
                  {format.bestFor.map((b) => (
                    <li key={b} className="rounded-full border border-gold/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone">
                      {b}
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
              <a
                href="#contact"
                data-format={format.formValue}
                className="bg-strike-gradient group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow duration-300 hover:shadow-[0_0_28px_-4px_rgba(224,33,125,0.7)]"
              >
                Book {format.id === "private" ? "1-to-1" : format.id === "group" ? "a group class" : "your group"}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-20 text-center font-display text-4xl tracking-wide text-bone md:mt-24 md:text-6xl">
          Your goals. <span className="text-gold">Your pace.</span> Your training.
        </p>
      </div>
    </section>
  );
}
