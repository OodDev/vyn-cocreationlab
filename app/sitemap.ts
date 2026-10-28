import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { allProjectsWithMeta } from "@/content/projects";

export const dynamic = "force-static";

/**
 * Build-time sitemap (out/sitemap.xml). Includes the trailing-slash canons.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-17");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, priority: 1, changeFrequency: "monthly" },
    { url: `${SITE_URL}/projects/`, lastModified, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about/`, lastModified, priority: 0.8, changeFrequency: "yearly" },
    { url: `${SITE_URL}/contact/`, lastModified, priority: 0.7, changeFrequency: "yearly" },
  ];

  const projectRoutes: MetadataRoute.Sitemap = allProjectsWithMeta.map(function (project) {
    return {
      url: `${SITE_URL}${project.href}`,
      lastModified,
      priority: 0.6,
      changeFrequency: "yearly",
    } satisfies MetadataRoute.Sitemap[number];
  });

  return [...staticRoutes, ...projectRoutes];
}
