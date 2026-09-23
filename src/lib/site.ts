// Site-wide identity, contact details and SEO constants.

/**
 * Canonical origin of the live site — no trailing slash.
 *
 * Everything SEO-related (canonical tags, Open Graph URLs, sitemap.xml,
 * robots.txt and the JSON-LD business listing) is derived from this one value,
 * and Google Search Console will not verify a property whose URLs don't match.
 *
 * Override per-environment with NEXT_PUBLIC_SITE_URL — e.g. point preview
 * deployments at their own hostname so they never emit production canonicals.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://strikezonemartialarts.com"
).replace(/\/$/, "");

/**
 * The `content` value from the Google Search Console "HTML tag" verification
 * method — the bare token, not the whole <meta> element. Set
 * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to emit it; leaving it unset simply
 * omits the tag.
 */
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

/** Academy WhatsApp number in international format, digits only (018-374 1721 → 60183741721). */
export const WHATSAPP_NUMBER = "60183741721";

export const ACADEMY = {
  name: "StrikeZone Martial Arts",
  legalName: "StrikeZone Martial Arts Academy",
  tagline: "Building Fighters. Building Character.",
  foundingYear: "2023",
  address: "Machang Bubok, Bukit Mertajam, Penang, Malaysia",
  /** Broken out for schema.org PostalAddress. */
  postal: {
    streetAddress: "Machang Bubok",
    addressLocality: "Bukit Mertajam",
    addressRegion: "Penang",
    postalCode: "14020",
    addressCountry: "MY",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Machang+Bubok%2C+Bukit+Mertajam%2C+Penang",
  phoneDisplay: "018-374 1721",
  /** E.164, for tel: links and schema.org telephone. */
  phoneE164: "+60183741721",
  email: "s.zonemartialartsacademy@gmail.com",
  disciplines: ["Boxing", "Muay Thai", "Taekwondo"],
  priceRange: "$$",
};

export const SOCIALS = {
  instagram: "https://www.instagram.com/strikezonemartialarts",
  facebook: "https://www.facebook.com/share/19UHr3jVN2/",
  tiktok: "https://www.tiktok.com/@strikezone_martialarts",
};

export function whatsappUrl(text?: string) {
  const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Absolute URL for a site-relative path — required by Open Graph and JSON-LD. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
