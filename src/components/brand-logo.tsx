import Image from "next/image";
import { cn } from "@/lib/utils";

// Gold wordmark extracted from /public/logo strikezone.jpg onto a transparent background.
const LOGO = { src: "/brand/strikezone-logo.png", width: 1118, height: 187 };

/** StrikeZone Martial Arts Academy wordmark. Size it with a width class, e.g. `w-44`. */
export function BrandLockup({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src={LOGO.src}
      width={LOGO.width}
      height={LOGO.height}
      alt="StrikeZone Martial Arts Academy"
      preload={preload}
      sizes="(min-width: 768px) 200px, 160px"
      className={cn("h-auto w-40 md:w-48", className)}
    />
  );
}
