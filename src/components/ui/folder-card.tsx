"use client";

import * as React from "react";
import Image from "next/image";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  FolderCard                                                                 */
/*                                                                             */
/*  A folder-shaped media card: a cover sits behind a dark folder panel that    */
/*  is notched over it, with the title and subtitle riding in the tab and a     */
/*  stat line along the bottom.                                                 */
/*                                                                             */
/*  On hover the panel slides down to reveal more of the cover, the cover       */
/*  drifts in, and the whole card lifts — one spring, driven by variants on     */
/*  the root, so the parts stay in sync.                                        */
/*                                                                             */
/*  Every dimension is in container query units (cqw), so the card is           */
/*  pixel-exact at any width. Colours follow the StrikeZone charcoal/gold       */
/*  palette via CSS variables that can be overridden from className/style.     */
/* -------------------------------------------------------------------------- */

export interface FolderCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
> {
  /** Headline shown inside the folder tab. */
  title?: string;
  /** Supporting line under the title. */
  subtitle?: string;
  /** Optional short statement shown in the folder body. */
  description?: string;
  /** Large figure in the footer, e.g. "24". */
  count?: React.ReactNode;
  /** Word next to the figure, e.g. "Files". */
  countLabel?: string;
  /** Right-aligned footer text, e.g. "312 Assets". */
  meta?: string;
  /** Cover image URL. Falls back to a gold/charcoal aurora gradient when omitted. */
  cover?: string;
  /** Alt text for the cover image. */
  coverAlt?: string;
  /** CSS object-position for the cover, e.g. "50% 60%". */
  coverPosition?: string;
  /** Hover motion. Default: true. */
  interactive?: boolean;
}

/**
 * The folder silhouette. The viewBox matches the inner (inside-bezel) box
 * exactly, so `preserveAspectRatio="none"` scales it without distorting radii.
 * The path runs past the edges so the panel always overhangs the cover and
 * still fills the card while it slides down on hover.
 */
const FOLDER_PATH =
  "M-2,151 a16,16 0 0 1 16,-16 h247 " +
  "c26.6,0 59.3,59 76,59 " +
  "h149 a32,32 0 0 1 32,32 v368 " +
  "a32,32 0 0 1 -32,32 h-456 a32,32 0 0 1 -32,-32 Z";

/** Brand aurora — a warm gold bloom rising out of charcoal. */
const AURORA_GRADIENT = [
  "radial-gradient(58% 76% at 76% 114%, rgba(245,240,232,.55) 0%, rgba(201,168,106,.45) 34%, rgba(0,0,0,0) 72%)",
  "radial-gradient(105% 95% at 28% 136%, rgba(245,166,35,.55) 0%, rgba(201,168,106,.3) 46%, rgba(0,0,0,0) 80%)",
  "linear-gradient(172deg, #141414 0%, #1f1b14 40%, #3b301d 74%, #6b5530 100%)",
].join(",");

/** Brand tokens, overridable from `className` or `style`. */
const TOKENS = [
  "[--folder-card-bezel:#111111]",
  "[--folder-card-surface:#1a1a1a]",
  "[--folder-card-panel-from:#2e2e2e]",
  "[--folder-card-panel-to:#1c1c1c]",
  "[--folder-card-title:#f5f0e8]",
  "[--folder-card-subtitle:#9c9691]",
  "[--folder-card-accent:#c9a86a]",
].join(" ");

const SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
} as const;

const cardVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -8 },
  tap: { y: -4, scale: 0.99 },
};

/** The folder front — panel plus the copy riding in its tab. */
const panelVariants: Variants = {
  rest: { y: "0%" },
  hover: { y: "8%" },
};

const coverVariants: Variants = {
  rest: { scale: 1, filter: "saturate(0.7) brightness(0.82)" },
  hover: { scale: 1.07, filter: "saturate(1) brightness(0.95)" },
};

