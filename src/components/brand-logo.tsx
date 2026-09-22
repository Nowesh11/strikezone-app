import Image from "next/image";
import { cn } from "@/lib/utils";

// Drop the round logo into /public (e.g. /public/logo.png) and set its path here.
const LOGO_SRC: string | null = null;

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/60 bg-charcoal-2",
        className
      )}
    >
      {LOGO_SRC ? (
        <Image src={LOGO_SRC} alt="StrikeZone Martial Arts logo" fill sizes="44px" className="object-cover" />
      ) : (
        <span className="font-display text-lg leading-none tracking-wider text-gold">SZ</span>
      )}
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <BrandLogo />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl tracking-[0.12em] text-bone">StrikeZone</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
          Martial Arts
        </span>
      </span>
    </span>
  );
}
