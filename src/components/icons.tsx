import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { strokeWidth?: number | string };

/** Tied martial-arts belt with a knot and two hanging tails — used for Taekwondo (lucide has no belt icon). */
export function BeltIcon({ strokeWidth = 1.8, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Belt band */}
      <path d="M2 7.5h7.5M14.5 7.5H22M2 11.5h7.5M14.5 11.5H22" />
      {/* Knot */}
      <rect x="9.5" y="6" width="5" height="7" rx="1.2" />
      {/* Tails */}
      <path d="M10.5 13 7.5 21" />
      <path d="M13.5 13l3 8" />
    </svg>
  );
}
