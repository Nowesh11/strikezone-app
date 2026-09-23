import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";
import { ACADEMY, GOOGLE_SITE_VERIFICATION, SITE_URL, SOCIALS } from "@/lib/site";
import { siteStructuredData } from "@/lib/structured-data";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const TITLE = "StrikeZone Martial Arts — Boxing, Muay Thai & Taekwondo in Bukit Mertajam, Penang";

const DESCRIPTION =
  "Boxing, Muay Thai and Taekwondo classes in Machang Bubok, Bukit Mertajam, Penang. Group, 1-to-1 and private sessions for kids, teens and adults — beginners welcome. Book a free trial on WhatsApp.";

export const metadata: Metadata = {
  // Resolves every relative URL below (and the file-convention OG images)
  // against the live origin. Without it, Open Graph tags ship as relative
  // paths and social crawlers drop the preview.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${ACADEMY.name}`,
  },
  description: DESCRIPTION,
  applicationName: ACADEMY.name,
  // Not a ranking factor at Google, but still read by Bing and by several
  // social and AI crawlers, and it costs nothing.
  keywords: [
    "martial arts Bukit Mertajam",
    "martial arts Penang",
    "boxing class Bukit Mertajam",
    "Muay Thai Penang",
    "Muay Thai Bukit Mertajam",
    "Taekwondo Penang",
    "Taekwondo class Bukit Mertajam",
    "Machang Bubok gym",
    "self defence classes Penang",
    "kids martial arts Penang",
    "kickboxing Seberang Perai",
    "StrikeZone Martial Arts",
  ],
  authors: [{ name: ACADEMY.name, url: SITE_URL }],
  creator: ACADEMY.name,
  publisher: ACADEMY.name,
  category: "Sports & Fitness",
  alternates: {
    // A single self-referencing canonical keeps www/non-www, http/https and
    // any tracking-parameter variants consolidated onto one indexed URL.
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: SITE_URL,
    siteName: ACADEMY.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Allow full-size image previews and untruncated text snippets, so the
      // listing can win a richer result.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Only emitted once NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is set.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  other: {
    // Geo hints, used by some local directories and crawlers.
    "geo.region": "MY-07",
    "geo.placename": "Bukit Mertajam, Penang",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      // en-MY tells Google the page targets Malaysian English readers.
      lang="en-MY"
      className={`${bebas.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // Static, build-time JSON from our own module — no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData()) }}
        />
        {children}
        {/* Crawler-visible plain-text summary of the business. The visual
            sections are animation-heavy client components; this guarantees the
            core facts are in the initial HTML regardless. */}
        <address className="sr-only not-italic">
          <span>{ACADEMY.legalName}</span>
          <span>{ACADEMY.address}</span>
          <a href={`tel:${ACADEMY.phoneE164}`}>{ACADEMY.phoneDisplay}</a>
          <a href={`mailto:${ACADEMY.email}`}>{ACADEMY.email}</a>
          <a href={SOCIALS.instagram}>Instagram</a>
          <a href={SOCIALS.facebook}>Facebook</a>
          <a href={SOCIALS.tiktok}>TikTok</a>
        </address>
      </body>
    </html>
  );
}
