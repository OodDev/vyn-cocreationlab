import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, JSX } from "react";
import { SmartImage } from "@/components/media/smart-image";
import { mailtoHref, site } from "@/content/site";
import { HERO_SIZES, heroImage } from "@/lib/media";
import { RotatingRole } from "@/features/hero/rotating-role";
import { ScrambleText } from "@/features/hero/scramble-text";

/**
 * Hero — exactly 100svh of the provided artwork with the identity block on
 * the half-left (per main-title-position.png): large wordmark-style title,
 * "Web Developing" subtitle, an answer-first intro paragraph and the primary
 * contact CTA. Entrance animation is pure CSS (works without JS; flattened
 * under prefers-reduced-motion); the artwork is the LCP image (priority hint
 * + responsive AVIF/WebP srcset, explicit dimensions → no CLS).
 */
export function HeroSection(): JSX.Element {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* LCP background artwork */}
      <div className="absolute inset-0" aria-hidden="false">
        <SmartImage
          sources={heroImage.sources}
          fallback={heroImage.fallback}
          alt="Two glowing wireframe hands reaching toward each other in the dark — the vision of collaboration behind VYN – CoCreation Lab"
          // Chromium's LCP image rules (verified empirically against t6/t13/
          // t21–t27 test pages): an image whose rect covers exactly the
          // viewport, extends beyond it (even by 12px), or sits in a fixed
          // layer is stripped of LCP-eligibility; an image that FITS inside
          // counts. So the artwork is 24px short of the fold — the strip is
          // covered by the design's own bottom fade; visually identical.
          className="absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full object-cover"
          sizes={HERO_SIZES}
          priority
        />
        {/* Legibility gradients. Deliberately PARTIAL coverage only: any
         * full-viewport paint above the artwork would make Chromium treat
         * the hero image as fully occluded and strip it of LCP-eligibility.
         * Bottom fade + left readability wedge cover distinct sub-areas. */}
        <div
          aria-hidden="true"
          className="from-bg absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t sm:h-56"
        />
        <div
          aria-hidden="true"
          className="from-bg/80 absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r sm:block"
        />
      </div>

      {/* Content is offset downward purely with padding: keeping the shell's
       * total height constant (top/bottom padding swapped around the
       * original split) preserves the flex centering, so the background
       * artwork does not move — only the writing block shifts lower. */}
      <div className="shell relative z-10 w-full pt-[11.5rem] pb-[6.5rem]">
        <div className="max-w-2xl">
          <h1 id="hero-title" className="font-display text-ink leading-[0.98] font-bold">
            <span
              className="hero-enter text-glow block text-[clamp(3.6rem,11vw,8.25rem)] tracking-[0.04em]"
              style={{ "--enter-delay": "0.12s" } as CSSProperties}
            >
              <ScrambleText text="VYN" startDelayMs={2400} />
            </span>
            <span
              className="hero-enter text-ink block text-[clamp(1.45rem,3.4vw,2.5rem)] font-medium tracking-[0.02em]"
              style={{ "--enter-delay": "0.26s" } as CSSProperties}
            >
              <ScrambleText text="CoCreation Lab" startDelayMs={2620} />
            </span>
          </h1>

          <p
            className="hero-enter kicker mt-7"
            style={
              {
                "--enter-delay": "0.4s",
                fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
                letterSpacing: "0.14em",
                lineHeight: 1.1,
              } as CSSProperties
            }
          >
            [<RotatingRole />]
          </p>

          <p
            className="hero-enter text-muted mt-6 max-w-xl text-base sm:text-lg"
            style={{ "--enter-delay": "0.52s" } as CSSProperties}
          >
            {site.description}
          </p>

          <p
            className="hero-enter mt-14 flex flex-wrap items-center gap-4"
            style={{ "--enter-delay": "0.64s" } as CSSProperties}
          >
            <a
              href={mailtoHref()}
              className="rounded-pill bg-accent text-bg hover:shadow-glow inline-flex items-center gap-2.5 px-7 py-3.5 font-semibold transition-all hover:-translate-y-0.5"
            >
              Get in touch
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <Link
              href="#projects"
              className="rounded-pill border-line-strong text-ink hover:border-accent hover:text-accent inline-flex items-center gap-2 border px-7 py-3.5 font-semibold transition-all"
            >
              View projects
              <ArrowDown size={16} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="hero-enter absolute inset-x-0 bottom-8 z-10 flex justify-center"
        style={{ "--enter-delay": "1s" } as CSSProperties}
        aria-hidden="true"
      >
        <span className="animate-glow border-line-strong text-accent flex h-11 w-11 items-center justify-center rounded-full border">
          <ArrowDown size={18} className="animate-bounce" />
        </span>
      </div>
    </section>
  );
}
