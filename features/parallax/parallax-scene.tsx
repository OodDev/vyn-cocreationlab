import type { JSX } from "react";
import { BackgroundLayer, ForegroundLayer, MidgroundLayer } from "./layer-art";

/**
 * Pinned parallax transition between the hero and the projects section —
 * CSS scroll-driven, zero JavaScript.
 *
 * A tall wrapper creates scroll distance; the three artwork layers inside a
 * sticky viewport move at different speeds while the projects section scrolls
 * in below, matching the layered depth of the reference video. The scroll
 * progress comes from the CSS `view()` timeline on the wrapper, so the scene
 * animates with NO client-side code: it is a server component, works without
 * JS, and is pure transform/opacity/stroke-dashoffset mutation (60fps budget).
 * Where the browser has no scroll-driven animation support, or the user
 * prefers reduced motion, the scene renders statically (see the px-* rules
 * in globals.css).
 *
 * Timeline math (uses the 230svh wrapper): the `view()` cover phase spans
 * wrapper+viewport = 330svh of scroll. The pinned phase — wrapper top at
 * viewport top (framer's "start start") — starts at 100/330 ≈ 30.3% and ends
 * when the wrapper bottom meets the viewport bottom (framer's "end end") at
 * 230/330 ≈ 69.7%. The px-* keyframes clamp their animation ranges to that
 * window, replicating the previous Framer Motion stage motion exactly:
 * 31→40%, out 47→55%, line 2 in 57→66% — while the orange thread draws from
 * the spool to the needle's eye 31→44% and drops from the eye onto the
 * ground 38→52%, both legs finishing before the sewing world (fg) rises
 * above the fold (~48% cover progress). Artwork: "Paper Seams"
 * (layer-art.tsx).
 *
 * Each layer's inner box is overscanned -6% vertically: the 1440×1000 canvas
 * is taller than the viewport, so slice-fitting into a slightly taller box
 * keeps the full artwork height visible (only a ~6-unit sliver is cropped at
 * the sides at 1440×900) while the sheet still bleeds past every viewport
 * edge.
 */
export function ParallaxScene(): JSX.Element {
  return (
    <section
      aria-labelledby="parallax-caption"
      data-section="projects-intro"
      className="px-scene relative h-[230svh]"
    >
      <div className="px-sticky sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="px-layer px-layer-bg absolute inset-0 w-full z-0">
            <div className="absolute inset-x-0 -inset-y-[6%]">
              <BackgroundLayer />
            </div>
          </div>
          <div className="px-layer px-layer-mid absolute inset-0 w-full z-20">
            <div className="absolute inset-x-0 -inset-y-[6%]">
              <MidgroundLayer />
            </div>
          </div>
          <div className="px-layer px-layer-fg absolute inset-0 w-full z-30">
            <div className="absolute inset-x-0 -inset-y-[6%]">
              <ForegroundLayer />
            </div>
          </div>
        </div>
        {/* Act-4 statement (reference video): two STAGED lines. Line 1 rises
         * in early in the pin; the orange thread draws toward the needle's
         * eye and it fades out; line 2 (the accent line) rises in its place
         * as the thread completes. z-40 keeps it above the opaque mountain
         * band (z-20) and sewing ground (z-30) — otherwise the cut-paper
         * layers would bury the text. Without scroll-timeline support (or
         * with reduced motion) both lines simply stack, fully visible. */}
        <div className="px-statement absolute inset-x-0 bottom-[38svh] z-40 flex justify-center px-6">
          <div className="px-statement-inner max-w-xl text-center">
            <h2
              id="parallax-caption"
              className="font-display text-[clamp(1.6rem,3.8vw,2.6rem)] leading-[1.15] font-bold text-balance"
            >
              <span className="px-line1 text-glow text-ink block">
                Every project starts as uncharted galaxies of ideas.
              </span>
              <span className="px-line2 text-glow-3 text-accent-3 block">
                Let&rsquo;s weave them to your exact, treasured measure.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
