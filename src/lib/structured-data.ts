// schema.org JSON-LD for the site.
//
// This is what lets Google show StrikeZone as a *place* — address, phone, hours
// and disciplines — rather than as an anonymous page of text, and it is the
// single highest-leverage on-page signal for "martial arts near me" style
// local searches. Keep it truthful: Google penalises markup that describes
// things a visitor can't actually find on the page.

import { ACADEMY, SITE_URL, SOCIALS, absoluteUrl } from "@/lib/site";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Fixed group classes, mirrored from `ui/class-schedule.tsx`. */
const GROUP_CLASSES = [
  { name: "Muay Thai", days: ["Monday", "Thursday"], opens: "20:00", closes: "21:15" },
  { name: "Boxing", days: ["Wednesday"], opens: "20:30", closes: "21:45" },
  { name: "Boxing", days: ["Friday"], opens: "19:30", closes: "20:45" },
  { name: "Taekwondo", days: ["Thursday"], opens: "18:30", closes: "19:45" },
  { name: "Taekwondo", days: ["Friday"], opens: "17:00", closes: "18:15" },
  { name: "Taekwondo", days: ["Saturday"], opens: "09:30", closes: "10:45" },
];

const address = {
  "@type": "PostalAddress",
  streetAddress: ACADEMY.postal.streetAddress,
  addressLocality: ACADEMY.postal.addressLocality,
  addressRegion: ACADEMY.postal.addressRegion,
  postalCode: ACADEMY.postal.postalCode,
  addressCountry: ACADEMY.postal.addressCountry,
};

const sameAs = [SOCIALS.instagram, SOCIALS.facebook, SOCIALS.tiktok];

/**
 * One `@graph` covering the business, the site and the page. A single
 * connected graph is easier for crawlers to reconcile than several loose
 * blocks describing the same entity.
 */
export function siteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["SportsActivityLocation", "SportsClub", "LocalBusiness"],
        "@id": ORGANIZATION_ID,
        name: ACADEMY.name,
        legalName: ACADEMY.legalName,
        alternateName: "StrikeZone Martial Arts Academy Penang",
        slogan: ACADEMY.tagline,
        description:
          "Boxing, Muay Thai and Taekwondo academy in Machang Bubok, Bukit Mertajam, Penang. Group classes, 1-to-1 coaching and private group sessions for all levels, from complete beginners to competitors.",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: absoluteUrl("/brand/strikezone-logo.png"),
          caption: ACADEMY.name,
          width: 1118,
          height: 187,
        },
        image: [absoluteUrl("/opengraph-image"), absoluteUrl("/brand/strikezone-logo.png")],
        telephone: ACADEMY.phoneE164,
        email: ACADEMY.email,
        foundingDate: ACADEMY.foundingYear,
        priceRange: ACADEMY.priceRange,
        currenciesAccepted: "MYR",
        address,
        hasMap: ACADEMY.mapsUrl,
        areaServed: [
          { "@type": "City", name: "Bukit Mertajam" },
          { "@type": "City", name: "Simpang Ampat" },
          { "@type": "City", name: "Butterworth" },
          { "@type": "AdministrativeArea", name: "Seberang Perai" },
          { "@type": "AdministrativeArea", name: "Penang" },
        ],
        sameAs,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "22:00",
          },
        ],
        sport: ACADEMY.disciplines,
        knowsAbout: [
          "Boxing",
          "Muay Thai",
          "Taekwondo",
          "Self defence",
          "Martial arts for kids",
          "Fitness training",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Training programmes",
          itemListElement: ACADEMY.disciplines.map((discipline) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: `${discipline} classes in Bukit Mertajam`,
              serviceType: discipline,
              provider: { "@id": ORGANIZATION_ID },
              areaServed: { "@type": "AdministrativeArea", name: "Penang" },
              availableChannel: {
                "@type": "ServiceChannel",
                name: "Group, 1-to-1 and private group sessions",
                serviceUrl: absoluteUrl("/#contact"),
              },
            },
          })),
        },
        subjectOf: GROUP_CLASSES.map((c) => ({
          "@type": "Event",
          "@id": `${SITE_URL}/#class-${c.name.toLowerCase().replace(/\s+/g, "-")}-${c.days[0].toLowerCase()}-${c.opens.replace(":", "")}`,
          name: `${c.name} group class`,
          eventSchedule: {
            "@type": "Schedule",
            byDay: c.days,
            startTime: c.opens,
            endTime: c.closes,
            repeatFrequency: "P1W",
            scheduleTimezone: "Asia/Kuala_Lumpur",
          },
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@id": ORGANIZATION_ID },
          organizer: { "@id": ORGANIZATION_ID },
          url: absoluteUrl("/#schedule"),
        })),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: ACADEMY.name,
        description: `${ACADEMY.name} — ${ACADEMY.tagline}`,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-MY",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${ACADEMY.name} — Boxing, Muay Thai & Taekwondo in Bukit Mertajam, Penang`,
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": ORGANIZATION_ID },
        primaryImageOfPage: { "@id": `${SITE_URL}/#logo` },
        inLanguage: "en-MY",
      },
    ],
  };
}
