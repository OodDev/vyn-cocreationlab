import { type CSSProperties, type JSX } from "react";

/**
 * PolarisBreathe — the chosen main logo (LOGO-CHOSEN.md; recipe of record:
 * vyn-polaris-breathe.html), site variant:
 *   • stretched 20% vertically — viewBox 480×168, every original y value
 *     × 1.2 (38→45.6, 82→98.4, 122→146.4, 80→96, star field included); the
 *     dots themselves stay circles, only their positions stretch
 *   • dashed edges 25% thinner (strokeWidth 1.5 → 1.125)
 *   • 20% faster choreography — timings live in globals.css (× 0.8)
 *
 * The mark: dashed round-cap edges, a node on every joint, keystone star at
 * (361,96), compass (ring + needle) at the Y-hub (232,98.4), six backdrop
 * glints. Gradient flows white → cyan → azure (#4da3ff) across the mark.
 *
 * Stage map (CSS-driven, see the PolarisBreathe block in globals.css, under
 * the `html[data-splash="on"]` gate):
 *   1  compass enters + radar wave        2  nodes magnetize in, double-bounce,
 *   3  pencil runners meet on keystone    then all keep breathing in sync
 *   4  dashed edges fade in and march forever
 *
 * Perf architecture: the glow is a separate static filtered layer (eglow)
 * so the marching dashes stay crisp; nodes use will-change.
 */

type StarNode = {
  id: string;
  x: number;
  y: number;
  /** Dot size (log: a=5.7, keystone=5.5, small nodes=3, rest=4). */
  r: number;
  /** Fly-in stagger delay, s (recipe × 0.8). */
  d: number;
  /** Off-frame fly-in start offset, px (vertical amounts × 1.2). */
  fx: number;
  fy: number;
  /** The keystone — where the two runners meet on the N diagonal. */
  key?: boolean;
};

/** Edges in the log's exact 8-segment split (keystone is a proper joint).
 * All y values = original × 1.2 (vertical stretch). */
const EDGES: Array<string> = [
  "M52 45.6 L98 146.4 L144 45.6",
  "M144 45.6 L188 45.6 L232 98.4 L276 45.6",
  "M232 98.4 L232 146.4",
  "M276 45.6 L318 45.6",
  "M318 146.4 L318 45.6",
  "M318 45.6 L361 96",
  "M361 96 L404 146.4",
  "M404 146.4 L404 45.6",
];

/** Fly delays: i, j, b (the N right side) lead; the keystone lands last. */
const NODES: Array<StarNode> = [
  { id: "a", x: 52, y: 45.6, r: 5.7, d: 1.2, fx: -36, fy: 0 },
  { id: "b", x: 98, y: 146.4, r: 4, d: 1.41, fx: -30, fy: 31.2 },
  { id: "c", x: 144, y: 45.6, r: 3, d: 1.62, fx: -30, fy: -26.4 },
  { id: "d", x: 188, y: 45.6, r: 4, d: 1.72, fx: -24, fy: -24 },
  { id: "e", x: 276, y: 45.6, r: 4, d: 1.82, fx: 30, fy: -24 },
  { id: "f", x: 318, y: 45.6, r: 4, d: 1.93, fx: 30, fy: -26.4 },
  { id: "g", x: 318, y: 146.4, r: 3, d: 2.14, fx: 26, fy: 36 },
  { id: "h", x: 232, y: 146.4, r: 4, d: 2.03, fx: 0, fy: 36 },
  { id: "i", x: 404, y: 45.6, r: 4, d: 1.3, fx: 36, fy: 0 },
  { id: "j", x: 404, y: 146.4, r: 4, d: 1.51, fx: 30, fy: 31.2 },
  { id: "k", x: 361, y: 96, r: 5.5, d: 2.24, fx: 0, fy: -31.2, key: true },
];

/** Backdrop glints (--sd = fade-in stagger, s). */
const BACKSTARS: Array<{ x: number; y: number; d: number }> = [
  { x: 44, y: 24, d: 0.16 },
  { x: 140, y: 19.2, d: 0.32 },
  { x: 292, y: 16.8, d: 0.48 },
  { x: 430, y: 28.8, d: 0.64 },
  { x: 62, y: 158.4, d: 0.8 },
  { x: 360, y: 158.4, d: 0.96 },
];

