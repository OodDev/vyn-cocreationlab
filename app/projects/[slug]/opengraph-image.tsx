import { renderOgImage } from "@/lib/og";
import type { ImageResponse } from "next/og";
import { categoryLabels, getProjectBySlug, withMeta } from "@/content/projects";

/**
 * Per-project build-time OG image (one PNG per slug, generated statically).
 */
export const alt = "Project case study of VYN – CoCreation Lab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export function generateStaticParams(): Array<{ slug: string }> {
  return [
    "ai-assisted-project-01",
    "ai-assisted-project-02",
    "cms-project-01",
    "cms-project-02",
    "hand-coded-project-01",
    "hand-coded-project-02",
  ].map(function (slug: string): { slug: string } {
    return { slug };
  });
}

export default async function ProjectOgImage(props: {
  params: Promise<{ slug: string }>;
}): Promise<ImageResponse> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  const meta = project !== undefined ? withMeta(project) : undefined;

  return renderOgImage({
    kicker: meta?.categoryLabel ?? categoryLabels["hand-coded"],
    title: meta?.title ?? "VYN – CoCreation Lab",
    subtitle: "Case study — VYN CoCreation Lab",
  });
}
