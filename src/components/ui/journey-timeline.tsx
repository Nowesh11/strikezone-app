"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight, Flag, Home, Rocket, Sprout, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Journey — a pinned, horizontally scrolling timeline.                        */
/*                                                                              */
/*  Desktop (lg+): the section pins to the viewport and vertical scrolling      */
/*  drives the chapter track sideways, with a progress rail along the bottom.   */
/*  Below lg (and for reduced-motion users) it becomes a vertical timeline.    */
/* -------------------------------------------------------------------------- */

interface Chapter {
  id: string;
  label: string;
  /** Big figure: day number, or a word like "Now". */
  big: string;
  /** Line under the big figure, e.g. "June 2023". */
  when: string;
  /** Short marker for the progress rail. */
  rail: string;
  title: string;
  body: string;
  icon: LucideIcon;
  image?: { src: string; alt: string; position?: string; /** Big outlined text laid over the photo. */ overlay?: string };
}

const chapters: Chapter[] = [
  {
    id: "freelance",
    label: "Chapter 01",
    big: "01",
    when: "June 2023",
    rail: "Jun 2023",
    title: "The first chapter",
    body: "StrikeZone Martial Arts begins as a freelance academy with a simple objective — provide quality martial arts training and build a community around it.",
    icon: Sprout,
    image: {
      src: "/journey/strikezone-2023.jpg",
      alt: "The StrikeZone Martial Arts Academy signage on the building in 2023, with an Opening Soon banner.",
      position: "50% 40%",
      overlay: "2023",
    },
  },
  {
    id: "centre",
    label: "Chapter 02",
    big: "28",
    when: "October 2023",
    rail: "Oct 2023",
    title: "Our own centre",
    body: "With growing demand and an expanding community, StrikeZone opens its own dedicated training centre — a permanent home for structured, consistent training.",
    icon: Home,
    image: {
      src: "/journey/training-centre.jpg",
      alt: "Inside the StrikeZone training centre — matted floor and heavy bags ready for class.",
      position: "50% 48%",
    },
  },
  {
    id: "today",
    label: "Chapter 03",
    big: "Now",
    when: "Today",
    rail: "Today",
    title: "Continuing to grow",
    body: "Developing our coaching team, training programs and community while working towards a larger vision for martial arts development.",
    icon: Flag,
    image: {
      src: "/about/community-event.jpeg",
      alt: "StrikeZone members gathered together at a community event.",
      position: "50% 75%",
    },
  },
  {
    id: "ahead",
    label: "Chapter 04",
    big: "Next",
    when: "Looking ahead",
    rail: "Ahead",
    title: "The next chapter",
    body: "A stronger academy, more athletes, an expanding training community — and greater opportunities for everyone who wants to pursue martial arts.",
    icon: Rocket,
    image: {
      src: "/about/next-generation.jpeg",
      alt: "A large group of young children at a StrikeZone session — the next generation.",
      position: "50% 60%",
    },
  },
];

const photoGrade =
  "object-cover saturate-[.62] contrast-[1.1] brightness-[.78] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-[.95] group-hover:brightness-[.9]";

/* ------------------------------ Chapter panel ----------------------------- */

