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
 * Timeline math (uses the 360svh wrapper, pushed down by a fixed 100px
 * static gap under the hero — the GAP is BEFORE the wrapper, so the cover
 * math below changes scale but every PIN % beat keeps its absolute scroll
 * position): the `view()` cover phase spans wrapper+viewport = 460svh of
 * scroll (1 cover % = 4.6svh). The pinned phase — wrapper top at viewport
 * top (framer's "start start") — starts at 100/460 ≈ 21.7% and ends when
 * the wrapper bottom meets the viewport bottom (framer's "end end") at
 * 360/460 ≈ 78.3%. Most px-* RANGES START BELOW 21.7% — inside the
 * roll-in — so the assembly overlaps the sky's appearance (negative pin =
 * pre-lock: PIN −38 = scene peek, PIN 0 = the lock). ONE pin unit is now
 * 2.6svh of scroll (the pre-extension pin was 1.3), so every historical
 * PIN beat HALved on the HUD; the beats below are the post-extension
 * numbers.
 *
 * SIX-PHASE STRUCTURE (full map in the px-* block in globals.css):
 *
 * · PHASE 1 · SCENE PEEK (PIN −38 → −24): the sky whispers in — the empty
 *   #04090c sky, deep star field, moon, galaxy and the planet slide up on
 *   their full-roll drift; nothing else is in frame yet.
 * · PHASE 2 · ROLL-IN (PIN −24 → −5): the distant ridge crests the fold
 *   at PIN −17, the front band at −6, the sewing world (needle tip) at
 *   −5 — away from an empty sky, every band is mid-arrival at the lock.
 *   LINE 1 fades slowly through this stretch (−23 → −10).
 * · PHASE 3 · ASSEMBLY (PIN −5 → 15/20/50): the closer planes overtake
 *   the farther as they rise: the ridge lands 15, the front band 20, and
 *   the sewing world — exactly the reference composition
 *   (vyn-parallax-elements.html): seam and sewing feet at 810 units =
 *   84.7svh, tape-measure ruler ATTACHED to the sheet — LAST, at −6%
 *   REST at PIN 50 (the seam tops the fold ~PIN 0–1 and settles 78.7svh;
 *   the ruler tops the fold ~PIN 5 and rests 94–98.7svh). The planet
 *   sits behind the crest and the drafting circle loses its lower half
 *   en route. Departure sweeps begin as each band lands: the ridge leaves
 *   to −34%, the front band out-travels it to −45% (their departure
 *   completes by PIN 50), burying LINE 1 (sweep ~PIN 18→22).
 * · PHASE 4 · STATEMENT (PIN 50 → 60, inside the hold's opening stretch):
 *   LINE 2 (ink-white, z-40) fades in — no positional motion, one fixed
 *   viewport position — no thread yet, that's the point.
 * · PHASE 5 · HOLD — THE STILL FRAME + THREAD (PIN 50 → 92): ALL
 *   motion stops; the completed world sits motionless. As the scroll
 *   continues, the orange thread (absent until now!) draws spool →
 *   needle eye at PIN 50→75, then falls out of the eye and curls to the
 *   ground at PIN 75→88 — completing BEFORE the launch — and the world
 *   holds one quiet beat of scrolling (PIN 88→92).
 * · PHASE 6 · LAUNCH (PIN 92 → 100): the needle+flames rocket — parked
 *   on the seam through six phases — tips at its base and ARCS
 *   diagonally up-left through the screen centre while zooming to 40×
 *   (the "D · Arc into centre" variant of rocket-takeoff-variants.html,
 *   adapted): the zoom sweeps it completely off-screen — no fade — by
 *   the release.
 * · PHASE 7 · RELEASE (PIN 100 +): the frame exits upward: bg holds its
 *   −16% drift, mid −34%, midfront −45% already parked — the sewing
 *   world holds at its −6% rest (the rocket already departed;
 *   ruler strip as the bottom datum) while
 *   the projects section scrolls in below, its blend gradient landing
 *   exactly at the contact line. Artwork: "Paper Seams" (layer-art.tsx).
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
      className="px-scene relative mt-[100px] h-[360svh]"
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
         * (bottom calc 56svh + 120px → it rides the sky band above every
         * crest, zone ≈39–44svh content vs the distant-ridge crest landing
         * at 46.6): it fades in slowly through the roll (pin −23→−10) — long
         * readable BEFORE any silhouette can reach it — then STAYS until the
         * first ridge's departure sweep (~pin 18+) swallows it; no fade-out
         * animation ever runs. Line 2 (ink-white, former accent line) is
         * z-40, above every layer, fading in — SCROLLING NEVER MOVES IT:
         * it holds one fixed viewport position (opacity-only, no rise) —
         * over the landed, still world at pin 50→60 — just before the
         * thread, which only exists later in the hold phase. Two separate
         * stacking containers are what let the
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
