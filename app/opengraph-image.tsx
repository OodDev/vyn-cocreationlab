import { renderOgImage } from "@/lib/og";
import type { ImageResponse } from "next/og";

/**
 * Build-time OG image for every route without a dedicated one.
 * out/opengraph-image.png is emitted during static export.
 */
export const alt = "VYN – CoCreation Lab — Web Developing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage(): ImageResponse {
  return renderOgImage({
    kicker: "Web Developing",
    title: "VYN – CoCreation Lab",
    subtitle: "Fast, accessible, search-ready websites — AI-assisted, CMS and hand-coded.",
  });
}
