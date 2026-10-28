/**
 * ★ MAIN SET — "Paper Seams" (SET 04b, id v04b-cutpaper-props)
 *
 * The approved cut-paper two-worlds artwork for the hero→projects parallax:
 * the UNIVERSE lives above the ridge (crescent moon, comet-drift galaxy,
 * sprinkle stars, an orange planet setting behind the crest, and a giant
 * drafting circle with a dashed axis); the SEWING world lives below the seam
 * (scissors resting mid-cut on the seam, spool, a thin orange thread rising
 * to a rocket-like needle mast with launch flames, a tape-measure ruler and
 * an orange button).
 *
 * EVERY graphic piece is a named, tagged element: each one is wrapped in
 * <g data-element="..."> (plus a comment), and the canonical registry is
 * exported below as PAPER_SEAMS_ELEMENTS. Reference elements by these names
 * in the future — they match the exploration generator
 * (scripts/generate-parallax-variants.mjs, E04 / E04B entries) 1:1.
 *
 * Canvas: 1440×1000 (tall two-zone composition), slice-fitted per layer.
 * All geometry is deterministic (fixed-seed LCG, no Math.random) so server
 * and client renders match exactly.
 */
import type { JSX } from "react";

/* ── element registry — the tagged pieces of "Paper Seams" ───────────── */
export const PAPER_SEAMS_ELEMENTS = {
  background: [
    "sky",
    "stars",
    "moon",
    "galaxyDashed",
    "planetOrange",
    "starBig",
    "bigCircle",
  ],
  midground: [
    "mountains",
    "mountainPerforation",
    "mountainCrosses",
    "mountainsFront",
    "mountainFrontPerforation",
  ],
  foreground: [
    "sewingGround",
    "groundSeam",
    "threadRise",
    "threadFall",
    "spool",
    "scissors",
    "needle",
    "needleFlames",
    "buttonOrange",
    "ruler",
  ],
} as const;

/* palette (cut-paper discipline: dark silhouettes, pale rim, one orange) */
const INK = "#04161d";
const GROUND = "#021016";
const MOUNT = "#08222c";
const MOUNT_FRONT = "#061c26";
const SKY = "#03141c";
const RIM = "#7fb0bc";
const PALE = "#cfe8ec";
const GALAXY = "#3a5a64";
const GALAXY_SOFT = "#58828d";
const STITCH = "#3f7280";
const CIRCLE_LINE = "#2e5a66";
const ORANGE = "#f79c00";
const ORANGE_DEEP = "#d9640a";
const ORANGE_MID = "#c05008";

const f1 = (v: number): number => Number(v.toFixed(1));

/* Deterministic pseudo-random generator (same LCG as the exploration
 * generator's rng(), fixed seed) — drives the star sprinkle. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return function generate(): number {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* stars(61, 110, { color: PALE, rMax: 1.4, oMax: 0.55, h: 420 }) — identical
 * output to the generator, then dropped 60 units (translate(0 60)). */
const STAR_FIELD: Array<{ x: number; y: number; r: number; o: number }> =
  (function buildStars(): Array<{ x: number; y: number; r: number; o: number }> {
    const rand = seededRandom(61);
    const stars: Array<{ x: number; y: number; r: number; o: number }> = [];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: f1(rand() * 1440),
        y: f1(rand() * 420),
        r: f1(0.5 + rand() * 0.9),
        o: f1(0.25 + rand() * 0.3),
      });
    }
    return stars;
  })();

/* cross-stitch × mark */
const crossPath = (x: number, y: number, s: number): string =>
  `M${x - s} ${y - s} L${x + s} ${y + s} M${x - s} ${y + s} L${x + s} ${y - s}`;

/* fire plume + side flickers (needleFlames building blocks) */
const PLUME_D =
  "M -22 0 C -24 20 -18 38 -10 56 C -4 74 -2 92 0 108 C 2 92 4 74 10 56 C 18 38 24 20 22 0 Z";
const Plume = ({ fill }: { fill: string }): JSX.Element => (
  <path d={PLUME_D} fill={fill} />
);
const Flickers = ({ fill }: { fill: string }): JSX.Element => (
  <>
    <path d="M -10 -2 C -22 12 -26 26 -20 40 C -15 28 -12 14 -10 -2 Z" fill={fill} />
    <path d="M 10 -2 C 22 12 26 26 20 40 C 15 28 12 14 10 -2 Z" fill={fill} />
  </>
);