export const FolderCard = React.forwardRef<HTMLDivElement, FolderCardProps>(
  function FolderCard(
    {
      title = "Our Mission",
      subtitle = "Why we train",
      description,
      count = "7",
      countLabel = "Commitments",
      meta = "Est. 2023",
      cover,
      coverAlt = "",
      coverPosition = "50% 50%",
      interactive = true,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const gradientId = React.useId();
    // Reduced-motion is honoured by MotionConfig below rather than useReducedMotion(),
    // which differs between server and client and causes a hydration mismatch.
    const animate = interactive;

    return (
      <MotionConfig reducedMotion="user">
        <motion.div
          ref={ref}
          initial="rest"
          animate="rest"
          whileHover={animate ? "hover" : undefined}
          whileTap={animate ? "tap" : undefined}
          transition={SPRING}
          variants={animate ? cardVariants : undefined}
          style={style}
          className={cn(
            "group/folder w-[360px] max-w-full font-sans select-none [container-type:inline-size]",
            TOKENS,
            className,
          )}
          {...props}
        >
          {/* bezel */}
          <div className="relative box-border aspect-[544/522] w-full rounded-[8.46cqw] bg-[var(--folder-card-bezel)] p-[2.57cqw] shadow-[0_4cqw_10cqw_-4cqw_rgb(0_0_0/.8)] ring-1 ring-[color-mix(in_srgb,var(--folder-card-accent)_18%,transparent)] transition-shadow duration-500 group-hover/folder:shadow-[0_6cqw_14cqw_-4cqw_rgb(0_0_0/.85),0_0_10cqw_-6cqw_rgb(201_168_106/.45)]">
            <div className="relative h-full w-full overflow-hidden rounded-[5.88cqw] bg-[var(--folder-card-surface)]">
              {/*
                The card's edge lands on a fractional device pixel, so anything
                clipped there paints at partial alpha. The cover is held 1px in
                and the folder runs 1px proud, which leaves that column filled
                with surface/panel colour instead of a hairline of cover.
              */}
              <div className="absolute left-px right-px top-0 h-[54%] overflow-hidden">
                <motion.div
                  variants={animate ? coverVariants : undefined}
                  transition={SPRING}
                  className="relative h-full w-full origin-bottom"
                >
                  {cover ? (
                    <>
                      <Image
                        src={cover}
                        alt={coverAlt}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 480px, 90vw"
                        style={{ objectPosition: coverPosition }}
                        className="object-cover"
                      />
                      {/* warm the cover into the brand palette */}
                      <div aria-hidden className="absolute inset-0 bg-[var(--folder-card-accent)]/20 mix-blend-multiply" />
                    </>
                  ) : (
                    <div
                      aria-hidden
                      style={{ background: AURORA_GRADIENT }}
                      className="h-full w-full"
                    />
                  )}
                </motion.div>
              </div>

              {/* folder front: panel + tab copy, moving as one */}
              <div className="absolute -left-px -right-px inset-y-0 overflow-hidden">
                <motion.div
                  variants={animate ? panelVariants : undefined}
                  transition={SPRING}
                  className="absolute inset-0"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 516 494"
                    preserveAspectRatio="none"
                    className="absolute inset-0 block h-full w-full"
                  >
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="var(--folder-card-panel-from)" />
                        <stop offset="1" stopColor="var(--folder-card-panel-to)" />
                      </linearGradient>
                    </defs>
                    {/* stroked as well as filled so no seam shows at the edges */}
                    <path
                      d={FOLDER_PATH}
                      fill={"url(#" + gradientId + ")"}
                      stroke={"url(#" + gradientId + ")"}
                      strokeWidth="2"
                    />
                  </svg>

                  <div className="absolute left-[4.78cqw] top-[29cqw] leading-none">
                    <h3 className="m-0 font-display text-[7.4cqw] tracking-[0.06em] text-[var(--folder-card-title)]">
                      {title}
                    </h3>
                    <p className="mt-[1.6cqw] text-[3.3cqw] font-semibold uppercase tracking-[0.22em] text-[var(--folder-card-accent)]">
                      {subtitle}
                    </p>
                    {description && (
                      <p className="mt-[5cqw] max-w-[82cqw] text-[4.1cqw] leading-[1.45] text-[var(--folder-card-title)]/85">
                        {description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* footer stays put while the folder front slides */}
              <div className="absolute inset-x-[4.78cqw] bottom-[4.3cqw] flex items-baseline justify-between leading-none text-[var(--folder-card-title)]">
                <p className="m-0">
                  <span className="font-display text-[13cqw] tracking-[0.02em] text-[var(--folder-card-accent)]">
                    {count}
                  </span>
                  <span className="ml-[1.8cqw] text-[3.3cqw] font-semibold uppercase tracking-[0.18em] text-[var(--folder-card-subtitle)]">
                    {countLabel}
                  </span>
                </p>
                <p className="m-0 text-[3.3cqw] font-semibold uppercase tracking-[0.18em] text-[var(--folder-card-title)]/80">
                  {meta}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </MotionConfig>
    );
  },
);

export default FolderCard;

export { FolderCard as Component };
