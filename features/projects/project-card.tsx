import { ArrowUpRight } from "lucide-react";
import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { type ProjectWithMeta } from "@/content/projects";

/**
 * Card overlay per card-overlay-ref.mp4: the project name always overlays the
 * base art; on hover/focus an website-preview placeholder fades and scales in
 * plus an “Open project” affordance. Entire card is one link (tap-safe,
 * keyboard-activatable). Pure CSS hover — visible without JS.
 */
export function ProjectCard(props: { project: ProjectWithMeta; index: number }): JSX.Element {
  const { project, index } = props;
  const number: string = String(index + 1).padStart(2, "0");

  return (
    <Reveal className="h-full" delay={(index % 2) * 0.08}>
      <a
        href={project.href}
        className={cn(
          "group rounded-card border-line bg-elev relative flex h-full min-h-[19rem] flex-col overflow-hidden border",
          "hover:border-line-strong hover:shadow-glow transition-[transform,border-color] duration-300 hover:-translate-y-1",
          "focus-visible:border-accent focus-visible:-translate-y-1",
        )}
      >
        {/* Base layer: abstract cover art (pure CSS, no image request) */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0",
            project.category === "ai-assisted" &&
              "bg-[radial-gradient(120%_90%_at_20%_0%,rgba(75,225,236,0.16),transparent_58%)]",
            project.category === "cms" &&
              "bg-[radial-gradient(120%_90%_at_80%_0%,rgba(69,224,131,0.14),transparent_58%)]",
            project.category === "hand-coded" &&
              "bg-[radial-gradient(120%_90%_at_50%_0%,rgba(43,183,196,0.13),transparent_58%)]",
          )}
        />
        {/* Ghost index number */}
        <span
          aria-hidden="true"
          className="font-display text-ink/5 absolute -top-9 -right-3 text-[11rem] leading-none font-bold transition-opacity duration-500 select-none group-hover:opacity-60"
        >
          {number}
        </span>

        {/* Hover layer: website preview placeholder (fades + scales in) */}
        <img
          src={`/images/projects/preview-${project.slug}.svg`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={800}
          height={500}
          className={cn(
            "absolute inset-0 h-full w-full translate-y-4 scale-[1.06] object-cover opacity-0",
            "transition-[opacity,transform] duration-500 ease-out",
            "group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100",
            "group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100",
          )}
        />
        <div
          aria-hidden="true"
          className="from-bg/95 via-bg/55 to-bg/20 absolute inset-0 bg-gradient-to-t opacity-0 transition-opacity duration-500 group-hover:opacity-90 group-focus-visible:opacity-90"
        />

        {/* Text overlay (always visible, per reference) */}
        <div className="relative z-10 mt-auto flex flex-col gap-3 p-6 sm:p-7">
          <span className="rounded-pill border-line-strong text-accent w-fit border px-3 py-1 text-[0.68rem] font-bold tracking-[0.22em] uppercase">
            {project.categoryLabel}
          </span>
          <span className="font-display text-ink text-xl leading-snug font-semibold sm:text-2xl">
            {project.title}
          </span>
          <span className="text-muted group-hover:text-accent group-focus-visible:text-accent flex items-center gap-2 text-sm font-semibold transition-colors">
            {project.isPlaceholder ? "Awaiting project details" : "View case study"}
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5"
            />
          </span>
        </div>
      </a>
    </Reveal>
  );
}
