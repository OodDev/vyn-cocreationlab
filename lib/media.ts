/**
 * Map of pre-optimized image assets produced by `scripts/generate-assets.mjs`
 * (AVIF + WebP responsive sets, generated at build time because Next's image
 * optimizer is unavailable with static export). Widths/heights must mirror
 * the script's output exactly. */
export interface ResponsiveSource {
  srcSet: string;
  type: string;
}

export interface SmartImageAsset {
  sources: Array<ResponsiveSource>;
  fallback: { src: string; width: number; height: number };
}

/** Provided hero artwork: 4778×2688 master (main-bg_UPSCAL.png), re-encoded
 * to AVIF/WebP (ladder mirrors scripts/generate-assets.ts). */
const HERO_WIDTHS: Array<{ w: number; h: number }> = [
  { w: 640, h: 360 },
  { w: 960, h: 540 },
  { w: 1280, h: 720 },
  { w: 1600, h: 900 },
  { w: 1920, h: 1080 },
  { w: 3200, h: 1800 },
  { w: 4778, h: 2688 },
];

function buildSrcSet(extension: "avif" | "webp"): string {
  return HERO_WIDTHS.map(function (entry): string {
    return `/images/hero/bg-${entry.w}.${extension} ${entry.w}w`;
  }).join(", ");
}

export const heroImage: SmartImageAsset = {
  sources: [
    { srcSet: buildSrcSet("avif"), type: "image/avif" },
    { srcSet: buildSrcSet("webp"), type: "image/webp" },
  ],
  fallback: { src: "/images/hero/bg-1280.webp", width: 1280, height: 720 },
};

export const HERO_SIZES = "100vw";
