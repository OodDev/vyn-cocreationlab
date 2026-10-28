import { z } from "zod";

/**
 * Site-wide entity data — the single place to change identity.
 *
 * PLACEHOLDERS you should replace (marked inline, also listed in README):
 * - `siteUrl`   — real production domain (used for canonical URLs, sitemap,
 *                 JSON-LD @ids, llms.txt and the .md alternates).
 * - `email`     — real contact address (mailto links + JSON-LD).
 * - `location`  — optional; shown in llms.txt only, not faked in Schema.org.
 */

// PLACEHOLDER: replace with your production domain.
const siteUrl = "https://vyn-cocreation.com";
// PLACEHOLDER: replace with your real contact email.
const email = "hello@vyn.example";
// PLACEHOLDER: replace with your city/country, or leave empty to hide it.
const location = "Your City, Country";

const contactSchema = z.object({
  email: z.string().email(),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
});

const siteSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
  siteUrl: z.string().url(),
  email: contactSchema.shape.email,
  githubUrl: contactSchema.shape.githubUrl,
  linkedinUrl: contactSchema.shape.linkedinUrl,
  location: z.string(),
  expertise: z.array(z.string()).min(1),
  lastUpdated: z.string().date(),
});

export const site = siteSchema.parse({
  name: "VYN – CoCreation Lab",
  shortName: "VYN",
  // Tagline "Vision Your Name" — intentionally used sparingly (footer only).
  tagline: "Vision Your Name",
  role: "Web Developing",
  description:
    "VYN – CoCreation Lab is a web development studio focused on building fast, accessible, search-ready websites. Work spans AI-assisted tools, CMS builds and fully hand-coded applications.",
  siteUrl,
  email,
  githubUrl: "https://github.com/OodDev",
  linkedinUrl: "https://www.linkedin.com/in/paolo-montagna-789057b4/?isSelfProfile=true",
  location,
  expertise: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Headless CMS",
    "Technical SEO",
    "Core Web Vitals",
    "AI-assisted development",
  ],
  lastUpdated: "2026-10-17",
});

/** Canonical site URL without a trailing slash. */
export const SITE_URL: string = site.siteUrl.replace(/\/+$/, "");

/** Canonical mailto link with a pre-filled subject line. */
export function mailtoHref(): string {
  const subject = encodeURIComponent(`Website enquiry — ${site.name}`);
  const body = encodeURIComponent(
    `Hi ${site.name},\n\nI found your site and I'd like to talk about a project:\n\n`,
  );
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}
