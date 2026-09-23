"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CoachItem {
  num: string;
  /** Big display name, one entry per line. */
  nameLines: [string, string];
  fullName: string;
  role: string;
  years: number;
  alias?: string;
  bio: string;
  focus: string[];
  /** Mask pattern the portrait is revealed through. */
  shape: "strike" | "bento" | "grid";
  /** Portrait path, e.g. "/coaches/joel-reyes.webp". Shows a branded placeholder until set. */
  image?: string;
  /** SVG preserveAspectRatio alignment for the square crop, e.g. "xMidYMin" to keep the face in frame. */
  imageAlign?: string;
  /** Transparent cut-out: sit it on the gold gradient backdrop. */
  cutout?: boolean;
}

const defaultItems: CoachItem[] = [
  {
    num: "01",
    nameLines: ["Joel", "Reyes"],
    fullName: "Joel Reyes",
    role: "Head Coach",
    years: 5,
    bio: "Oversees the academy's training direction — building programs, holding the standard and guiding every student's fundamentals, technique and performance.",
    focus: ["Training & Development", "Student Progression", "Technical Guidance", "Academy Development"],
    shape: "strike",
    image: "/coaches/joel-reyes.webp",
    imageAlign: "xMidYMin",
    cutout: true,
  },
  {
    num: "02",
    nameLines: ["Ng Zhang", "Zhen"],
    fullName: "Ng Zhang Zheng",
    role: "Boxing Coach",
    years: 6,
    bio: "Brings a dedicated boxing perspective — movement, footwork, punching technique, combinations and defence, built on timing, coordination and discipline.",
    focus: ["Boxing Fundamentals", "Footwork & Movement", "Technical Drills", "Boxing Conditioning"],
    shape: "bento",
    image: "/coaches/ng-zhang-zhen.webp",
    imageAlign: "xMidYMin",
    cutout: true,
  },
  {
    num: "03",
    nameLines: ["Dek", "Ann"],
    fullName: "Nurhan Iskandar Zulkarnain",
    alias: "Dek Ann",
    role: "Muay Thai Coach",
    years: 5,
    bio: "Develops Muay Thai fundamentals, striking technique, movement and conditioning — the art of eight limbs, applied with purpose.",
    focus: ["Muay Thai Fundamentals", "Striking Technique", "Pad Work & Drills", "Conditioning"],
    shape: "grid",
    image: "/coaches/dek-ann.webp",
    imageAlign: "xMidYMin",
    cutout: true,
  },
];

/* Mask shapes on a 500×500 canvas. Every piece carries the `path` class so the
   timeline can scale them in individually. */