function ChapterPanel({ chapter, index, horizontal }: { chapter: Chapter; index: number; horizontal: boolean }) {
  const Icon = chapter.icon;
  const flip = horizontal && index % 2 === 1; // alternate text/image sides in the horizontal track

  return (
    <article
      aria-labelledby={`journey-${chapter.id}`}
      className={cn(
        "relative flex shrink-0 flex-col",
        horizontal ? "h-full w-[min(78vw,1020px)] justify-center" : "pl-10"
      )}
    >
      {/* Vertical timeline: dot + rail segment down to the next panel */}
      {!horizontal && (
        <>
          <span aria-hidden className="absolute top-8 -bottom-20 left-[9.5px] w-px bg-gradient-to-b from-gold/40 to-gold/10" />
          <span aria-hidden className="absolute top-2 left-0 flex size-5 items-center justify-center rounded-full border border-gold/50 bg-charcoal">
            <span className="size-1.5 rounded-full bg-gold" />
          </span>
        </>
      )}

      <div className={cn("grid gap-8", horizontal && "grid-cols-[0.9fr_1.1fr] items-center gap-14")}>
        {/* Text */}
        <div className={cn("relative", flip && "order-2")}>
          <div className="flex items-end gap-4">
            <span className="font-display text-[5.5rem] leading-[0.8] tracking-wide text-gold sm:text-[7rem] lg:text-[9rem]">
              {chapter.big}
            </span>
            <span className="mb-2 flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone">{chapter.label}</span>
              <span className="mt-1 font-display text-2xl tracking-wide text-bone lg:text-3xl">{chapter.when}</span>
            </span>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <Icon className="size-5" strokeWidth={1.7} />
            </span>
            <h3 id={`journey-${chapter.id}`} className="font-display text-4xl tracking-wide text-bone lg:text-5xl">
              {chapter.title}
            </h3>
          </div>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-stone">{chapter.body}</p>
        </div>

        {/* Visual */}
        <div className={cn("relative", flip && "order-1")}>
          {chapter.image ? (
            <figure className="group relative h-[260px] overflow-hidden rounded-3xl border border-gold/15 bg-charcoal-2 sm:h-[340px] lg:h-[52vh] lg:max-h-[520px]">
              <Image
                src={chapter.image.src}
                alt={chapter.image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                style={{ objectPosition: chapter.image.position }}
                className={photoGrade}
              />
              <div aria-hidden className="absolute inset-0 bg-gold/20 mix-blend-multiply" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/30" />
              {chapter.image.overlay && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 -right-2 font-display text-[6.5rem] leading-none text-transparent select-none [-webkit-text-stroke:1.5px_rgb(201_168_106/0.75)] sm:text-[8rem] lg:text-[9rem]"
                >
                  {chapter.image.overlay}
                </span>
              )}
              <figcaption className="absolute bottom-5 left-5 rounded-full border border-bone/15 bg-charcoal/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-bone backdrop-blur">
                {chapter.when}
              </figcaption>
            </figure>
          ) : (
            // Typographic panel for the chapter without a photo
            <div className="relative flex h-[260px] flex-col justify-between overflow-hidden rounded-3xl border border-gold/20 bg-[linear-gradient(145deg,#2e2e2e_0%,#1f1c17_55%,#3a3024_100%)] p-8 sm:h-[340px] lg:h-[52vh] lg:max-h-[520px] lg:p-10">
              <span aria-hidden className="text-outline-gold pointer-events-none absolute -right-4 -bottom-10 font-display text-[12rem] leading-none select-none [-webkit-text-stroke:1px_rgb(201_168_106/0.25)] lg:text-[16rem]">
                2023
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Humble beginnings</span>
              <p className="relative max-w-sm font-display text-3xl leading-[1.05] tracking-wide text-bone lg:text-4xl">
                Quality training first. <span className="text-gold">The community followed.</span>
              </p>
              <span className="relative text-xs font-medium text-stone">Freelance academy · Penang</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ Progress rail ----------------------------- */

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useSpring(progress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-8 hidden px-12 lg:block">
      <div className="relative mx-auto max-w-7xl">
        <div className="h-px w-full bg-gold/15" />
        <motion.div style={{ scaleX }} className="bg-strike-gradient absolute top-0 left-0 h-px w-full origin-left" />
        <div className="mt-4 flex justify-between">
          {["Start", ...chapters.map((c) => c.rail), "Join"].map((label) => (
            <span key={label} className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Section -------------------------------- */

export function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [horizontal, setHorizontal] = useState(false);

  // Horizontal mode only on large screens without a reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setHorizontal(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // How far the track must travel sideways
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || !horizontal) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [horizontal]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(rawX, { stiffness: 160, damping: 32, mass: 0.35 });
  const ghostX = useTransform(scrollYProgress, [0, 1], [0, -distance * 0.35]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      aria-labelledby="journey-heading"
      // Tall enough that vertical scroll maps 1:1 onto the horizontal travel
      style={horizontal && distance ? { height: `calc(100vh + ${distance}px)` } : undefined}
      className="relative border-t border-gold/10 bg-background"
    >
      <div className={cn("relative overflow-hidden", horizontal ? "sticky top-0 h-svh" : "py-24 md:py-32")}>
        {/* Ghost headline drifting behind the track */}
        <motion.span
          aria-hidden
          style={horizontal ? { x: ghostX } : undefined}
          className="text-outline-gold pointer-events-none absolute top-1/2 left-0 hidden -translate-y-1/2 font-display text-[26vw] leading-none whitespace-nowrap select-none lg:block"
        >
          The Journey · Since 2023
        </motion.span>
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/3 size-[800px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.08)_0%,transparent_65%)]"
        />

        <motion.div
          ref={trackRef}
          style={horizontal ? { x } : undefined}
          className={cn(
            "relative flex",
            horizontal
              ? "h-full w-max flex-row items-center gap-24 pr-[12vw] pl-12 xl:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]"
              : "mx-auto max-w-3xl flex-col gap-20 px-6 md:px-12"
          )}
        >
          {/* Intro panel */}
          <header className={cn("relative shrink-0", horizontal && "w-[min(34vw,460px)]")}>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="text-stone">06</span>
              <span className="h-px w-8 bg-gold" />
              Our Journey
            </p>
            <h2
              id="journey-heading"
              className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              From humble beginnings <span className="text-gold">to our own centre.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-stone">
              Built from a simple beginning and still growing — through the dedication of our coaches and students.
            </p>
            {horizontal && (
              <p className="mt-10 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-bone/70">
                Scroll to explore
                <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowRight className="size-4 text-gold" />
                </motion.span>
              </p>
            )}
          </header>

          {chapters.map((chapter, i) => (
            <ChapterPanel key={chapter.id} chapter={chapter} index={i} horizontal={horizontal} />
          ))}

          {/* Closing panel */}
          <div className={cn("relative shrink-0", horizontal ? "w-[min(40vw,520px)]" : "pl-10")}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Discipline • Development • Dedication</p>
            <p className="mt-6 font-display text-5xl leading-[0.95] tracking-wide text-bone lg:text-6xl">
              Train with purpose.
              <br />
              Develop with discipline.
              <br />
              <span className="text-gold">Strike with confidence.</span>
            </p>
            <a
              href="#contact"
              className="bg-strike-gradient group mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-shadow duration-300 hover:shadow-[0_0_36px_-6px_rgba(224,33,125,0.7)]"
            >
              Start your journey
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>

        {horizontal && <ProgressRail progress={scrollYProgress} />}
      </div>
    </section>
  );
}
