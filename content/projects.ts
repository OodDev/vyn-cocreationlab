import { z } from "zod";

/**
 * Project data. Every entry below is a PLACEHOLDER the site owner will fill
 * in (titles, descriptions, live URLs, repos and screenshots). The structure
 * is final — only replace the marked values.
 *
 * NEVER add fabricated clients, metrics or testimonials here.
 */

const categorySchema = z.enum(["ai-assisted", "cms", "hand-coded"]);

const caseStudySchema = z.object({
  /** Short platform/build facts shown in the project sheet. */
  specs: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .default([]),
  /** Long-form case-study body, rendered in order. */
  sections: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.array(z.string().min(1)).min(1),
        points: z.array(z.string().min(1)).optional(),
      }),
    )
    .default([]),
  /** Site screenshots; captions are optional. */
  gallery: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
        caption: z.string().optional(),
      }),
    )
    .default([]),
});

const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: z.string().min(1),
  category: categorySchema,
  description: z.string().min(1),
  caseStudy: caseStudySchema.optional(),
  stack: z.array(z.string()).default([]),
  /** Real website screenshot for the card hover layer (overrides the generated placeholder). */
  image: z.string().optional(),
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
    // EXAMPLE CONTENT (fictional, for preview) — replace with real project
    title: "Nordholt Booking Platform",
    category: "ai-assisted",
    description:
      "A booking platform for a boutique hotel group: room availability, seasonal pricing and a guest dashboard, built at AI speed with human-reviewed code.",
    stack: ["Next.js", "Postgres", "Tailwind"],
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
    slug: "benefuturo",
    title: "Benefuturo",
    category: "cms",
    description:
      "Website for Benefuturo, a social-purpose startup designing orientation-education programmes that bridge schools, universities, companies and institutions — a Squarespace build where the team publishes projects, people and news on their own.",
    stack: ["Squarespace", "CSS", "SEO"],
    image: "/media/projects/benefuturo.webp",
    liveUrl: "https://www.benefuturo.it/",
    updatedOn: "2026-10-17",
    caseStudy: {
      specs: [
        { label: "Platform", value: "Squarespace 7.1 (Fluid Engine)" },
        { label: "Build", value: "Section & block layouts + custom CSS" },
        { label: "Type", value: "Poppins + Raleway" },
        { label: "Language", value: "Italian, single locale" },
        { label: "Forms", value: "Native form block + GDPR consent" },
      ],
      sections: [
        {
          title: "Who they are",
          body: [
            "Benefuturo is a social-purpose innovative startup (startup innovativa a vocazione sociale) built around a network of national and international education experts: psychologists, pedagogists, teachers, project designers, communicators and artists, working from Pesaro with a legal seat in Camerino.",
            "Its subject is orientation, but treated as a lifelong educational process rather than a single decision at a transition point — career education that starts in primary school and continues through lower and upper secondary school, tertiary education, adulthood and European projects. The site has to make that continuum legible to schools, universities, companies, families and institutions at the same time.",
          ],
        },
        {
          title: "What they do",
          body: [
            "Benefuturo designs and runs the programmes itself, from scientific direction to delivery in classrooms and with partners. The website therefore doubles as a capability statement and as the public index of that work.",
          ],
          points: [
            "Scientific design and direction of educational projects",
            "European project design and partnership building",
            "Work with students and teacher training",
            "Networks and participatory processes",
            "EdTech tool development",
            "Educational events",
          ],
        },
        {
          title: "The brief",
          body: [
            "Three jobs, in order of difficulty: explain an ambitious, fairly abstract mission without resorting to brochure language; give each stage of education its own home so a primary-school programme never reads like an afterthought to a secondary-school one; and leave the whole thing editable by a small, distributed team with no developer in the loop.",
            "That last requirement is what pushed the build onto Squarespace rather than a hand-coded stack. The trade-off is deliberate: the client keeps publishing on their own, and the engineering budget goes into typography, layout and the handful of behaviours the platform does not give you for free.",
          ],
        },
        {
          title: "Build & technical notes",
          body: [
            "Layouts are assembled from Squarespace 7.1 sections and blocks, then refined with a small custom CSS layer (LESS-compiled by the platform). Kept short on purpose — each rule earns its place.",
            "The interesting work sits where the CMS stops cooperating: making whole cards clickable without nesting links, capping tall photo heroes on phones, and keeping the brand's overlapping-shape artwork readable at every width.",
          ],
          points: [
            "Stretched-link pattern: each programme tile is a list item whose button is absolutely positioned across the whole tile with a transparent background — the entire card is clickable and keyboard-reachable, with no nested interactive elements.",
            "Mobile hero caps via collection-scoped CSS (35vh under 1024px, 25vh under 400px) so portrait photography does not swallow the fold on small screens.",
            "Typography split: Poppins for display and body, Raleway bold for primary buttons, applied through the platform's font pack plus CSS.",
            "Imagery served from the Squarespace CDN with requested widths and native lazy-loading, so retina screens get sharp crops without oversized downloads.",
            "Contact handled by the native form block — name, email, message and a mandatory data-processing consent — with mailto and LinkedIn as fallbacks.",
            "SEO hygiene on a hosted platform: per-page titles and descriptions, Open Graph metadata, a single canonical host, semantic heading order, descriptive alt text, and privacy/cookie pages linked from the footer.",
          ],
        },
        {
          title: "What made it interesting",
          body: [
            "Working inside a hosted platform inverts the usual priorities. There is no component library to reach for, so the engineering becomes CSS specificity, block structure and content modelling — deciding which pieces are templates, which are one-off sections, and which are content the client will duplicate next month.",
            "The visual identity does the heavy lifting: geometric letterforms, colour-blocked illustrations and translucent overlapping shapes. The job of the layout was to stay quiet around it — generous white space, one clear type hierarchy, and colour used to separate audience stages rather than to decorate.",
          ],
        },
      ],
      gallery: [
        {
          src: "/media/projects/benefuturo-home.webp",
          alt: "Benefuturo homepage: a portrait photograph behind the headline 'Come fa a sognare qualcosa che non conosce?'",
          caption: "Homepage — portrait-led hero, then the orientation manifesto in the brand's teal.",
        },
        {
          src: "/media/projects/benefuturo-progetti.webp",
          alt: "Benefuturo projects index with overlapping translucent letterforms and colour-coded cards for each school stage",
          caption: "Projects index — one colour-coded card per education stage, every tile fully clickable.",
        },
        {
          src: "/media/projects/benefuturo-progetto.webp",
          alt: "Benefuturo programme page for upper secondary schools, titled 'Protagonisti di futuro', with a two-photo grid",
          caption: "Programme page — each stage gets its own hero artwork and photo grid.",
        },
        {
          src: "/media/projects/benefuturo-contatti.webp",
          alt: "Benefuturo contact page with a native Squarespace form beside the brand's geometric illustration",
          caption: "Contact — native form block with GDPR consent, plus mailto and LinkedIn fallbacks.",
        },
      ],
    },
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
