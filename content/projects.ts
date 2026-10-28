import { z } from "zod";

/**
 * Project data. Every entry below is a PLACEHOLDER the site owner will fill
 * in (titles, descriptions, live URLs, repos and screenshots). The structure
 * is final — only replace the marked values.
 *
 * NEVER add fabricated clients, metrics or testimonials here.
 */

const categorySchema = z.enum(["ai-assisted", "cms", "hand-coded"]);

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: z.string().min(1),
  category: categorySchema,
  description: z.string().min(1),
  stack: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  startedOn: z.string().date().optional(),
  updatedOn: z.string().date().optional(),
});

const projectsSchema = z.object({
  updatedAt: z.string().date(),
  projects: z.array(projectSchema),
});

type Project = z.infer<typeof projectSchema>;

export type ProjectCategory = z.infer<typeof categorySchema>;
export type { Project };
export type { z };

export const categoryLabels: Record<ProjectCategory, string> = {
  "ai-assisted": "AI-assisted",
  cms: "CMS",
  "hand-coded": "Hand-coded",
};

const raw: Array<Project> = [
  // ── Part 1 · AI-assisted projects ─────────────────────────────────────────
  {
    slug: "ai-assisted-project-01",
    // PLACEHOLDER
    title: "{{PROJECT TITLE}}",
    category: "ai-assisted",
    // PLACEHOLDER
    description:
      "{{PROJECT DESCRIPTION}} — one or two sentences on what the project does, what was built and the outcome.",
    stack: ["{{STACK}}"],
    // liveUrl: "https://…",
    // repoUrl: "https://github.com/OodDev/…",
    startedOn: "2026-01-01",
    updatedOn: "2026-10-17",
  },
  {
    slug: "ai-assisted-project-02",
    title: "{{PROJECT TITLE}}",
    category: "ai-assisted",
    description: "{{PROJECT DESCRIPTION}}",
    stack: ["{{STACK}}"],
    startedOn: "2026-01-01",
    updatedOn: "2026-10-17",
  },
  // ── Part 2 · CMS projects ────────────────────────────────────────────────
  {
    slug: "cms-project-01",
    title: "{{PROJECT TITLE}}",
    category: "cms",
    description: "{{PROJECT DESCRIPTION}}",
    stack: ["{{STACK}}"],
    startedOn: "2026-01-01",
    updatedOn: "2026-10-17",
  },
  {
    slug: "cms-project-02",
    title: "{{PROJECT TITLE}}",
    category: "cms",
    description: "{{PROJECT DESCRIPTION}}",
    stack: ["{{STACK}}"],
    startedOn: "2026-01-01",
    updatedOn: "2026-10-17",
  },
  // ── Part 3 · Hand-coded projects ─────────────────────────────────────────
  {
    slug: "hand-coded-project-01",
    title: "{{PROJECT TITLE}}",
    category: "hand-coded",
    description: "{{PROJECT DESCRIPTION}}",
    stack: ["{{STACK}}"],
    startedOn: "2026-01-01",
    updatedOn: "2026-10-17",
  },
  {
    slug: "hand-coded-project-02",
    title: "{{PROJECT TITLE}}",
    category: "hand-coded",
    description: "{{PROJECT DESCRIPTION}}",
    stack: ["{{STACK}}"],
    startedOn: "2026-01-01",
    updatedOn: "2026-10-17",
  },
];

export const projects = projectsSchema.parse({
  updatedAt: "2026-10-17",
  projects: raw,
}).projects;

/** Groups of projects in showcase order (AI-assisted → CMS → Hand-coded). */
export const projectCategories: ReadonlyArray<{
  id: ProjectCategory;
  label: string;
  blurb: string;
}> = [
  {
    id: "ai-assisted",
    label: "AI-assisted projects",
    blurb:
      "Products built with AI acceleration in the loop — faster iteration, human-reviewed code.",
  },
  {
    id: "cms",
    label: "CMS projects",
    blurb:
      "Editable websites on modern headless or classic CMS so non-technical owners stay in control.",
  },
  {
    id: "hand-coded",
    label: "Hand-coded projects",
    blurb:
      "Bespoke applications written line by line for full control over performance and behaviour.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(function (project) {
    return project.slug === slug;
  });
}

export function relatedProjects(
  slug: string,
  count: number,
): Array<{
  project: ProjectWithMeta;
  reason: "same-category" | "other";
}> {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  const sameCategory = projects.filter(
    (project) => project.category === current.category && project.slug !== slug,
  );
  const others = projects.filter(
    (project) => project.category !== current.category && project.slug !== slug,
  );
  const rest: Array<Project> = others;
  const ordered: Array<Project> = [...sameCategory, ...rest];
  return ordered.slice(0, count).map(function (project: Project): {
    project: ProjectWithMeta;
    reason: "same-category" | "other";
  } {
    return {
      project: withMeta(project),
      reason: project.category === current.category ? "same-category" : "other",
    };
  });
}

/** Project data drive their own schema — generated from content, never hand-duplicated. */
export type ProjectWithMeta = Project & {
  href: string;
  categoryLabel: string;
  isPlaceholder: boolean;
};

export function withMeta(project: Project): ProjectWithMeta {
  return {
    ...project,
    href: `/projects/${project.slug}/`,
    categoryLabel: categoryLabels[project.category],
    isPlaceholder: project.title.startsWith("{{"),
  };
}

export const allProjectsWithMeta: Array<ProjectWithMeta> = projects.map(withMeta);
