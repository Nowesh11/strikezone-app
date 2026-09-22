"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Photo = { src: string; alt: string; width: number; height: number }

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>
}

const defaultAchievements = [
  { label: "Years combined coaching", value: "16+" },
  { label: "Expert coaches", value: "3" },
  { label: "Striking disciplines", value: "2" },
  { label: "Year founded", value: "2023" },
]

const gallery: Array<Photo & { caption: string; tag: string }> = [
  {
    src: "/about/community-family.jpeg",
    alt: "StrikeZone students of all ages posing together on the training mats.",
    width: 607,
    height: 1080,
    tag: "01",
    caption: "The StrikeZone family",
  },
  {
    src: "/about/young-martial-artists.jpeg",
    alt: "Young StrikeZone students in white uniforms celebrating after class.",
    width: 607,
    height: 1080,
    tag: "02",
    caption: "Young martial artists",
  },
  {
    src: "/about/training-crew.jpeg",
    alt: "StrikeZone training crew standing together in the academy.",
    width: 607,
    height: 1080,
    tag: "03",
    caption: "The training crew",
  },
]

const timeline = [
  {
    date: "1 June 2023",
    title: "Freelance beginnings",
    body: "StrikeZone starts as a freelance academy with one objective: quality training and a community around it.",
  },
  {
    date: "28 October 2023",
    title: "Our own centre",
    body: "A growing community leads to a dedicated training centre and a more structured training system.",
  },
  {
    date: "Today",
    title: "Continuing to grow",
    body: "Developing our coaching team, programs and community towards a larger vision for martial arts.",
  },
]

const principles = ["Discipline", "Development", "Dedication"]

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: i * 0.1 },
  }),
}

// Warm, slightly desaturated grade so phone photos sit well on the charcoal theme
const photoGrade =
  "object-cover saturate-[.62] contrast-[1.12] brightness-[.74] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-[.95] group-hover:brightness-[.9]"

// Gold multiply wash that warms the white gym walls into the brand palette
const goldTint = "pointer-events-none absolute inset-0 bg-gold/25 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-40"

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
      <span className="text-stone">{index}</span>
      <span className="h-px w-8 bg-gold" />
      {children}
    </p>
  )
}

