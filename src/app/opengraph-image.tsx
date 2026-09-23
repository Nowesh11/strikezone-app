import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { ACADEMY } from "@/lib/site";

// Rendered once at build time into a static PNG, so link previews on WhatsApp,
// Facebook, Instagram and X all show the brand instead of a blank card.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${ACADEMY.name} — ${ACADEMY.tagline}`;

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/strikezone-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(1000px 600px at 78% 12%, rgba(245,166,35,0.22), transparent 62%), linear-gradient(140deg, #1a1a1a 0%, #1a1a1a 45%, #2e2e2e 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={430} height={72} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#f5f0e8",
              lineHeight: 1.04,
            }}
          >
            Building Fighters.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#c9a86a",
              lineHeight: 1.04,
            }}
          >
            Building Character.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 33,
              color: "#9c9691",
            }}
          >
            Boxing · Muay Thai · Taekwondo — Bukit Mertajam, Penang
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 72, height: 5, background: "#f5a623" }} />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#c9a86a",
            }}
          >
            Discipline · Development · Dedication
          </div>
        </div>
      </div>
    ),
    size,
  );
}