/* ruler tick rows (tape-measure) */
const RULER_TICKS: Array<{ x: number; major: boolean }> = (function buildTicks() {
  const x0 = 56;
  const x1 = 1400;
  const n = 35;
  const dx = (x1 - x0) / n;
  const ticks: Array<{ x: number; major: boolean }> = [];
  for (let i = 0; i <= n; i++) ticks.push({ x: f1(x0 + i * dx), major: i % 5 === 0 });
  return ticks;
})();

/** Distant sky: the universe zone of "Paper Seams". */
export function BackgroundLayer(): JSX.Element {
  return (
    <svg
      viewBox="0 0 1440 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible" }}
    >
      {/* sky — deep blue-teal base. Painted past the viewBox bottom (the
       * rect is taller than the canvas; overflow: visible on the svg) so the
       * upward parallax travel never exposes page background behind the
       * departing sheet. */}
      <g data-element="sky">
        <rect width="1440" height="1620" fill={SKY} />
      </g>
      {/* stars — sprinkle of small stars over the upper sky (dropped 60) */}
      <g data-element="stars" transform="translate(0 60)">
        {STAR_FIELD.map(function (star, index): JSX.Element {
          return (
            <circle
              key={index}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill={PALE}
              opacity={star.o}
            />
          );
        })}
      </g>
      {/* moon — big crescent, top right (1281,127) */}
      <g data-element="moon">
        <path
          d="M 1281 127 a 70 70 0 1 0 24 96 a 58 58 0 1 1 -24 -96 Z"
          fill={PALE}
          opacity="0.85"
        />
      </g>
      {/* galaxyDashed — comet-drift galaxy (G5), upper left, tilted -14° */}
      <g data-element="galaxyDashed" transform="translate(-39 60)">
        <g transform="rotate(-14 194 200)">
          <ellipse
            cx="194"
            cy="200"
            rx="104"
            ry="22"
            fill="none"
            stroke={GALAXY}
            strokeWidth="1.4"
            strokeDasharray="8 6"
          />
          <ellipse
            cx="194"
            cy="200"
            rx="44"
            ry="9"
            fill="none"
            stroke={GALAXY}
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <circle cx="194" cy="200" r="3" fill={PALE} opacity="0.7" />
        </g>
        <circle cx="256" cy="229" r="2.45" fill={GALAXY_SOFT} opacity="0.65" />
        <circle cx="212" cy="216" r="2.1" fill={GALAXY_SOFT} opacity="0.55" />
        <circle cx="168" cy="203" r="1.75" fill={GALAXY_SOFT} opacity="0.45" />
        <circle cx="124" cy="190" r="1.4" fill={GALAXY_SOFT} opacity="0.35" />
        <circle cx="80" cy="177" r="1.05" fill={GALAXY_SOFT} opacity="0.25" />
      </g>
      {/* planetOrange — ringed planet setting behind the mountain crest */}
      <g data-element="planetOrange">
        <circle cx="1284" cy="561" r="30" fill={ORANGE} />
        <ellipse
          cx="1284"
          cy="561"
          rx="56"
          ry="16.8"
          fill="none"
          stroke={ORANGE}
          strokeWidth="1.4"
          opacity="0.7"
        />
      </g>
      {/* starBig — eight bigger accent stars across the upper sky */}
      <g data-element="starBig" transform="translate(-7 -12)">
        <circle cx="390" cy="120" r="2.6" fill={PALE} />
        <circle cx="880" cy="90" r="2.6" fill={PALE} />
        <circle cx="180" cy="70" r="3" fill={PALE} />
        <circle cx="640" cy="160" r="2.8" fill={PALE} />
        <circle cx="990" cy="250" r="2.4" fill={PALE} />
        <circle cx="1250" cy="80" r="3" fill={PALE} />
        <circle cx="480" cy="300" r="2.4" fill={PALE} />
        <circle cx="760" cy="380" r="2.6" fill={PALE} />
      </g>
      {/* bigCircle — giant drafting circle + dashed axis, half hidden by the
       * mountains (drawn here in bg, so the mid ridge covers its base) */}
      <g data-element="bigCircle">
        <circle cx="698" cy="380" r="302" fill="none" stroke={CIRCLE_LINE} strokeWidth="1.6" />
        <line
          x1="336"
          y1="380"
          x2="1060"
          y2="380"
          stroke={CIRCLE_LINE}
          strokeWidth="1.2"
          strokeDasharray="7 8"
        />
      </g>
    </svg>
  );
}

