import type { NextConfig } from "next";

/**
 * Static export configuration.
 *
 * - `output: "export"` writes a fully static site to `out/` (deployable to
 *   Vercel / Netlify / Cloudflare Pages / any static host).
 * - `trailingSlash: true` makes `/about/` the canonical form of `/about`,
 *   which matches how static file hosts serve `index.html` files.
 * - Next's on-demand image optimizer is unavailable in static exports, so
 *   images are pre-optimized at build time by `scripts/generate-assets.mjs`
 *   and rendered with a bespoke `<SmartImage>` component.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Hides the Next.js dev-tools bubble (bottom-left) — it's a dev-server
  // overlay only, and it would otherwise leak into recorded promo videos.
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
