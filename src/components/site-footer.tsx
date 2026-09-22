import { ArrowUp, ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { BrandLockup } from "@/components/brand-logo";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/social-icons";
import type { NavItem } from "@/components/site-navbar";
import { ACADEMY, SOCIALS, whatsappUrl } from "@/lib/site";

const classes = [
  { label: "Boxing", discipline: "boxing" },
  { label: "Muay Thai", discipline: "muay-thai" },
  { label: "Taekwondo", discipline: "taekwondo" },
  { label: "Martial Arts & Fitness", discipline: "fitness" },
];

const socials = [
  { label: "Instagram", href: SOCIALS.instagram, icon: InstagramIcon },
  { label: "Facebook", href: SOCIALS.facebook, icon: FacebookIcon },
  { label: "TikTok", href: SOCIALS.tiktok, icon: TikTokIcon },
  { label: "WhatsApp", href: whatsappUrl(), icon: WhatsAppIcon },
];

const heading = "text-[11px] font-semibold uppercase tracking-[0.3em] text-gold";
const link = "text-sm text-stone transition-colors duration-300 hover:text-bone";

export function SiteFooter({ navItems }: { navItems: NavItem[] }) {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-gold/10 bg-[#141414]" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(201,168,106,0.6),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,106,0.07)_0%,transparent_60%)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* CTA band */}
        <div className="flex flex-col items-start gap-8 border-b border-gold/10 py-16 md:flex-row md:items-end md:justify-between md:py-20">
          <div>
            <p className={heading}>Train with purpose</p>
            <p className="mt-5 max-w-2xl font-display text-5xl leading-[0.95] tracking-wide text-bone sm:text-6xl lg:text-7xl">
              Ready to step <span className="text-gold">onto the mats?</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="bg-strike-gradient group inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-shadow duration-300 hover:shadow-[0_0_36px_-6px_rgba(224,33,125,0.75)]"
            >
              Start Training
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={whatsappUrl("Hi StrikeZone! I'd like to know more about training.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <WhatsAppIcon className="size-4" />
              {ACADEMY.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr] lg:gap-10">
          {/* Brand */}
          <div>
            <a href="#home" aria-label="StrikeZone Martial Arts — back to top">
              <BrandLockup />
            </a>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone">
              Building fighters. Building character. A martial arts academy in Bukit Mertajam, Penang — founded 2023.
            </p>
            <ul className="mt-7 flex items-center gap-3" aria-label="Social media">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full border border-gold/20 text-stone transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-charcoal"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <p className={heading}>Explore</p>
            <ul className="mt-6 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Classes */}
          <div>
            <p className={heading}>Classes</p>
            <ul className="mt-6 space-y-3">
              {classes.map((c) => (
                <li key={c.label}>
                  <a href="#contact" data-discipline={c.discipline} className={link}>
                    {c.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#schedule" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-bone">
                  Weekly schedule <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Visit */}
          <div>
            <p className={heading}>Visit us</p>
            <ul className="mt-6 space-y-4">
              <li>
                <a href={ACADEMY.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span className="text-sm leading-relaxed text-stone transition-colors group-hover:text-bone">
                    {ACADEMY.address}
                  </span>
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="group flex gap-3">
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span className="text-sm text-stone transition-colors group-hover:text-bone">{ACADEMY.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${ACADEMY.email}`} className="group flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span className="text-sm break-all text-stone transition-colors group-hover:text-bone">{ACADEMY.email}</span>
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-sm text-stone">Classes from 6am onwards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-5 border-t border-gold/10 py-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-xs text-stone">© {year} StrikeZone Martial Arts. All rights reserved.</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold/80">
            Discipline • Development • Dedication
          </p>
          <a
            href="#home"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold"
          >
            Back to top
            <span className="flex size-8 items-center justify-center rounded-full border border-gold/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-gold">
              <ArrowUp className="size-3.5" />
            </span>
          </a>
        </div>
      </div>

      {/* Giant wordmark */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[3vw] bg-[linear-gradient(to_bottom,rgba(201,168,106,0.32)_0%,rgba(201,168,106,0.08)_60%,rgba(201,168,106,0)_100%)] bg-clip-text pt-4 text-center font-display text-[21vw] leading-[0.8] tracking-[0.02em] whitespace-nowrap text-transparent select-none"
      >
        STRIKEZONE
      </p>
    </footer>
  );
}
