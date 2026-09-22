"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck, Clock, HandFist, Plus, Zap, type LucideIcon } from "lucide-react";
import { BeltIcon } from "@/components/icons";
import { WhatsAppIcon } from "@/components/social-icons";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------- Data ---------------------------------- */

type ClassKind = "boxing" | "muay-thai" | "taekwondo";

interface FixedClass {
  kind: ClassKind;
  start: string;
  end: string;
  /** Minutes from midnight, for ordering. */
  at: number;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
type Day = (typeof DAYS)[number];

const t = (h: number, m = 0) => h * 60 + m;

const SCHEDULE: Record<Day, FixedClass[]> = {
  Monday: [{ kind: "muay-thai", start: "8:00pm", end: "9:15pm", at: t(20) }],
  Tuesday: [],
  Wednesday: [{ kind: "boxing", start: "8:30pm", end: "9:45pm", at: t(20, 30) }],
  Thursday: [
    { kind: "taekwondo", start: "6:30pm", end: "7:45pm", at: t(18, 30) },
    { kind: "muay-thai", start: "8:00pm", end: "9:15pm", at: t(20) },
  ],
  Friday: [
    { kind: "taekwondo", start: "5:00pm", end: "6:15pm", at: t(17) },
    { kind: "boxing", start: "7:30pm", end: "8:45pm", at: t(19, 30) },
  ],
  Saturday: [{ kind: "taekwondo", start: "9:30am", end: "10:45am", at: t(9, 30) }],
  Sunday: [],
};

const KIND: Record<ClassKind, { label: string; icon: LucideIcon | typeof BeltIcon }> = {
  boxing: { label: "Boxing", icon: HandFist },
  "muay-thai": { label: "Muay Thai", icon: Zap },
  taekwondo: { label: "Taekwondo", icon: BeltIcon },
};

/** Open windows are shown by part of day — only the 6am start is a fixed time. */
const PERIODS = [
  { name: "Morning", hint: "6:00am onwards", at: t(6) },
  { name: "Afternoon", hint: "Midday sessions", at: t(12) },
  { name: "Evening", hint: "Flexible times", at: t(17) - 1 },
] as const;

type Slot =
  | ({ type: "class" } & FixedClass)
  | { type: "open"; period: (typeof PERIODS)[number]["name"]; hint: string; at: number };

function slotsFor(day: Day): Slot[] {
  const open: Slot[] = PERIODS.map((p) => ({ type: "open", period: p.name, hint: p.hint, at: p.at }));
  const classes: Slot[] = SCHEDULE[day].map((c) => ({ type: "class", ...c }));
  return [...open, ...classes].sort((a, b) => a.at - b.at);
}

const FORMATS = ["Group", "1-to-1", "Private group"];

/* ---------------------------------- Cards --------------------------------- */

function ClassCard({ day, slot, compact }: { day: Day; slot: Extract<Slot, { type: "class" }>; compact?: boolean }) {
  const { label, icon: Icon } = KIND[slot.kind];
  return (
    <a
      href="#contact"
      data-discipline={slot.kind}
      data-format="Group class"
      data-slot={`${day} · ${label} · ${slot.start}–${slot.end}`}
      aria-label={`${label}, ${day} ${slot.start} to ${slot.end}. Book this class`}
      className="group block rounded-xl bg-[linear-gradient(135deg,#e0217d,#f5a623)] p-px transition-shadow duration-300 outline-none hover:shadow-[0_0_28px_-6px_rgba(224,33,125,0.65)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
    >
      <span className={cn("flex h-full gap-3 rounded-[11px] bg-charcoal-2", compact ? "flex-col p-3" : "items-center p-4")}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,rgba(224,33,125,0.18),rgba(245,166,35,0.18))] text-flare">
          <Icon className="size-[18px]" strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl leading-none tracking-wide text-bone">{label}</span>
          <span className="mt-1.5 block text-xs font-semibold text-bone/90 tabular-nums">
            {slot.start} – {slot.end}
          </span>
          <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Group class</span>
        </span>
      </span>
    </a>
  );
}