function ClipShapes({ shape }: { shape: CoachItem["shape"] }) {
  if (shape === "strike") {
    // Five slanted "strike" bars of varying length
    const tops = [70, 20, 45, 20, 80];
    const bottoms = [430, 480, 455, 480, 420];
    return (
      <>
        {tops.map((top, i) => {
          const x = i * 96 - 10;
          return (
            <polygon
              key={i}
              className="path"
              points={`${x + 56},${top} ${x + 142},${top} ${x + 86},${bottoms[i]} ${x},${bottoms[i]}`}
            />
          );
        })}
      </>
    );
  }
  if (shape === "bento") {
    // Large centre tile keeps the face and gloves whole; smaller tiles frame it
    return (
      <>
        <rect className="path" x="110" y="20" width="280" height="300" rx="14" />
        <rect className="path" x="20" y="20" width="72" height="140" rx="12" />
        <rect className="path" x="20" y="180" width="72" height="140" rx="12" />
        <rect className="path" x="408" y="20" width="72" height="140" rx="12" />
        <rect className="path" x="408" y="180" width="72" height="140" rx="12" />
        <rect className="path" x="20" y="340" width="220" height="140" rx="12" />
        <rect className="path" x="260" y="340" width="220" height="140" rx="12" />
      </>
    );
  }
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          className="path"
          x={(i % 3) * 160 + 20}
          y={Math.floor(i / 3) * 160 + 20}
          width="140"
          height="140"
          rx="4"
        />
      ))}
    </>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const Component = ({ items = defaultItems, className }: { items?: CoachItem[]; className?: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = (i: number) => `coach-clip-${uid}-${i}`;
  const active = items[activeIndex];

  // Preload portraits so switching coaches never flashes an empty mask
  useEffect(() => {
    items.forEach((item) => {
      if (item.image) new window.Image().src = item.image;
    });
  }, [items]);

  // Reveal the active portrait: pieces burst in, then breathe gently until the next switch
  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const pieces = root.querySelectorAll<SVGElement>(`#${clipId(activeIndex)} .path`);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    timeline.current?.kill();
    if (reduceMotion) {
      gsap.set(pieces, { scale: 1, transformOrigin: "50% 50%" });
      return;
    }

    gsap.set(pieces, { scale: 0, transformOrigin: "50% 50%" });
    const tl = gsap.timeline();
    tl.to(pieces, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    }).to(pieces, {
      scale: 1.04,
      duration: 1.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      stagger: { amount: 0.2, from: "center" },
    });
    timeline.current = tl;

    return () => {
      tl.kill();
    };
    // clipId is derived from a stable useId value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const select = (index: number) => {
    if (index !== activeIndex) setActiveIndex(index);
  };

  // Arrow keys move between coaches (WAI-ARIA tabs pattern)
  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = Math.max(0, tabs.indexOf(document.activeElement as HTMLButtonElement));
    tabs[(current + step + tabs.length) % tabs.length]?.focus();
  };

  return (
    <section
      id="coaches"
      ref={containerRef}
      aria-labelledby="coaches-heading"
      className={cn("relative w-full overflow-hidden border-t border-gold/10 bg-background py-24 md:py-32", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-10%] size-[760px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.09)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="text-stone">04</span>
              <span className="h-px w-8 bg-gold" />
              Coaching Team
            </p>
            <h2
              id="coaches-heading"
              className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              Led by experience. <span className="text-gold">Built on discipline.</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-stone">
            A combined <span className="font-semibold text-bone">16 years of coaching</span> across striking, movement
            and conditioning — so every student builds a broader understanding of combat sports.
          </p>
        </div>

        <div className="mt-16 flex flex-col items-center gap-14 md:mt-20 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* LEFT: coach list */}
          <div className="z-20 w-full lg:w-[46%]">
            <ul className="flex flex-col" role="tablist" aria-label="Coaches" aria-orientation="vertical" onKeyDown={onListKeyDown}>
              {items.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <li key={item.num} className="border-b border-gold/10 first:border-t">
                    <button
                      type="button"
                      role="tab"
                      id={`coach-tab-${uid}-${index}`}
                      aria-selected={isActive}
                      aria-controls={`coach-panel-${uid}`}
                      tabIndex={isActive ? 0 : -1}
                      onMouseEnter={() => select(index)}
                      onFocus={() => select(index)}
                      onClick={() => select(index)}
                      className="group flex w-full cursor-pointer items-start gap-5 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-gold/60 md:gap-8 md:py-9"
                    >
                      <span
                        className={cn(
                          "mt-1.5 font-display text-2xl tracking-wider transition-all duration-500 md:text-3xl",
                          isActive ? "scale-110 text-gold" : "text-stone/60"
                        )}
                      >
                        {item.num}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={cn(
                            "font-display text-5xl leading-[0.88] tracking-wide uppercase transition-all duration-700 sm:text-6xl xl:text-7xl",
                            isActive
                              ? "translate-x-3 text-bone"
                              : "text-transparent opacity-60 [-webkit-text-stroke:1.2px_rgb(201_168_106/0.45)] group-hover:opacity-90"
                          )}
                        >
                          {item.nameLines[0]}
                          <br />
                          {item.nameLines[1]}
                        </span>
                        <span
                          className={cn(
                            "mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-500",
                            isActive ? "translate-x-3 text-gold" : "text-stone/70"
                          )}
                        >
                          {item.role} · {item.years} yrs
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "bg-strike-gradient mt-4 h-0.5 w-10 origin-right rounded-full transition-transform duration-500",
                          isActive ? "scale-x-100" : "scale-x-0"
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: masked portrait + details */}
          <div className="relative flex w-full flex-col items-center lg:w-[50%]">
            <div
              aria-hidden
              className="absolute top-[35%] left-1/2 h-[80%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[110px]"
            />

            <div className="relative w-full max-w-[500px]">
              <svg
                viewBox="0 0 500 500"
                role="img"
                aria-label={`Portrait of ${active.fullName}, ${active.role}`}
                className="relative z-10 h-auto w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
              >
                <defs>
                  {items.map((item, i) => (
                    <clipPath key={item.num} id={clipId(i)}>
                      <ClipShapes shape={item.shape} />
                    </clipPath>
                  ))}
                  <linearGradient id={`coach-ph-${uid}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#2e2e2e" />
                    <stop offset="0.55" stopColor="#3a3226" />
                    <stop offset="1" stopColor="#c9a86a" />
                  </linearGradient>
                  <radialGradient id={`coach-vignette-${uid}`} cx="0.5" cy="0.4" r="0.75">
                    <stop offset="0.55" stopColor="#1a1a1a" stopOpacity="0" />
                    <stop offset="1" stopColor="#1a1a1a" stopOpacity="0.55" />
                  </radialGradient>
                </defs>

                <g clipPath={`url(#${clipId(activeIndex)})`}>
                  {active.image ? (
                    <>
                      {active.cutout && <rect width="500" height="500" fill={`url(#coach-ph-${uid})`} />}
                      <image
                        key={active.image}
                        href={active.image}
                        width="500"
                        height="500"
                        preserveAspectRatio={`${active.imageAlign ?? "xMidYMid"} slice`}
                        style={{ filter: "saturate(0.85) contrast(1.05)" }}
                      />
                      {!active.cutout && (
                        <>
                          <rect width="500" height="500" fill="#c9a86a" opacity="0.14" style={{ mixBlendMode: "multiply" }} />
                          <rect width="500" height="500" fill={`url(#coach-vignette-${uid})`} />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <rect width="500" height="500" fill={`url(#coach-ph-${uid})`} />
                      <text
                        x="250"
                        y="285"
                        textAnchor="middle"
                        fill="#1a1a1a"
                        fillOpacity="0.55"
                        style={{ fontFamily: "var(--font-bebas)", fontSize: 220, letterSpacing: 8 }}
                      >
                        {initials(active.alias ?? active.fullName)}
                      </text>
                    </>
                  )}
                </g>
              </svg>

              {/* Experience badge */}
              <div className="absolute -top-3 -right-1 z-20 flex size-24 flex-col items-center justify-center rounded-full border border-gold/40 bg-charcoal/90 backdrop-blur md:size-28">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active.num}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="font-display text-4xl leading-none text-gold md:text-5xl"
                  >
                    {active.years}
                  </motion.span>
                </AnimatePresence>
                <span className="mt-1 text-center text-[9px] leading-tight font-semibold uppercase tracking-[0.18em] text-stone">
                  Years
                  <br />
                  coaching
                </span>
              </div>
            </div>

            {/* Details */}
            <div
              id={`coach-panel-${uid}`}
              role="tabpanel"
              aria-labelledby={`coach-tab-${uid}-${activeIndex}`}
              aria-live="polite"
              className="relative z-20 mt-8 w-full max-w-[500px] rounded-2xl border border-gold/15 bg-charcoal-2/80 p-6 backdrop-blur md:p-8"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.num}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-3xl tracking-wide text-bone">{active.fullName}</h3>
                    {active.alias && (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                        a.k.a. {active.alias}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{active.bio}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${active.fullName}'s focus areas`}>
                    {active.focus.map((f) => (
                      <li
                        key={f}
                        className="rounded-full border border-gold/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone/85"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Component as CoachesShowcase };
