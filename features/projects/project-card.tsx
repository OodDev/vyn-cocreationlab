import { ArrowUpRight } from "lucide-react";
import type { JSX } from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { type ProjectWithMeta } from "@/content/projects";

/**
 * Card overlay per card-models5.html ("02-rev B · with tech stack badges"):
 * big centered project title over the original card background (elevated teal
 * + cyan radial art), 8.8rem ghost index number top-right, dashed stack tags
 * (only when real stack values exist). On hover/focus the resting text fades
 * to a whisper and the website-preview mockup takes over. Entire card is one
 * link (tap-safe, keyboard-activatable). Pure CSS hover — visible without JS.
 */
export function ProjectCard(props: { project: ProjectWithMeta; index: number }): JSX.Element {
  const { project, index } = props;
  const number: string = String(index + 1).padStart(2, "0");
  const stack: string[] = project.stack.filter((tool) => !tool.startsWith("{{"));

  return (
    <Reveal className="h-full" delay={(index % 2) * 0.08}>
      <a
        href={project.href}
        className={cn(
          "group rounded-card border-line bg-elev relative flex h-full min-h-[19rem] flex-col items-center justify-center overflow-hidden border text-center",
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
          className="font-display text-ink/5 absolute -top-7 -right-2 text-[8.8rem] leading-none font-bold transition-colors duration-500 select-none group-hover:text-ink/[0.12] group-focus-visible:text-ink/[0.12]"
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
          className="absolute inset-0 h-full w-full translate-y-4 scale-[1.05] object-cover opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100"
        />

        {/* Resting text overlay — fades to a whisper while the mock takes over */}
        <div className="textfade relative z-10 flex flex-col items-center gap-3 px-8 py-6 transition-opacity duration-500 group-hover:opacity-10 group-focus-visible:opacity-10">
          <span className="rounded-pill border-line-strong text-accent w-fit border px-3 py-1 text-[0.65rem] font-bold tracking-[0.22em] uppercase">
            {project.categoryLabel}
          </span>
          <span className="text-ink my-3 max-w-[18rem] text-[1.55rem] leading-[1.15] tracking-tight sm:text-[1.95rem]">
            <span className="font-[family-name:var(--font-jetbrains-mono)] font-medium">
              <span className="text-accent font-bold">./</span>
              {project.title}
            </span>
          </span>
          {stack.length > 0 && (
            <span className="flex flex-wrap justify-center gap-2">
              {stack.map((tool) => (
                <span
                  key={tool}
                  className="rounded-[0.3rem] border border-dashed border-accent/35 text-accent px-2 py-0.5 font-mono text-[0.66rem]"
                >
                  {tool}
                </span>
              ))}
            </span>
          )}
          <span
            className={cn(
              "text-muted group-hover:text-accent group-focus-visible:text-accent flex items-center gap-2 text-[0.8rem] font-semibold tracking-[0.02em] transition-colors",
            )}
          >
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