/** Runner routes — identical to the pencil trails below them. The left is
 * longer, so it gets the slower duration (0.4s vs 0.208s in CSS). */
const RUN_L =
  "M52 45.6 L98 146.4 L144 45.6 L188 45.6 L232 98.4 L276 45.6 L318 45.6 L361 96";
const RUN_R = "M404 45.6 L404 146.4 L361 96";

const GRAD_ID = "vyn-constellation-grad";

export function VynConstellation(props: {
  /** Sizing/positioning classes (typically `splash-logo ...`). */
  className?: string;
}): JSX.Element {
  return (
    <svg
      viewBox="0 0 480 168"
      className={props.className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={GRAD_ID}
          x1="0"
          y1="0"
          x2="480"
          y2="168"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#4bd0e8" />
          <stop offset="1" stopColor="#4da3ff" />
        </linearGradient>
      </defs>

      {/* Backdrop glints: cyan at 18% (group opacity), drift in staggered. */}
      <g fill="#4bd0e8" opacity={0.18}>
        {BACKSTARS.map((s) => (
          <circle
            key={`bk-${s.x}`}
            className="c-star"
            cx={s.x}
            cy={s.y}
            r={3}
            style={{ "--sd": `${s.d}s` } as CSSProperties}
          />
        ))}
      </g>

      {/* Static glow layer: the same edges under drop-shadow filters, so the
       * blur cost is paid once and the marching dashes above stay crisp.
       * Dash stroke 1.5 → 1.125 (25% thinner). */}
      <g
        className="c-eglow"
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={1.125}
        strokeDasharray="1 5"
        strokeLinecap="round"
      >
        {EDGES.map((d) => (
          <path key={`eg-${d}`} d={d} />
        ))}
      </g>

      {/* The crisp dashed edges (fade in together, march forever). */}
      <g
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={1.125}
        strokeDasharray="1 5"
        strokeLinecap="round"
      >
        {EDGES.map((d) => (
          <path key={`ed-${d}`} className="c-edge" d={d} />
        ))}
      </g>

      {/* Radar wave fired from the hub (animated radius lives in CSS). */}
      <circle
        className="c-wave"
        cx={232}
        cy={98.4}
        r={10}
        stroke={`url(#${GRAD_ID})`}
        strokeWidth={2}
      />

      {/* Pencil trails: white, thin (matching the thinner dashes), drawn at
       * 2.84s, faded out at 4s. */}
      <path
        className="c-guide c-guide-l"
        pathLength={1}
        d={RUN_L}
        stroke="#ffffff"
        strokeWidth={0.6}
        strokeOpacity={0.75}
        strokeLinecap="round"
      />
      <path
        className="c-guide c-guide-r"
        pathLength={1}
        d={RUN_R}
        stroke="#ffffff"
        strokeWidth={0.6}
        strokeOpacity={0.75}
        strokeLinecap="round"
      />

      {/* The 11 constellation stars: fly in, double-bounce, breathe. */}
      <g fill={`url(#${GRAD_ID})`}>
        {NODES.map((n) => (
          <circle
            key={`nd-${n.id}`}
            className={n.key ? "c-node c-key" : "c-node"}
            cx={n.x}
            cy={n.y}
            r={n.r}
            style={
              {
                "--nd": `${n.d}s`,
                "--fx": `${n.fx}px`,
                "--fy": `${n.fy}px`,
              } as CSSProperties
            }
          />
        ))}
      </g>

      {/* Compass at the Y-hub (whole unit at 60% like the recipe). */}
      <g opacity={0.6}>
        <circle
          className="c-ring"
          cx={232}
          cy={98.4}
          r={15}
          stroke={`url(#${GRAD_ID})`}
          strokeWidth={1.5}
        />
        <polygon
          className="c-needle"
          points="232,76.8 236,98.4 232,120 228,98.4"
          fill={`url(#${GRAD_ID})`}
        />
        <circle className="c-hub" cx={232} cy={98.4} r={2.5} fill="#050d10" />
      </g>

      {/* The two pencil runners (offset-path routes live in CSS). */}
      <circle className="c-run c-run-l" r={4} fill="#ffffff" />
      <circle className="c-run c-run-r" r={4} fill="#ffffff" />
    </svg>
  );
}