/** The mountain separator: two paper-cut bands with stitch perforations. */
export function MidgroundLayer(): JSX.Element {
  return (
    <svg
      viewBox="0 0 1440 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: "visible" }}
    >
      {/* mountains — solid paper-cut band separating the two worlds. The
       * bands close below the viewBox (overflow: visible) so the upward
       * parallax travel never shows their old flat bottom cut mid-air. */}
      <g data-element="mountains">
        <path
          d="M 0 640 L 120 540 L 230 610 L 400 470 L 520 600 L 700 500 L 820 640 L 980 520 L 1120 650 L 1260 560 L 1370 640 L 1440 610 L 1440 1620 L 0 1620 Z"
          fill={MOUNT}
        />
      </g>
      {/* mountainPerforation — dashed stitch line floated above the crest */}
      <g data-element="mountainPerforation">
        <polyline
          points="0,630 120,530 230,600 400,460 520,590 700,490 820,630 980,510 1120,640 1260,550 1370,630 1440,600"
          fill="none"
          stroke={STITCH}
          strokeWidth="2.2"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
      </g>
      {/* mountainCrosses — five × marks on the slopes */}
      <g
        data-element="mountainCrosses"
        fill="none"
        stroke={STITCH}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d={crossPath(123, 588, 6)} />
        <path d={crossPath(395, 510, 6)} />
        <path d={crossPath(695, 545, 6)} />
        <path d={crossPath(975, 565, 6)} />
        <path d={crossPath(1255, 600, 6)} />
      </g>
      {/* mountainsFront — closer, darker second band in front */}
      <g data-element="mountainsFront">
        <path
          d="M 0 690 L 140 610 L 300 680 L 480 590 L 660 670 L 840 600 L 1020 690 L 1200 620 L 1360 700 L 1440 660 L 1440 1620 L 0 1620 Z"
          fill={MOUNT_FRONT}
        />
      </g>
      {/* mountainFrontPerforation — stitch line along the front crest */}
      <g data-element="mountainFrontPerforation">
        <polyline
          points="0,680 140,600 300,670 480,580 660,660 840,590 1020,680 1200,610 1360,690 1440,650"
          fill="none"
          stroke={STITCH}
          strokeWidth="2.2"
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** The sewing world: ground, seam, thread, spool, scissors, rocket-needle. */
export function ForegroundLayer(): JSX.Element {
  return (
    <svg
      viewBox="0 0 1440 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="pfg-blend" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050d10" stopOpacity="0" />
          <stop offset="1" stopColor="#050d10" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* sewingGround — darkest ground band of the sewing world */}
      <g data-element="sewingGround">
        <rect x="0" y="810" width="1440" height="190" fill={GROUND} />
      </g>
      {/* groundSeam — dashed seam along the top edge of the ground */}
      <g data-element="groundSeam">
        <line
          x1="0"
          y1="810"
          x2="1440"
          y2="810"
          stroke={STITCH}
          strokeWidth="2.2"
          strokeDasharray="2 9"
        />
      </g>
      {/* threadRise — thin orange thread from the spool up to the needle's
       * eye; drawn left→right by .px-thread (stroke-dashoffset, see
       * globals.css). pathLength=100 lets one dasharray/offset pair control
       * the whole draw. */}
      <g data-element="threadRise">
        <path
          className="px-thread"
          d="M 760 891 C 877 862 1000 812 1120 760 C 1208 722 1266 694 1280 660"
          pathLength="100"
          strokeDasharray="100"
          fill="none"
          stroke={ORANGE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
      {/* threadFall — the thread continuing out of the eye, falling right
       * and curling on the ground (drawn slightly after the rise) */}
      <g data-element="threadFall">
        <path
          className="px-thread-tail"
          d="M 1280 660 C 1284 700 1294 736 1312 772 C 1330 808 1350 838 1378 856 C 1404 870 1426 878 1422 896 C 1418 914 1386 916 1390 896"
          pathLength="100"
          strokeDasharray="100"
          fill="none"
          stroke={ORANGE}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
      {/* spool — thread spool with orange band (scale 0.81) at (727,891) */}
      <g data-element="spool" transform="translate(727 891) scale(0.81)">
        <rect x="-44" y="-36" width="88" height="10" rx="4" fill={INK} stroke={RIM} strokeWidth="1.4" />
        <rect x="-36" y="-26" width="72" height="52" rx="6" fill={INK} stroke={RIM} strokeWidth="1.6" />
        <rect x="-44" y="26" width="88" height="10" rx="4" fill={INK} stroke={RIM} strokeWidth="1.4" />
        <line x1="-36" y1="0" x2="36" y2="0" stroke={ORANGE} strokeWidth="5" />
      </g>
      {/* scissors — standing on the seam at (295,806), blades open right
       * along the seam as if mid-cut, rim-lit, thin-ringed handles */}
      <g data-element="scissors" transform="translate(295 806) rotate(-2) scale(0.89)">
        <path d="M -21 6 L 210 -30 L 216 -20 L 29.4 12 Z" fill={INK} stroke={RIM} strokeWidth="1.4" />
        <path d="M -21 6 L 210 42 L 216 32 L 29.4 2 Z" fill={INK} stroke={RIM} strokeWidth="1.4" />
        <path
          d="M -58.8 -14 L 0 6 L -58.8 28"
          fill="none"
          stroke={RIM}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="-71.4" cy="-16" r="17" fill={INK} stroke={RIM} strokeWidth="1.6" />
        <circle cx="-71.4" cy="30" r="17" fill={INK} stroke={RIM} strokeWidth="1.6" />
      </g>
      {/* needle — upright mast needle standing ON the seam at (1280,810),
       * tiny eye at (1280,660): reads as a rocket about to lift off */}
      <g data-element="needle" transform="translate(1280 810) scale(0.64)">
        <path
          d="M 6 0 L 2 -240 L 0 -254 L -3 -240 L -6 0 Z"
          fill={INK}
          stroke={RIM}
          strokeWidth="1.8"
        />
        <ellipse
          cx="0"
          cy="-234"
          rx="2.2"
          ry="3.4"
          fill="none"
          stroke={RIM}
          strokeWidth="1.6"
        />
      </g>
      {/* needleFlames — launch flames below the mast base (m1 nested plume:
       * F1 silhouette + two stacked inner plumes), 10% smaller */}
      <g data-element="needleFlames" transform="translate(1280 810) scale(0.9)">
        <Flickers fill={ORANGE} />
        <Plume fill={ORANGE} />
        <g transform="scale(0.72)">
          <Plume fill={ORANGE_DEEP} />
        </g>
        <g transform="scale(0.42)">
          <Plume fill={ORANGE_MID} />
        </g>
      </g>
      {/* buttonOrange — four-hole button, bottom left (79,879) */}
      <g data-element="buttonOrange" transform="translate(79 879)">
        <circle r="30" fill={ORANGE} />
        <line x1="-10" y1="-10" x2="10" y2="10" stroke={GROUND} strokeWidth="3" strokeLinecap="round" />
        <line x1="-10" y1="10" x2="10" y2="-10" stroke={GROUND} strokeWidth="3" strokeLinecap="round" />
        <circle cx="-10" cy="-10" r="4.5" fill={GROUND} />
        <circle cx="10" cy="-10" r="4.5" fill={GROUND} />
        <circle cx="-10" cy="10" r="4.5" fill={GROUND} />
        <circle cx="10" cy="10" r="4.5" fill={GROUND} />
      </g>
      {/* ruler — tape-measure strip along the very bottom (y946–988):
       * rounded ends, hook loop left, ticks from the top edge, orange
       * dashed datum line */}
      <g data-element="ruler">
        <rect x="10" y="946" width="1420" height="42" rx="19" fill={INK} stroke={RIM} strokeWidth="1.8" />
        <circle cx="30" cy="967" r="7" fill="none" stroke={RIM} strokeWidth="3" />
        {RULER_TICKS.map(function (tick): JSX.Element {
          return (
            <line
              key={tick.x}
              x1={tick.x}
              y1="946"
              x2={tick.x}
              y2={f1(946 + (tick.major ? 19.8 : 11))}
              stroke={RIM}
              strokeWidth={tick.major ? 1.92 : 1.2}
            />
          );
        })}
        <line
          x1="56"
          y1="978"
          x2="1400"
          y2="978"
          stroke={ORANGE}
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity="0.8"
        />
      </g>
      {/* seamless blend into the following section */}
      <rect x="0" y="940" width="1440" height="60" fill="url(#pfg-blend)" />
    </svg>
  );
}
