import Link from "next/link";
import type { Metadata } from "next";
import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/features/projects/project-card";
import { allProjectsWithMeta, projectCategories } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graphToJsonLd, itemListNode } from "@/lib/structured-data";

/**
 * Projects index — lists every project card grouped by category.
 * JSON-LD: ItemList + BreadcrumbList.
 */
export function generateMetadata(): Metadata {
  return buildMetadata({
    path: "/projects",
    title: "Projects — AI-assisted, CMS & hand-coded",
    description:
      "Browse the three parts of the lab's work: AI-assisted projects, CMS projects and hand-coded applications. Case studies open as their own crawlable pages.",
  });
}

export default function ProjectsIndexPage(): JSX.Element {
  const jsonLd: string = graphToJsonLd([
    itemListNode(allProjectsWithMeta),
    breadcrumbNode("/projects/", [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects/" },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <link
        rel="alternate"
        type="text/markdown"
        title="Projects — markdown version"
        href="/projects.md"
      />
      <div className="shell pt-36 pb-28">
        <Reveal>
          <nav aria-label="Breadcrumb" className="text-faint mb-8 text-sm">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-muted">
                Projects
              </li>
            </ol>
          </nav>
          <p className="kicker">Selected work</p>
          <h1 className="font-display text-ink mt-4 text-5xl font-bold sm:text-6xl">
            Projects
          </h1>
          <p className="text-muted mt-5 max-w-2xl text-lg">
            {`Three parts, one standard: ${allProjectsWithMeta.length} case-study pages currently ship as clearly marked placeholders — every card below opens a real, crawlable URL.`}
          </p>
        </Reveal>

        {projectCategories.map(function (category, categoryIndex): JSX.Element {
          const inCategory = allProjectsWithMeta.filter(function (project) {
            return project.category === category.id;
          });
          return (
            <section
              key={category.id}
              aria-labelledby={`index-category-${category.id}`}
              className="mt-16"
            >
              <Reveal>
                <h2
                  id={`index-category-${category.id}`}
                  className="font-display text-ink text-2xl font-semibold"
                >
                  <span className="text-accent-2">
                    {String(categoryIndex + 1).padStart(2, "0")}.
                  </span>{" "}
                  {category.label}
                </h2>
                <p className="text-muted mt-2 max-w-2xl text-sm">{category.blurb}</p>
              </Reveal>
              <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:gap-8">
                {inCategory.map(function (project, index): JSX.Element {
                  return (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      index={categoryIndex * 2 + index}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