export default function AboutPage({ achievements = defaultAchievements }: AboutPageProps) {
  return (
    <div className="relative flex flex-col overflow-hidden bg-background">
      {/* ---------------- INTRO ---------------- */}
      <section id="about" aria-labelledby="about-heading" className="relative py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-20%] size-[700px] rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.08)_0%,transparent_65%)]"
        />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <Eyebrow index="01">About StrikeZone</Eyebrow>
          </motion.div>

          <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <motion.h2
              id="about-heading"
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              More than a gym. <span className="text-gold">A training community</span>{" "}
              <span className="text-stone/70">built on discipline, development and dedication.</span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6 self-end text-[15px] leading-relaxed text-stone"
            >
              <p>
                StrikeZone Martial Arts is an academy dedicated to developing individuals through structured
                training, discipline, fitness and practical combat skills.
              </p>
              <p>
                Whether you&apos;re stepping onto the mats for the first time, training for fitness, learning
                self-defence or preparing for competition — this is a place to learn, challenge yourself and keep
                improving.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="group h-11 gap-1.5 rounded-full border-gold/40 bg-transparent pr-3 pl-5 text-xs font-semibold uppercase tracking-[0.2em] text-bone hover:border-gold hover:bg-gold hover:text-charcoal"
                >
                  <Link href="#story">
                    <span>Our Story</span>
                    <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <ul className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/80">
                  {principles.map((p, i) => (
                    <li key={p} className="flex items-center gap-3">
                      {i > 0 && <span className="size-1 rounded-full bg-gold/50" aria-hidden />}
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Photo triptych */}
          <div className="mt-16 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-3 md:gap-5">
            {gallery.map((photo, i) => (
              <motion.figure
                key={photo.src}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-gold/10 bg-charcoal-2",
                  i === 0 ? "col-span-2 h-[340px] sm:h-[420px] md:col-span-1 md:h-[520px]" : "h-[260px] sm:h-[340px] md:h-[520px]",
                  i === 1 && "md:mt-12"
                )}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(photoGrade, i === 0 ? "object-[50%_62%]" : "object-center")}
                />
                <div className={goldTint} />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(26,26,26,0.6)_0%,transparent_30%,transparent_50%,#1a1a1a_100%)]" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:p-4 md:p-6">
                  <span className={cn("font-display leading-none tracking-wide text-bone md:text-3xl", i === 0 ? "text-2xl" : "text-lg sm:text-2xl")}>
                    {photo.caption}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-gold">{photo.tag}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          {/* Achievements */}
          <motion.dl
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 grid grid-cols-2 border-y border-gold/15 md:mt-24 md:grid-cols-4"
          >
            {achievements.map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex flex-col gap-3 py-8 md:px-8 md:py-10",
                  i % 2 === 1 && "border-l border-gold/15 pl-6",
                  i >= 2 && "border-t border-gold/15 md:border-t-0",
                  i > 0 && "md:border-l md:border-gold/15",
                  i === 0 && "md:pl-0"
                )}
              >
                <dt className="order-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
                  {item.label}
                </dt>
                <dd className="order-1 font-display text-6xl leading-none text-gold md:text-7xl">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ---------------- STORY ---------------- */}
      <section id="story" aria-labelledby="story-heading" className="relative pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl space-y-16 px-6 md:px-12">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <Eyebrow index="02">Our Story</Eyebrow>
              <h2
                id="story-heading"
                className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
              >
                From freelance classes <span className="text-gold">to our own centre.</span>
              </h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone">
                From its freelance beginnings to operating its own centre, StrikeZone has grown through the
                commitment of its coaches, students and the wider martial arts community.
              </p>
            </motion.div>

            <ol className="relative space-y-10 border-l border-gold/20 pl-8 md:mt-16">
              {timeline.map((step, i) => (
                <motion.li
                  key={step.date}
                  variants={fadeUp}
                  custom={i + 1}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1 -left-[37px] size-[9px] rounded-full ring-4 ring-charcoal",
                      i === timeline.length - 1 ? "bg-strike-gradient" : "bg-gold"
                    )}
                  />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">{step.date}</p>
                  <h3 className="mt-2 font-display text-3xl tracking-wide text-bone">{step.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-stone">{step.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Bento: big image + two cards */}
          <div className="flex flex-col gap-5 md:flex-row">
            {/* LEFT BIG IMAGE */}
            <motion.figure
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative min-h-[540px] overflow-hidden rounded-2xl border border-gold/10 bg-charcoal-2 md:min-h-[640px] md:flex-[1.1]"
            >
              <Image
                src="/about/community-event.jpeg"
                alt="StrikeZone members together at a community event."
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className={cn(photoGrade, "object-[50%_78%]")}
              />
              <div className={goldTint} />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(26,26,26,0.55)_0%,transparent_25%,rgba(26,26,26,0.4)_55%,#1a1a1a_100%)]" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <span className="inline-block rounded-full bg-flare px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal">
                  Our Community
                </span>
                <h3 className="mt-4 max-w-md font-display text-4xl leading-[0.95] tracking-wide text-bone md:text-5xl">
                  Built through respect, encouragement and shared experiences.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70">
                  Different backgrounds, personalities and goals — one shared love of martial arts.
                </p>
              </figcaption>
            </motion.figure>

            {/* RIGHT TWO CARDS */}
            <div className="flex flex-col gap-5 md:flex-1">
              {/* FIRST CARD */}
              <motion.article
                variants={fadeUp}
                custom={1}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-charcoal-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:border-gold/40"
              >
                <div className="relative h-56 w-full overflow-hidden sm:h-64 md:h-52">
                  <Image
                    src="/about/next-generation.jpeg"
                    alt="A large group of young children taking part in a StrikeZone session."
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className={cn(photoGrade, "object-[50%_60%]")}
                  />
                  <div className={goldTint} />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-charcoal-2 via-charcoal-2/70 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="font-display text-3xl tracking-wide text-bone">Every level welcome</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">
                    No experience needed. From complete beginners to competitors, every student trains towards
                    their own goals — fitness, confidence, self-defence or the ring.
                  </p>
                  <Link
                    href="#contact"
                    className="bg-strike-gradient mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-shadow duration-300 hover:shadow-[0_0_28px_-4px_rgba(224,33,125,0.65)]"
                  >
                    Start Training
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </motion.article>

              {/* SECOND CARD */}
              <motion.figure
                variants={fadeUp}
                custom={2}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -6 }}
                className="group relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-gold/15 bg-charcoal-2 transition-colors duration-500 hover:border-gold/40"
              >
                <Image
                  src="/about/kids-class.jpeg"
                  alt="Young students in uniform with their coach after a StrikeZone class."
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className={cn(photoGrade, "object-[50%_35%]")}
                />
                <div className={goldTint} />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Our Philosophy</p>
                  <h3 className="mt-3 font-display text-3xl leading-[0.95] tracking-wide text-bone md:text-4xl">
                    Train hard. Train smart. Train with respect.
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/70">
                    Technique before ego. Discipline before shortcuts. Consistency before instant results.
                  </p>
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
