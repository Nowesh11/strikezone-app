"use client";

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { FolderCard } from "@/components/ui/folder-card";

const missionAims = [
  "Develop proper martial arts fundamentals",
  "Improve physical fitness and conditioning",
  "Build discipline and mental resilience",
  "Develop confidence and self-belief",
  "Promote respect and sportsmanship",
  "Provide a safe, supportive training environment",
  "Prepare individuals for training and competition",
];

const visionPathways = ["Beginners", "Recreational", "Competitive athletes"];

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: i * 0.1 },
  }),
};

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } } as const;

export function MissionVision() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      className="relative overflow-hidden border-t border-gold/10 bg-background py-24 md:py-32"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-[-15%] size-[720px] rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.07)_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-0 size-[560px] rounded-full bg-[radial-gradient(circle,rgba(224,33,125,0.05)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <motion.div variants={fadeUp} {...inView}>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="text-stone">03</span>
              <span className="h-px w-8 bg-gold" />
              Mission &amp; Vision
            </p>
            <h2
              id="mission-heading"
              className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              Stronger physically. <span className="text-gold">Stronger mentally.</span>
            </h2>
          </motion.div>
          <motion.p
            variants={fadeUp}
            custom={1}
            {...inView}
            className="max-w-md text-[15px] leading-relaxed text-stone"
          >
            Everything we do is built around accessible, structured and quality training — and a community where
            every student can discover their potential.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-16 md:mt-20 lg:grid-cols-2 lg:gap-10 xl:gap-16">
          {/* Mission */}
          <motion.article variants={fadeUp} {...inView} className="flex flex-col">
            <FolderCard
              title="Our Mission"
              subtitle="Why we train"
              count="7"
              countLabel="Commitments"
              meta="Est. 2023"
              cover="/about/training-crew.jpeg"
              coverAlt="The StrikeZone training crew together in the academy."
              coverPosition="50% 58%"
              description="To provide accessible, structured and quality martial arts training that helps individuals become stronger — physically and mentally."
              className="w-full max-w-[520px]"
            />
            <div className="mt-10 max-w-[520px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone">We aim to</p>
              <ul className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {missionAims.map((aim, i) => (
                  <motion.li
                    key={aim}
                    variants={fadeUp}
                    custom={i * 0.5}
                    {...inView}
                    className="flex items-start gap-3 text-sm leading-snug text-bone/90"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {aim}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.article>

          {/* Vision */}
          <motion.article variants={fadeUp} custom={1} {...inView} className="flex flex-col lg:mt-24">
            <FolderCard
              title="Our Vision"
              subtitle="The road ahead"
              count="3"
              countLabel="Pathways"
              meta="Next generation"
              cover="/about/next-generation.jpeg"
              coverAlt="A large group of young children taking part in a StrikeZone session."
              coverPosition="50% 85%"
              description="To build StrikeZone into a respected martial arts community where individuals of all backgrounds can discover their potential through training."
              className="w-full max-w-[520px]"
            />
            <div className="mt-10 max-w-[520px]">
              <p className="text-[15px] leading-relaxed text-stone">
                A strong martial arts ecosystem that supports every stage of the journey — and creates opportunities
                for the next generation of martial artists.
              </p>
              <ul className="mt-8 flex flex-wrap gap-3" aria-label="Pathways we support">
                {visionPathways.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-flare/40 bg-flare/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-flare"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </div>

        {/* Pull quote */}
        <motion.figure
          variants={fadeUp}
          {...inView}
          className="relative mt-24 overflow-hidden rounded-3xl border border-gold/15 bg-charcoal-2 px-6 py-14 text-center md:mt-32 md:px-16 md:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,168,106,0.6),transparent)]"
          />
          <span aria-hidden className="block font-display text-7xl leading-[0.6] text-gold/40 md:text-8xl">
            &ldquo;
          </span>
          <blockquote className="mx-auto mt-4 max-w-4xl font-display text-3xl leading-[1.05] tracking-wide text-bone sm:text-4xl md:text-5xl">
            Martial arts is not only about learning how to fight. It is about learning how to{" "}
            <span className="text-gold">train, persevere, respect others</span> and continuously improve yourself.
          </blockquote>
          <figcaption className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-stone">
            The StrikeZone belief
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
