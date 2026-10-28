import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

/**
 * Central metadata builder. Every page passes a title and a <160-char
 * description through here so titles, canonical URLs, Open Graph and Twitter
 * cards stay consistent site-wide.
 *
 * Per-page OG images are provided by route-level `opengraph-image.tsx`
 * files (generated at build time), which is why this helper does not set
 * image URLs itself.
 */
export interface MetadataInput {
  /** Page-specific title (recommended < 55–60 chars). */
  title?: string;
  /** Page-specific meta description (recommended < 160 chars). */
  description?: string;
  /** Route path starting with "/" (canonical + OG url is derived from it). */
  path?: string;
}

export const siteName: string = site.name;
export const defaultTitle: string = "VYN – CoCreation Lab — Web Developing Portfolio";
export const defaultDescription: string =
  "VYN – CoCreation Lab is a web developing studio building fast, accessible, search-ready websites across AI-assisted, CMS and hand-coded projects. View the work and get in touch.";

export function buildMetadata(input: MetadataInput = {}): Metadata {
  const title: string = input.title === undefined ? defaultTitle : `${input.title}`;
  const description: string = input.description ?? defaultDescription;
  const path: string = normalizePath(input.path ?? "/");
  const url: string = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

/** Adds an absolute base so relative OG/canonical links always resolve. */
export function metadataBase(): URL {
  return new URL(SITE_URL);
}

function normalizePath(path: string): string {
  const trimmed: string = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : `${trimmed}/`;
}