function OpenCard({ day, slot, compact }: { day: Day; slot: Extract<Slot, { type: "open" }>; compact?: boolean }) {
  return (
    <a
      href="#contact"
      data-slot={`${day} · ${slot.period} open slot (Group / 1-to-1 / Private group)`}
      aria-label={`Open slot, ${day} ${slot.period.toLowerCase()}. Book this slot`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-dashed border-gold/25 transition-colors duration-300 outline-none hover:border-gold hover:bg-gold/5 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/50",
        compact ? "p-3" : "p-4"
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone">Open</span>
        <Plus aria-hidden className="size-3.5 text-stone transition-all duration-300 group-hover:rotate-90 group-hover:text-gold group-focus-visible:text-gold" />
      </span>
      <span className="mt-1.5 block font-display text-lg leading-none tracking-wide text-bone/85">{slot.period}</span>
      <span className="relative mt-1.5 block h-4 text-[11px] leading-4">
        <span className="absolute inset-0 text-stone transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-0 group-focus-visible:-translate-y-2 group-focus-visible:opacity-0">
          {slot.hint}
        </span>
        <span className="absolute inset-0 flex translate-y-2 items-center gap-1 font-semibold text-gold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          Book this slot <ArrowUpRight className="size-3" />
        </span>
      </span>
    </a>
  );
}

function SlotCard({ day, slot, compact }: { day: Day; slot: Slot; compact?: boolean }) {
  return slot.type === "class" ? <ClassCard day={day} slot={slot} compact={compact} /> : <OpenCard day={day} slot={slot} compact={compact} />;
}

/* --------------------------------- Section -------------------------------- */

const noopSubscribe = () => () => {};

function getToday(): Day | null {
  const name = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Asia/Kuala_Lumpur" }).format(new Date());
  return (DAYS as readonly string[]).includes(name) ? (name as Day) : null;
}

export function ClassSchedule() {
  // Today in Malaysia time — null during SSR so server and client HTML match
  const today = useSyncExternalStore(noopSubscribe, getToday, () => null);
  const [picked, setPicked] = useState<Day | null>(null);
  const selected: Day = picked ?? today ?? "Monday";
  const setSelected = (d: Day) => setPicked(d);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Keep the selected day tab visible in the scrollable strip (scrolls the strip only, never the page)
  useEffect(() => {
    const strip = tabsRef.current;
    const btn = strip?.querySelector<HTMLButtonElement>(`[data-day="${selected}"]`);
    if (!strip || !btn) return;
    const left = btn.offsetLeft - strip.offsetLeft;
    const target = Math.max(0, left - (strip.clientWidth - btn.offsetWidth) / 2);
    strip.scrollTo({ left: target, behavior: "smooth" });
  }, [selected]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = DAYS[(DAYS.indexOf(selected) + step + DAYS.length) % DAYS.length];
    setSelected(next);
    e.currentTarget.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus();
  };

  const totalClasses = DAYS.reduce((n, d) => n + SCHEDULE[d].length, 0);

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className="relative overflow-hidden border-t border-gold/10 bg-background py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,33,125,0.05)_0%,transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="text-stone">08</span>
              <span className="h-px w-8 bg-gold" />
              Class Schedule
            </p>
            <h2
              id="schedule-heading"
              className="mt-8 font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl"
            >
              Your week <span className="text-gold">on the mats.</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-stone">
            {totalClasses} scheduled classes every week — and every other slot is open to book as a group, 1-to-1 or
            private group session.
          </p>
        </div>

        {/* Note bar + legend */}
        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-gold/15 bg-charcoal-2/60 p-4 md:mt-16 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <p className="flex items-center gap-3 text-sm font-medium text-bone">
            <span className="flex size-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Clock className="size-4" />
            </span>
            All classes start from <span className="font-semibold text-gold">6am onwards</span>
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-stone" aria-label="Legend">
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-3.5 rounded bg-[linear-gradient(135deg,#e0217d,#f5a623)]" />
              Scheduled class
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-3.5 rounded border border-dashed border-gold/60" />
              Open slot
            </li>
            <li className="flex flex-wrap items-center gap-2">
              <span className="text-stone">Book open slots as</span>
              {FORMATS.map((f) => (
                <span key={f} className="rounded-full border border-gold/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-bone">
                  {f}
                </span>
              ))}
            </li>
          </ul>
        </div>

        {/* Mobile / tablet: day tabs */}
        <div className="mt-8 lg:hidden">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Day of the week"
            onKeyDown={onTabKey}
            className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-12 md:px-12 [&::-webkit-scrollbar]:hidden"
          >
            {DAYS.map((d) => {
              const isSel = d === selected;
              const count = SCHEDULE[d].length;
              return (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  data-day={d}
                  id={`day-tab-${d}`}
                  aria-selected={isSel}
                  aria-controls="day-panel"
                  tabIndex={isSel ? 0 : -1}
                  onClick={() => setSelected(d)}
                  className={cn(
                    "relative flex min-w-[64px] shrink-0 snap-start flex-col items-center rounded-xl border px-3 py-2.5 transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
                    isSel ? "border-gold bg-gold text-charcoal" : "border-gold/15 bg-charcoal-2/50 text-bone"
                  )}
                >
                  <span className="font-display text-xl leading-none tracking-wide">{d.slice(0, 3)}</span>
                  <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]", isSel ? "text-charcoal/80" : "text-stone")}>
                    {count ? `${count} class${count > 1 ? "es" : ""}` : "Open"}
                  </span>
                  {today === d && (
                    <span aria-label="Today" className={cn("absolute top-1.5 right-1.5 size-1.5 rounded-full", isSel ? "bg-charcoal" : "bg-flare")} />
                  )}
                </button>
              );
            })}
          </div>

          <div id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${selected}`} className="mt-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={selected}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-3"
              >
                {slotsFor(selected).map((slot) => (
                  <li key={`${slot.type}-${slot.at}`}>
                    <SlotCard day={selected} slot={slot} />
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop: 7-column week (scrolls sideways rather than squashing if ever too narrow) */}
        <div className="mt-8 hidden overflow-x-auto pb-2 lg:block">
          <div className="grid min-w-[900px] grid-cols-7 gap-3">
            {DAYS.map((d) => {
              const isToday = today === d;
              return (
                <div
                  key={d}
                  className={cn(
                    "flex flex-col rounded-2xl border p-2.5 transition-colors",
                    isToday ? "border-gold/50 bg-charcoal-2/70" : "border-gold/10 bg-charcoal-2/25"
                  )}
                >
                  <div className="flex items-baseline justify-between px-1.5 pt-1.5 pb-3">
                    <h3 className="font-display text-2xl tracking-wide text-bone">{d.slice(0, 3)}</h3>
                    {isToday ? (
                      <span className="rounded-full bg-flare px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-charcoal">Today</span>
                    ) : (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone">
                        {SCHEDULE[d].length ? `${SCHEDULE[d].length} class${SCHEDULE[d].length > 1 ? "es" : ""}` : "Open"}
                      </span>
                    )}
                  </div>
                  <ul className="flex flex-1 flex-col gap-2.5" aria-label={d}>
                    {slotsFor(d).map((slot) => (
                      <li key={`${slot.type}-${slot.at}`}>
                        <SlotCard day={d} slot={slot} compact />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row md:mt-16">
          <a
            href="#contact"
            className="bg-strike-gradient group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-shadow duration-300 hover:shadow-[0_0_36px_-6px_rgba(224,33,125,0.75)]"
          >
            <CalendarCheck className="size-4" />
            Book Your Class
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={whatsappUrl("Hi StrikeZone! I'd like to ask about the class schedule.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b border-gold/40 pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold"
          >
            <WhatsAppIcon className="size-4" />
            Ask about a time
          </a>
        </div>
      </div>
    </section>
  );
}
