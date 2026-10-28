import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { type Project, type ProjectWithMeta, withMeta } from "@/content/projects";
import { getProjectBySlug, projectCategories, relatedProjects } from "@/content/projects";
import { mailtoHref } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graphToJsonLd, projectNode } from "@/lib/structured-data";

/**
 * Project case-study page — real, crawlable URL per project.
 * Currently placeholder content (marked), structure and schema final.
 * JSON-LD: CreativeWork + BreadcrumbList.
 */

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  // Mirror of content slugs, imported directly from the single source of truth.
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

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const project: Project | undefined = getProjectBySlug(slug);
  if (project === undefined) {
    return buildMetadata({ path: `/projects/${slug}`, title: "Project not found" });
  }
  const meta = withMeta(project);
  return buildMetadata({
    path: meta.href,
    title: `${meta.categoryLabel} project — ${meta.title}`.slice(0, 60),
    description: meta.description.slice(0, 155),
  });
}

export default async function ProjectDetailPage(props: ProjectPageProps): Promise<JSX.Element> {
  const { slug } = await props.params;
  const project: Project | undefined = getProjectBySlug(slug);
  if (project === undefined) {
    notFound();
  }
  const meta: ProjectWithMeta = withMeta(project);
  const related: Array<{
    project: ProjectWithMeta;
    reason: "same-category" | "other";
  }> = relatedProjects(slug, 2);

  const jsonLd: string = graphToJsonLd([
    projectNode(meta),
    breadcrumbNode(meta.href, [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects/" },
      { name: meta.title, path: meta.href },
    ]),
  ]);

  const categoryHeading: string =
    projectCategories.find(function (c) {
      return c.id === meta.category;
    })?.label ?? meta.categoryLabel;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <link
        rel="alternate"
        type="text/markdown"
        title={`${meta.title} — markdown version`}
        href={`/projects/${meta.slug}.md`}
      />
      <article className="shell pt-36 pb-28">
        <nav aria-label="Breadcrumb" className="text-faint mb-10 text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/projects/" className="hover:text-accent transition-colors">
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-muted">
              {meta.title}
            </li>
          </ol>
        </nav>

        <Reveal>
          <span className="rounded-pill border-line-strong text-accent border px-3 py-1 text-[0.68rem] font-bold tracking-[0.22em] uppercase">
            {categoryHeading}
          </span>
          <h1
            tabIndex={-1}
            className="font-display text-ink mt-6 max-w-3xl text-5xl leading-tight font-bold sm:text-6xl"
          >
            {meta.title}
          </h1>
        </Reveal>

        <Reveal className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            {/* Visible description matches CreativeWork.description exactly */}
            <p className="text-ink/90 text-lg leading-relaxed sm:text-xl">{meta.description}</p>
            {/* Placeholder case-study body — owner fills later */}
            <p className="text-faint mt-6 text-sm leading-relaxed">
              {
                "{{CASE-STUDY BODY}} — the fuller write-up will go here: brief, approach, stack decisions and outcome. Kept empty on purpose so no fabricated details ship."
              }
            </p>
            <p className="mt-8">
              <a
                href={mailtoHref()}
                className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2.5 border px-6 py-3 font-semibold transition-all"
              >
                Ask about this project
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </p>
          </div>

          <aside className="rounded-card border-line bg-surface h-fit border p-6">
            <h2 className="kicker text-accent-2">Project sheet</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-faint">Category</dt>
                <dd className="text-ink mt-1 font-medium">{categoryHeading}</dd>
              </div>
              <div>
                <dt className="text-faint">Stack</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {meta.stack.map(function (tech): JSX.Element {
                    return (
                      <span
                        key={tech}
                        className="rounded-pill border-line text-muted border px-2.5 py-1 text-[0.7rem]"
                      >
                        {tech}
                      </span>
                    );
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-faint">Started</dt>
                <dd className="text-ink mt-1 font-medium">{meta.startedOn}</dd>
              </div>
              <div>
                <dt className="text-faint">Links</dt>
                <dd className="mt-1 space-y-1.5">
                  {meta.liveUrl !== undefined ? (
                    <a
                      href={meta.liveUrl}
                      className="text-accent hover:text-ink block transition-colors"
                    >
                      Live project (new tab)
                    </a>
                  ) : null}
                  {meta.repoUrl !== undefined ? (
                    <a
                      href={meta.repoUrl}
                      className="text-accent hover:text-ink block transition-colors"
                    >
                      Repository (new tab)
                    </a>
                  ) : null}
                  {meta.liveUrl === undefined && meta.repoUrl === undefined ? (
                    <span className="text-faint">{"{{URL / REPO}} — pending"}</span>
                  ) : null}
                </dd>
              </div>
            </dl>
          </aside>
        </Reveal>

        {/* Internal linking between related projects (descriptive anchors) */}
        <section
          aria-labelledby="related-projects"
          className="border-line mt-20 border-t pt-10"
        >
          <h2 id="related-projects" className="kicker text-accent-2">
            Related work
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map(function (entry): JSX.Element {
              return (
                <li key={entry.project.slug}>
                  <Link
                    href={entry.project.href}
                    className="group rounded-card border-line bg-elev hover:border-line-strong hover:shadow-glow block border p-5 transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-faint block text-xs font-bold tracking-[0.2em] uppercase">
                      {entry.reason === "same-category"
                        ? `More ${categoryHeading.toLowerCase()}`
                        : "Different approach"}
                    </span>
                    <span className="font-display text-ink group-hover:text-accent mt-2 flex items-center justify-between gap-3 text-lg font-semibold">
                      {entry.project.title}
                      <ArrowUpRight size={18} aria-hidden="true" className="shrink-0" />
                    </span>
                    <span className="text-muted mt-1 line-clamp-2 text-sm">
                      {entry.project.description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </article>
    </>
  );
}
