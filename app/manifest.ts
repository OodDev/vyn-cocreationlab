import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * Build-time web manifest (out/manifest.webmanifest), reusing the generated
 * favicon set from scripts/generate-assets.mjs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VYN – CoCreation Lab",
    short_name: "VYN",
    description:
      "Web developing portfolio of VYN – CoCreation Lab: AI-assisted, CMS and hand-coded projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#050d10",
    theme_color: "#050d10",
    lang: "en",
    icons: [
      {
        src: "/favicon/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
