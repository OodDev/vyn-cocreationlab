import type { JSX } from "react";
import { BackgroundLayer, ForegroundLayer, MidgroundFrontLayer, MidgroundLayer } from "./layer-art";

/**
 * Pinned parallax transition between the hero and the projects section —
 * CSS scroll-driven, zero JavaScript.
 *
 * A tall wrapper creates scroll distance; the FOUR artwork depths inside a
 * sticky viewport move at different speeds — universe sky (bg) · distant
 * mountain ridge (mid) · nearer front mountain band (midfront) · sewing
 * world (fg, carrying the tape-measure ruler as its bottom datum) —
 * while the projects section scrolls in below. The scroll
 * progress comes from the CSS `view()` timeline on the wrapper, so the scene
 * animates with NO client-side code: it is a server component, works without
 * JS, and is pure transform/opacity/stroke-dashoffset mutation (60fps budget).
 * Where the browser has no scroll-driven animation support, or the user
 * prefers reduced motion, the scene renders statically (see the px-* rules
 * in globals.css).
 *
 * Timeline math (uses the 230svh wrapper, pushed down by a fixed 100px
 * static gap under the hero — the GAP is BEFORE the wrapper, so the cover
 * math below is unchanged in PIN %): the `view()` cover phase spans
 * wrapper+viewport = 330svh of scroll. The pinned phase — wrapper top at
 * viewport top (framer's "start start") — starts at 100/330 ≈ 30.3% and ends
 * when the wrapper bottom meets the viewport bottom (framer's "end end") at
 * 230/330 ≈ 69.7%. Most px-* RANGES START BELOW 30.3% — inside the roll-in —
 * so the assembly overlaps the sky's appearance (negative pin = pre-lock:
 * PIN −77 = scene peek, PIN 0 = the lock).
 *
 * Overlapping assembly (full map in the px-* block in globals.css): the
 * scene assembles WHILE the sky is appearing, not after the sky is loaded —
 * at the lock the frame is already a stacked, mid-arrival world. Timing
 * sheet ("start" = the band's crest crosses the fold, "lands" = rest):
 * distant ridge starts PIN −34 / lands 30 · front band — pushed LATER and
 * more detached from the first ridge — starts PIN −14 / lands 40 · sewing
 * world — exactly the reference composition (vyn-parallax-elements.html):
 * seam and sewing feet at 810 units = 84.7svh, tape-measure ruler
 * ATTACHED to the sheet — starts PIN −12 (needle tip first; the ground
 * seam tops the fold ~PIN 1) and lands at a −6% REST at 100: the seam
 * settles at 78.7svh and the ruler strip (moving with the same
 * transform) tops the fold ~PIN 11 and rests at 94–98.7svh, the bottom
 * datum above the projects contact line — the closer planes cover the
 * farther as they pass;
 * the planet setting behind the crest and the drafting circle losing its
 * lower half to the arriving ridges happen en route. The orange thread
 * draws spool→needle eye at pin 37→75, then drops eye→ground at pin
 * 55→96, finishing just before release. Statement: line 1 is RAISED
 * (bottom-56svh, zone ≈39–44svh) and fades in during the roll (pin
 * −49→−20, cover 12→22.4), staying long readable before the first ridge's
 * departure sweep (~pin 36+) covers it; line 2 (ink-white, z-40) in
 * cover 57→66 above the landed world.
 * Departure: bg −16% (drifting from the scene peek) while mid −34% and
 * midfront −45% out-travel after their landings, each depth ahead of the
 * one behind, while the sewing world holds at its −6% rest (ruler strip
 * as the bottom datum) to the release —
 * the projects section covers it at full stretch, its blend gradient
 * landing exactly at the contact line. Artwork: "Paper Seams"
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
      className="px-scene relative mt-[100px] h-[230svh]"
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
          <div className="px-layer px-layer-midfront absolute inset-0 w-full z-[25]">
            <div className="absolute inset-x-0 -inset-y-[6%]">
              <MidgroundFrontLayer />
            </div>
          </div>
          <div className="px-layer px-layer-fg absolute inset-0 w-full z-30">
            <div className="absolute inset-x-0 -inset-y-[6%]">
              <ForegroundLayer />
            </div>
          </div>
        </div>
        {/* Act-4 statement, SPLIT BY DEPTH. Line 1 is a buried layer, RAISED
         * (bottom-56svh → it rides the sky band above every crest, zone
         * (bottom-56svh + 120px → it rides the sky band above every crest, zone
         * ≈39–44svh content vs the distant-ridge crest landing at 46.6):
         * it fades in slowly through the roll (pin −49→−20) — long readable BEFORE
         * any silhouette can reach it — then STAYS until the first ridge's
         * departure sweep (~pin 36+) swallows it; no fade-out animation
         * ever runs. Line 2 (ink-white, former accent line) is z-40,
         * above every layer, rising over the landed world as the thread
         * completes. Two separate stacking containers are what let the
         * lines sit on OPPOSITE sides of the layers (one buried, one on
         * top). Without scroll-timeline support (or with reduced motion)
         * both render fully visible, stacked (see the px-statement-2
         * fallback rules in globals.css). Note: line 1 additionally sits
         * 120px ABOVE its 56svh anchor (bottom calc — fixed-pixel shim,
         * like the 100px gap before the wrapper). */}
        <div className="px-statement-1 absolute inset-x-0 bottom-[calc(56svh+120px)] z-10 flex justify-center px-6">
          <div className="px-statement-inner max-w-xl text-center">
            <h2
              id="parallax-caption"
              className="font-display text-[clamp(1.6rem,3.8vw,2.6rem)] leading-[1.15] font-bold text-balance"
            >
              <span className="px-line1 text-ink block">
                Every project starts as uncharted galaxies of ideas.
              </span>
            </h2>
          </div>
        </div>
        <div className="px-statement-2 absolute inset-x-0 bottom-[44svh] z-40 flex justify-center px-6">
          <div className="px-statement-inner max-w-xl text-center">
            <h2 className="font-display text-[clamp(1.6rem,3.8vw,2.6rem)] leading-[1.15] font-bold text-balance">
              <span className="px-line2 text-ink block">
                Let&rsquo;s weave them to your exact, treasured measure.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
