import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // The site is a single page; the in-page sections are fragments of it, and
  // Google ignores `#fragment` URLs in a sitemap, so listing them would only
  // add noise. One entry is the correct sitemap for this site today — add rows
  // here as real routes (e.g. /blog/...) are introduced.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        absoluteUrl("/brand/strikezone-logo.png"),
        absoluteUrl("/hero-strike-cutout.png"),
        absoluteUrl("/journey/training-centre.jpg"),
      ],
    },
  ];
}
