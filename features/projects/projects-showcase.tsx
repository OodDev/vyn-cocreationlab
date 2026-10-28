/**
 * Projects section of the one-page flow: three parts (AI-assisted, CMS,
 * Hand-coded) with two placeholder cards each.
 */
import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { allProjectsWithMeta, projectCategories } from "@/content/projects";
import { ProjectCard } from "./project-card";

export function ProjectsShowcase(): JSX.Element {
  return (
    <section
      id="projects"
      data-section="projects"
      aria-labelledby="projects-heading"
      className="bg-bg relative py-24 sm:py-32"
    >
      <div className="shell">
        <Reveal>
          <p className="kicker">Selected work</p>
          <h2
            id="projects-heading"
            className="font-display text-ink mt-4 text-4xl font-bold sm:text-5xl"
          >
            Projects
          </h2>
          <p className="text-muted mt-4 max-w-2xl">
            What can you expect? The lab ships across three modes of delivery — AI-assisted
            builds, CMS projects and hand-coded applications. Each card links to its dedicated
            case-study page.
          </p>
        </Reveal>

        {projectCategories.map(function (category, categoryIndex): JSX.Element {
          const categoryProjects = allProjectsWithMeta.filter(function (project) {
            return project.category === category.id;
          });
          return (
            <div
              key={category.id}
              className="mt-16 first:mt-14"
              aria-labelledby={`category-${category.id}`}
            >
              <Reveal delay={0.05}>
                <h3
                  id={`category-${category.id}`}
                  className="font-display text-ink text-2xl font-semibold"
                >
                  <span className="text-accent-2">
                    {String(categoryIndex + 1).padStart(2, "0")}.
                  </span>{" "}
                  {category.label}
                </h3>
                <p className="text-muted mt-2 max-w-2xl text-sm">{category.blurb}</p>
              </Reveal>
              <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:gap-8">
                {categoryProjects.map(function (project): JSX.Element {
                  return (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      index={allProjectsWithMeta.indexOf(project)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        <Reveal className="text-faint mt-14 text-sm">
          <p>
            All six cards currently show marked placeholders. Empty slots intentionally avoid
            invented claims — real names, links and screenshots land here as the owner fills
            them in.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
