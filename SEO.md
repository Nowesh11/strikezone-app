# SEO & Google Search Console

Everything on the code side is done. What's left is account work in Google's
consoles, which needs your Google login — follow this in order.

---

## 0. Register the domain

`strikezonemartialarts.com` is **not registered yet** — checked against the
`.com` registry, which returns NXDOMAIN (no nameservers, no records).

Nothing below works until you own it. Register it at any registrar
(Namecheap, Cloudflare, Porkbun, GoDaddy) — roughly RM45–70/year. Cloudflare
sells at cost and has no upsells; Namecheap is the easiest first-timer option.

The code is already set to this domain (`SITE_URL` in
[`src/lib/site.ts`](src/lib/site.ts)), so once you own it there is nothing to
change.

---

## 1. Deploy the site

Push to GitHub, then import the repo at <https://vercel.com/new>. Free tier is
fine for this site.

Then attach the domain: Vercel → Project → **Settings → Domains** → add
`strikezonemartialarts.com`. Vercel shows you the DNS records to create; add
them at your registrar.

**Pick one hostname and redirect the other.** Add both `strikezonemartialarts.com`
and `www.strikezonemartialarts.com`, then set the non-`www` one as primary so
`www` redirects to it. Two separately reachable hostnames means Google treats
you as two sites and splits your ranking signals between them.

**Verify before moving on** — both of these must load and show your real domain:

- `https://strikezonemartialarts.com/robots.txt`
- `https://strikezonemartialarts.com/sitemap.xml`

If they show a different domain, `SITE_URL` was overridden by a
`NEXT_PUBLIC_SITE_URL` environment variable in Vercel — remove it.

---

## 2. Add the property in Google Search Console

1. Go to <https://search.google.com/search-console> and sign in with
   `nowesh03@gmail.com` (or whichever account should own this long-term — it
   is awkward to move later).
2. **Add property** → choose **Domain** on the left, not "URL prefix". Domain
   covers `www`, non-`www`, http and https in a single property.
3. Enter `strikezonemartialarts.com` — no `https://`, no `www`.
4. Google gives you a **TXT record**. At your registrar's DNS panel add:
   Type `TXT`, Name/Host `@`, Value = the `google-site-verification=...`
   string exactly as shown.
5. Wait a few minutes, then click **Verify**. DNS can take up to an hour; if
   it fails, wait and press Verify again rather than starting over.

**If you can't reach the DNS panel**, use a **URL prefix** property instead,
choose the **HTML tag** method, copy *only* the token inside `content="..."`,
and add it in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=paste_the_token_here
```

Redeploy, then click Verify. The code already emits the tag when this is set.

---

## 3. Submit the sitemap

Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.

Status should move to "Success" within a day. If it says "Couldn't fetch",
the domain in `SITE_URL` doesn't match the property — go back to step 1.

## 4. Request indexing

Search Console → **URL Inspection** → paste your homepage URL → **Request
indexing**. This is the fastest route into the index for a brand-new site;
without it, first crawl can take weeks.

---

## 5. Google Business Profile — do not skip this

For "martial arts near me", "gym in Bukit Mertajam" and similar searches, the
map pack sits **above** the normal blue links. A website alone cannot appear
there. This is almost certainly worth more traffic than everything else here
combined.

1. <https://business.google.com> → create a profile for **StrikeZone Martial
   Arts Academy**.
2. Category: **Martial arts school**. Secondary: *Boxing gym*, *Gym*.
3. Address: Machang Bubok, Bukit Mertajam, Penang. Google mails a postcard with
   a PIN to verify — allow ~2 weeks.
4. Add the website URL, the `018-374 1721` phone number, opening hours and the
   class photos already in `public/`.
5. **Ask every current student for a Google review.** Review count and recency
   are among the strongest map-pack ranking factors. Twenty genuine reviews
   will move you further than any code change.

Keep the name, address and phone number **character-for-character identical**
across the website, Google Business Profile, Facebook and Instagram. Google
matches these as strings; a mismatch weakens the local signal.

---

## 6. Bing (2 minutes, free traffic)

<https://www.bing.com/webmasters> → Import from Google Search Console. One
click once step 2 is done. Also feeds ChatGPT search results.

---

## What's already handled in the code

| Item | Where |
|---|---|
| Title, description, keywords, canonical | `src/app/layout.tsx` |
| Open Graph + X/Twitter card tags | `src/app/layout.tsx` |
| Share image (1200×630, auto-generated) | `src/app/opengraph-image.tsx` |
| `robots.txt` | `src/app/robots.ts` |
| `sitemap.xml` (incl. image sitemap) | `src/app/sitemap.ts` |
| LocalBusiness / SportsClub JSON-LD — address, phone, hours, class schedule, disciplines, socials | `src/lib/structured-data.ts` |
| Crawlable address block + descriptive `<h1>` | `src/app/layout.tsx`, `src/components/ui/minimalist-hero.tsx` |
| `lang="en-MY"` + geo meta for Malaysian targeting | `src/app/layout.tsx` |
| Search-console verification hook | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |

Check the structured data renders correctly with Google's
[Rich Results Test](https://search.google.com/test/rich-results) once you're
live.

---

## Honest expectations

Nobody can guarantee a #1 Google ranking — Google's ranking is not something a
site owner controls, and any service promising position #1 is selling you
something. What the work above does is remove every technical reason Google
might *not* rank you, and describe the business in the exact machine-readable
form Google wants.

Realistic timeline for a new domain:

- **Days 1–3:** indexed, findable by searching your exact brand name.
- **Weeks 2–6:** ranking for long-tail local terms ("muay thai machang bubok").
- **Month 2+:** competitive for "martial arts bukit mertajam" — and here you
  will genuinely rank #1 for your brand name and very likely top-3 locally,
  because the competition in that specific area is thin.

The three things that decide it from here, in order of impact:

1. **Google Business Profile + reviews** (step 5).
2. **Inbound links** — get listed by Penang gym directories, local sports
   associations, the schools you run programmes with, and news coverage of any
   competition your fighters enter.
3. **More content** — each discipline deserves its own page
   (`/boxing-bukit-mertajam`, `/muay-thai-penang`, `/taekwondo-penang`) rather
   than a section on one page. One page can realistically rank for one topic;
   four pages can rank for four. This is the biggest remaining code-side win,
   and `sitemap.ts` is already set up to take new routes.
