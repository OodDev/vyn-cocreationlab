/**
 * Projects section of the one-page flow: three parts (AI-assisted, CMS,
 * Hand-coded) with two placeholder cards each.
 *
 * On scroll-capable desktops the section becomes a SECOND PINNED SCENE after
 * the parallax release (.hs-* geometry + --hscene timeline in globals.css):
 * a tall wrapper locks a sticky viewport and the three category panels travel
 * HORIZONTALLY as the page keeps scrolling DOWN. Default markup below is the
 * original stacked vertical grid — mobile, reduced motion and browsers
 * without scroll-driven timelines all render exactly that, unchanged.
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
      className="hs-scene bg-bg relative py-24 sm:py-32"
    >
      {/* Pinned viewport in the horizontal act; plain wrapper otherwise. */}
      <div className="hs-sticky">
        <div className="shell hs-head">
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
          {/* Horizontal-act progress rail (decorative; hidden by default). */}
          <div aria-hidden="true" className="hs-progress">
            <span className="hs-progress-fill" />
          </div>
          <Reveal className="text-faint hs-note mt-6 text-sm">
            <p>
              All six cards currently show marked placeholders. Empty slots intentionally avoid
              invented claims — real names, links and screenshots land here as the owner fills
              them in.
            </p>
          </Reveal>
        </div>

        <div className="hs-trackzone">
          {/* Sliding track in the horizontal act; block wrapper otherwise. */}
          <div className="hs-track">
            {projectCategories.map(function (category, categoryIndex): JSX.Element {
              const categoryProjects = allProjectsWithMeta.filter(function (project) {
                return project.category === category.id;
              });
              return (
                <div
                  key={category.id}
                  className="hs-panel mt-16 first:mt-14"
                  aria-labelledby={`category-${category.id}`}
                >
                  <Reveal>
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
                  <div className="hs-panel-cards mt-7 grid gap-6 sm:grid-cols-2 lg:gap-8">
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
          </div>
        </div>
      </div>
    </section>
  );
}
