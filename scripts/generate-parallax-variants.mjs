/**
 * Generates vyn-parallax-variants.html — ten COMPLETELY different graphic
 * sets for the hero→projects parallax section, each conveying the two
 * concepts: EXPLORATION (universe, galaxies) and TAILORING (sewing, needle,
 * thread). Every set renders the three parallax layers (background /
 * midground / foreground) as stacked SVGs on the site canvas (1440×810).
 *
 * ★ MAIN SET: "Paper Seams" (SET 04b, id v04b-cutpaper-props) — the approved
 *   cut-paper two-worlds composition. All its elements are named entries in
 *   E04 / E04B, assembled via the V04_*_KEYS arrays; the drag editor and the
 *   element catalogue render it too.
 *
 * Deterministic everywhere (fixed seeds) so re-runs give identical output.
 */
import fs from "node:fs";

/* ── helpers ─────────────────────────────────────────────────────────── */
const P = {
  bg: "#050d10",
  deep: "#04121a",
  surface: "#0a161a",
  elev: "#0e1e24",
  line: "#164b53",
  cyan: "#4be1ec",
  cyanDim: "#2bb7c4",
  cyanSoft: "#9ff3f2",
  green: "#45e083",
  ink: "#e9f4f4",
  muted: "#9db3b8",
  faint: "#6d868c",
  blue: "#3b9ec4",
  blueDeep: "#0e3345",
  orange: "#f79c00",
  orange2: "#d9640a",
  amberSoft: "#ffd9a0",
  violet: "#8f7bf0",
  pink: "#e07b9e",
  cream: "#f5efe2",
};

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const f1 = (v) => Number(v.toFixed(1));

/** star sprinkle */
function stars(seed, n, { w = 1440, h = 500, color = P.cyanSoft, rMin = 0.5, rMax = 1.6, oMin = 0.25, oMax = 0.9 } = {}) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < n; i++) {
    out += `<circle cx="${f1(r() * w)}" cy="${f1(r() * h)}" r="${f1(rMin + r() * (rMax - rMin))}" fill="${color}" opacity="${f1(oMin + r() * (oMax - oMin))}"/>`;
  }
  return out;
}

/** spiral curve path (for galaxies) */
function spiralPath(cx, cy, turns, r0, r1, rot = 0, steps = 64) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = rot + t * turns * Math.PI * 2;
    const rr = r0 + (r1 - r0) * t;
    pts.push(`${f1(cx + rr * Math.cos(a))} ${f1(cy + rr * Math.sin(a))}`);
  }
  return `M ${pts.join(" L ")}`;
}

/** dashed-halo ellipse galaxy + spiral curve + core */
function galaxy(cx, cy, rx, ry, rot, color, { haloDash = true, core = true, split = 0.52 } = {}) {
  return `<g fill="none" stroke="${color}" transform="rotate(${f1(rot)} ${cx} ${cy})">
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${haloDash ? `stroke-dasharray="7 6"` : ""}/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx * split}" ry="${ry * split}" ${haloDash ? `stroke-dasharray="4 5"` : ""}/>
    ${core ? `<circle cx="${cx}" cy="${cy}" r="2.6" fill="${color}" stroke="none"/>` : ""}
  </g>`;
}

/** jagged ridge across the canvas.
 *  fmt "points" → "x,y x,y …"   (for <polygon points>/<polyline points>)
 *  fmt "d"      → "M x,y L x,y …" (for path d) */
function ridge(seed, baseY, amp, segments = 14, { w = 1440, fmt = "points" } = {}) {
  const r = rng(seed);
  const pts = [];
  const dx = w / segments;
  for (let i = 0; i <= segments; i++) {
    const crest = i % 2 === 0;
    const y = crest ? baseY - amp * (0.5 + r() * 0.5) : baseY + amp * (0.3 + r() * 0.5);
    pts.push([f1(i * dx), f1(y + (i > 0 && i < segments ? r() * 10 - 5 : 0))]);
  }
  if (fmt === "d") return "M " + pts.map((p) => p.join(",")).join(" L ");
  return pts.map((p) => p.join(",")).join(" ");
}

/** sewing needle drawn along +x from (x,y) rotated by deg */
function needleS(x, y, len, deg, color, { sw = 2, t = 7, fill = "none", glow = "" } = {}) {
  const half = t / 2;
  return `<g transform="translate(${x} ${y}) rotate(${f1(deg)})" ${glow ? `style="filter:${glow}"` : ""}>
    <path d="M0 ${f1(-half)} L${len - 16} ${f1(-half * 0.45)} L${len} 0 L${len - 16} ${f1(half * 0.45)} L0 ${f1(half)} Z" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>
    <ellipse cx="${len - 10}" cy="0" rx="3.6" ry="2" fill="none" stroke="${color}" stroke-width="${Math.max(sw * 0.8, 1)}"/>
  </g>`;
}

/** sewing button: ring + holes */
function button(cx, cy, r, color, { sw = 2, holes = 4, holeColor, fillOpt = "none" } = {}) {
  const d = r * 0.36;
  const hs =
    holes === 4
      ? [
          [-d, -d],
          [d, -d],
          [-d, d],
          [d, d],
        ]
      : [
          [0, -d],
          [0, d],
        ];
  return `<g stroke="${color}" stroke-width="${sw}" fill="none">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillOpt}"/>
    ${hs.map(([hx, hy]) => `<circle cx="${cx + hx}" cy="${cy + hy}" r="${r * 0.14}" stroke="${holeColor ?? color}"/>`).join("")}
  </g>`;
}

/** embroidery hoop: two rings + screw notch */
function hoop(cx, cy, r, color, { sw = 3 } = {}) {
  return `<g fill="none" stroke="${color}" stroke-width="${sw}">
    <circle cx="${cx}" cy="${cy}" r="${r}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.78}"/>
    <rect x="${cx + r - 4}" y="${cy - 7}" width="14" height="14" rx="3"/>
  </g>`;
}

/** open scissors silhouette around (cx,cy); rim = optional edge-light colour */
function scissors(cx, cy, deg, fill, { s = 1, blade = 150, rim } = {}) {
  const edge = rim ?? fill;
  return `<g transform="translate(${cx} ${cy}) rotate(${f1(deg)}) scale(${s})">
    <path d="M${-blade * 0.1} 6 L${blade} -30 L${blade + 6} -20 L${blade * 0.14} 12 Z" fill="${fill}" stroke="${edge}" stroke-width="1.4"/>
    <path d="M${-blade * 0.1} 6 L${blade} 42 L${blade + 6} 32 L${blade * 0.14} 2 Z" fill="${fill}" stroke="${edge}" stroke-width="1.4"/>
    <path d="M${-blade * 0.28} -14 L 0 6 L${-blade * 0.28} 28" fill="none" stroke="${edge}" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="${-blade * 0.34}" cy="-16" r="17" fill="${fill}" stroke="${edge}" stroke-width="1.6"/>
    <circle cx="${-blade * 0.34}" cy="30" r="17" fill="${fill}" stroke="${edge}" stroke-width="1.6"/>
  </g>`;
}

/** cross-stitch × */
const cross = (x, y, s, color, sw = 2.4) =>
  `<path d="M${f1(x - s)} ${f1(y - s)} L${f1(x + s)} ${f1(y + s)} M${f1(x - s)} ${f1(y + s)} L${f1(x + s)} ${f1(y - s)}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;

/** vertical tick row (measuring tape / perforation) */
function ticks(x0, x1, y, n, len, color, { sw = 1.6, every = null } = {}) {
  let out = "";
  const dx = (x1 - x0) / n;
  for (let i = 0; i <= n; i++) {
    const big = every ? i % every === 0 : false;
    const l = big ? len * 1.8 : len;
    out += `<line x1="${f1(x0 + i * dx)}" y1="${f1(y)}" x2="${f1(x0 + i * dx)}" y2="${f1(y + l)}" stroke="${color}" stroke-width="${big ? sw * 1.6 : sw}"/>`;
  }
  return out;
}

/** horizontal measuring-tape strip */
function tape(x, y, len, color, faint, { h = 26, n = 46 } = {}) {
  return `<g>
    <line x1="${x}" y1="${y}" x2="${x + len}" y2="${y}" stroke="${color}" stroke-width="2"/>
    <line x1="${x}" y1="${y + h}" x2="${x + len}" y2="${y + h}" stroke="${color}" stroke-width="2"/>
    ${ticks(x, x + len, y + 4, n, 9, faint, { every: 5 })}
    ${[0, 0.25, 0.5, 0.75, 1].map((t) => `<line x1="${f1(x + len * t)}" y1="${y}" x2="${f1(x + len * t)}" y2="${y + h}" stroke="${color}" stroke-width="2.4"/>`).join("")}
  </g>`;
}

/** knit-chain row of arcs (fabric texture) */
function chains(y, arcW, arcH, n, color, sw, x0 = 0, { opacity = 1 } = {}) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + i * arcW;
    d += `M${f1(x)} ${f1(y)} Q${f1(x + arcW / 2)} ${f1(y - arcH)} ${f1(x + arcW)} ${f1(y)} `;
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" opacity="${opacity}" stroke-linecap="round"/>`;
}

/** stitch-dash seam along a path */
const seam = (d, color, sw, dash = "10 14", cap = "round", opacity = 1) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${dash}" stroke-linecap="${cap}" opacity="${opacity}"/>`;

/** plus-mark grid */
function plusGrid(step, color, { x0 = 0, y0 = 0, x1 = 1440, y1 = 810, s = 3, opacity = 0.5 } = {}) {
  let out = "";
  for (let y = y0; y <= y1; y += step)
    for (let x = x0; x <= x1; x += step)
      out += `<path d="M${x - s} ${y} H${x + s} M${x} ${y - s} V${y + s}" stroke="${color}" stroke-width="1.4" opacity="${opacity}"/>`;
  return out;
}

/* ── each variant: {id, kicker, title, tag, notes, bg, mid, fg} ───────── */

const V = [];

/* ── 01 · Dressmaker blueprint — hairline, single hue on ink ─────────── */
V.push({
  id: "v01-blueprint",
  kicker: "SET 01",
  title: "Dressmaker blueprint",
  tag: "hairline · 1 hue · technical",
  notes:
    "Fine hairline strokes only — the sky becomes a dressmaker's blueprint: dashed galaxies, a measuring-tape strip along the horizon, running-stitch constellations, all in one cyan on near-black.",
  bg: `<rect width="1440" height="810" fill="${P.deep}"/>
    ${stars(11, 90, { rMax: 1.2, oMax: 0.6 })}
    ${galaxy(300, 200, 110, 36, -12, P.cyan)}
    ${galaxy(1120, 140, 74, 24, 8, P.cyan)}
    <circle cx="720" cy="470" r="330" fill="none" stroke="${P.line}" stroke-width="1"/>
    ${ticks(500, 940, 452, 24, 8, P.line, { every: 4 })}
    <path d="${spiralPath(980, 300, 1.6, 6, 54, 0.4)}" fill="none" stroke="${P.faint}" stroke-width="1.2"/>`,
  mid: `${tape(210, 470, 1020, P.cyanDim, P.line, {})}
    ${seam("M 140 380 C 320 330 420 400 590 372 C 760 344 830 260 1010 300 C 1130 326 1210 380 1300 402", P.cyan, 2, "12 16", "round", 0.95)}
    ${[[640, 378], [812, 276], [1010, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${P.cyanSoft}"/>`).join("")}
    ${[[180, 300], [240, 262], [312, 248], [396, 276]]
      .map(([x, y], i, a) => (i ? `<line x1="${a[i - 1][0]}" y1="${a[i - 1][1]}" x2="${x}" y2="${y}" stroke="${P.faint}" stroke-width="1.2"/>` : ""))
      .join("")}
    ${[[180, 300], [240, 262], [312, 248], [396, 276]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${P.cyanSoft}"/>`).join("")}`,
  fg: `<polygon points="${ridge(21, 660, 90, 12, {})} 1440,810 0,810" fill="${P.bg}"/>
    <polyline points="${ridge(21, 660, 90, 12, {})}" fill="none" stroke="${P.line}" stroke-width="1.4"/>
    ${[[180, 655], [420, 618], [690, 640], [940, 615], [1190, 648]].map(([x, y]) => cross(x, y, 6, P.cyanDim, 2)).join("")}
    ${needleS(1020, 700, 240, -18, P.cyan, { sw: 2.4, t: 9, glow: "drop-shadow(0 0 8px rgba(75,225,236,.5))" })}
    ${button(230, 720, 26, P.cyanDim, { sw: 2.2 })}
    ${seam("M 980 706 C 880 706 640 690 480 660", P.cyan, 2.2, "3 9", "round", 0.9)}`,
});

/* ── 02 · Thick neon ribbon — bold strokes, full palette glow ────────── */
V.push({
  id: "v02-thick-ribbon",
  kicker: "SET 02",
  title: "Thick neon ribbon",
  tag: "thick strokes · full palette · glow",
  notes:
    "Everything goes heavy: 6–9px glowing strokes, chunky embroidery hoops flanking a fat gradient ribbon that weaves an S through the scene and dives into the needle on the silhouette ridge.",
  bg: `<defs><radialGradient id="v2orb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${P.cyan}" stop-opacity="0.16"/><stop offset="1" stop-color="${P.cyan}" stop-opacity="0"/></radialGradient>
    <linearGradient id="v2rib" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${P.cyan}"/><stop offset="0.55" stop-color="${P.green}"/><stop offset="1" stop-color="${P.orange}"/></linearGradient></defs>
    <rect width="1440" height="810" fill="${P.bg}"/>
    <ellipse cx="500" cy="260" rx="600" ry="240" fill="url(#v2orb)"/>
    ${stars(12, 110, { rMax: 2.2, rMin: 0.8 })}
    <path d="${spiralPath(1120, 190, 1.8, 8, 66, 0.3)}" fill="none" stroke="${P.cyan}" stroke-width="4" opacity="0.5" stroke-linecap="round"/>
    <circle cx="1120" cy="190" r="5" fill="${P.cyanSoft}"/>`,
  mid: `<polyline points="${ridge(31, 520, 70, 12, {})}" fill="none" stroke="${P.cyanDim}" stroke-width="5" stroke-linejoin="round" opacity="0.75"/>
    <polyline points="${ridge(32, 585, 60, 10, {})}" fill="none" stroke="${P.line}" stroke-width="5" opacity="0.9"/>
    <path d="M 120 240 C 340 150 470 330 700 300 C 930 270 1000 120 1210 190" fill="none" stroke="url(#v2rib)" stroke-width="9" stroke-linecap="round"/>
    <path d="M 120 262 C 340 174 470 352 700 322 C 926 292 998 148 1204 214" fill="none" stroke="url(#v2rib)" stroke-width="1.6" opacity="0.5"/>
    ${hoop(250, 300, 96, P.cyan, { sw: 5 })}
    ${hoop(1160, 330, 74, P.green, { sw: 5 })}
    ${cross(640, 300, 9, P.orange, 3.4)}`,
  fg: `<polygon points="${ridge(33, 672, 96, 10, {})} 1440,810 0,810" fill="#04100f" fill-opacity="0.97"/>
    <polyline points="${ridge(33, 672, 96, 10, {})}" fill="none" stroke="${P.cyan}" stroke-width="7" stroke-linejoin="round" style="filter:drop-shadow(0 0 10px rgba(75,225,236,.55))"/>
    <polygon points="${ridge(34, 745, 70, 10, {})} 1440,810 0,810" fill="#030a0c"/>
    <polyline points="${ridge(34, 745, 70, 10, {})}" fill="none" stroke="${P.green}" stroke-width="6" stroke-linejoin="round" opacity="0.8"/>
    ${needleS(950, 690, 300, 172, P.cyan, { sw: 3, t: 13, glow: "drop-shadow(0 0 12px rgba(247,156,0,.6))" })}
    <path d="M 1010 688 C 1090 646 1180 526 1214 224" fill="none" stroke="url(#v2rib)" stroke-width="8" stroke-linecap="round"/>
    ${button(260, 700, 44, P.cyan, { sw: 4, holes: 4 })}`,
});

/* ── 03 · Strict duotone — blue & orange only, bold solids ───────────── */
V.push({
  id: "v03-duotone",
  kicker: "SET 03",
  title: "Strict duotone (blue + orange)",
  tag: "2 colours · flat solids + dashes",
  notes:
    "Exactly two hues: blue for the universe (planet, rings, ridges) and orange for the tailoring (seam, needle, button, thread loop). No green, no glow — flat and confident.",
  bg: `<rect width="1440" height="810" fill="#041018"/>
    ${stars(41, 120, { color: P.blue, rMax: 2, oMax: 0.8 })}
    <g transform="rotate(14 1080 200)">
      <circle cx="1080" cy="200" r="58" fill="${P.orange}"/>
      <ellipse cx="1080" cy="200" rx="104" ry="30" fill="none" stroke="${P.orange}" stroke-width="3"/>
    </g>
    <g fill="none" stroke="${P.blue}" stroke-width="2" transform="rotate(-10 330 240)">
      <ellipse cx="330" cy="240" rx="120" ry="40" stroke-dasharray="8 8"/>
      <ellipse cx="330" cy="240" rx="64" ry="21" stroke-dasharray="5 7"/>
      <circle cx="330" cy="240" r="4" fill="${P.blue}" stroke="none"/>
    </g>
    <circle cx="330" cy="470" r="210" fill="none" stroke="${P.blueDeep}" stroke-width="3"/>`,
  mid: `<polyline points="${ridge(51, 500, 64, 12, {})}" fill="none" stroke="${P.blue}" stroke-width="5" stroke-linejoin="round"/>
    ${seam("M 80 420 C 300 350 480 452 720 414 C 960 376 1120 300 1370 342", P.orange, 4, "14 12", "round", 0.95)}
    ${ticks(80, 1370, 438, 30, 7, P.blueDeep, { every: 5 })}
    ${needleS(150, 560, 260, -22, P.orange, { sw: 3.5, t: 11, fill: P.orange })}
    <path d="M 400 552 C 520 500 660 470 830 440" fill="none" stroke="${P.orange}" stroke-width="4" stroke-dasharray="1 10" stroke-linecap="round"/>`,
  fg: `<polygon points="${ridge(52, 680, 100, 10, {})} 1440,810 0,810" fill="${P.blueDeep}"/>
    <polyline points="${ridge(52, 680, 100, 10, {})}" fill="none" stroke="${P.blue}" stroke-width="2.6" opacity="0.85"/>
    <path d="M 640 690 C 700 560 900 520 1050 480" fill="none" stroke="${P.orange}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="1054" cy="477" r="7" fill="${P.orange}"/>
    ${button(280, 730, 34, P.orange, { sw: 3.5, holeColor: P.blueDeep })}
    ${cross(880, 720, 9, P.blue, 3.4)}
    ${cross(1120, 700, 9, P.blue, 3.4)}`,
});

/* ── 04 · Cut-paper silhouette — built from NAMED elements ─────────────
   Every graphic piece is a named entry in E04 (set 04) / E04B (its extras).
   The layers are assembled by listing element names in paint order, so any
   piece can be moved or restyled by editing its entry alone. */
// Varied paper-cut skyline (points reused for the fill and its perforation)
const V04_MOUNT =
  "0,640 120,540 230,610 400,470 520,600 700,500 820,640 980,520 1120,650 1260,560 1370,640 1440,610";
// perforation floated 10 units above the crest (user drag offset)
const V04_PERF =
  "0,630 120,530 230,600 400,460 520,590 700,490 820,630 980,510 1120,640 1260,550 1370,630 1440,600";

/** fire plume — F1 teardrop (needleFlames building block) */
const plume = (c) =>
  `<path d="M -22 0 C -24 20 -18 38 -10 56 C -4 74 -2 92 0 108 C 2 92 4 74 10 56 C 18 38 24 20 22 0 Z" fill="${c}"/>`;
/** fire side flickers */
const flickers = (c) =>
  `<path d="M -10 -2 C -22 12 -26 26 -20 40 C -15 28 -12 14 -10 -2 Z" fill="${c}"/>
    <path d="M 10 -2 C 22 12 26 26 20 40 C 15 28 12 14 10 -2 Z" fill="${c}"/>`;

const E04 = {
  /* — universe (above the mountains) — */
  sky: {
    d: "base — deep blue-teal sky covering the whole canvas",
    s: `<rect width="1440" height="1000" fill="#03141c"/>`,
  },
  stars: {
    d: "sprinkle of small stars over the upper sky (y 0–420, dropped 60 units lower total)",
    s: `<g transform="translate(0 60)">${stars(61, 110, { color: "#cfe8ec", rMax: 1.4, oMax: 0.55, h: 420 })}</g>`,
  },
  moon: {
    d: "big crescent moon, top right (≈1281,127)",
    s: `<path d="M 1281 127 a 70 70 0 1 0 24 96 a 58 58 0 1 1 -24 -96 Z" fill="#cfe8ec" opacity="0.85"/>`,
  },
  galaxyDashed: {
    d: "comet-drift galaxy (G5): elongated dashed ellipses tilted -14° at (194,200) with a pale core and a fading dot chain drifting below-left through the body",
    s: `<g transform="translate(-39 60)"><g transform="rotate(-14 194 200)">
      <ellipse cx="194" cy="200" rx="104" ry="22" fill="none" stroke="#3a5a64" stroke-width="1.4" stroke-dasharray="8 6"/>
      <ellipse cx="194" cy="200" rx="44" ry="9" fill="none" stroke="#3a5a64" stroke-width="1.2" stroke-dasharray="4 6"/>
      <circle cx="194" cy="200" r="3" fill="#cfe8ec" opacity="0.7"/>
    </g><circle cx="256" cy="229" r="2.45" fill="#58828d" opacity="0.65"/><circle cx="212" cy="216" r="2.1" fill="#58828d" opacity="0.55"/><circle cx="168" cy="203" r="1.75" fill="#58828d" opacity="0.45"/><circle cx="124" cy="190" r="1.4" fill="#58828d" opacity="0.35"/><circle cx="80" cy="177" r="1.05" fill="#58828d" opacity="0.25"/></g>`,
  },
  galaxySpiral: {
    off: true,
    d: "small spiral galaxy line, centre (620,330)",
    s: `<path d="${spiralPath(620, 330, 2.2, 3, 34, 0.5)}" fill="none" stroke="#3a5a64" stroke-width="1.2"/>`,
  },
  planetOrange: {
    d: "orange planet with ring at (1284,561), ~87% bigger than the original (r 30), set behind the mountain crest",
    s: `<circle cx="1284" cy="561" r="30" fill="${P.orange}"/>
    <ellipse cx="1284" cy="561" rx="56" ry="16.8" fill="none" stroke="${P.orange}" stroke-width="1.4" opacity="0.7"/>`,
  },
  starBig: {
    d: "bigger accent stars scattered across the upper sky (8×), nudged (-7,-12) total",
    s: `<g transform="translate(-7 -12)"><circle cx="390" cy="120" r="2.6" fill="#cfe8ec"/><circle cx="880" cy="90" r="2.6" fill="#cfe8ec"/>
    <circle cx="180" cy="70" r="3" fill="#cfe8ec"/><circle cx="640" cy="160" r="2.8" fill="#cfe8ec"/>
    <circle cx="990" cy="250" r="2.4" fill="#cfe8ec"/><circle cx="1250" cy="80" r="3" fill="#cfe8ec"/>
    <circle cx="480" cy="300" r="2.4" fill="#cfe8ec"/><circle cx="760" cy="380" r="2.6" fill="#cfe8ec"/></g>`,
  },
  bigCircle: {
    d: "big measuring circle around the mountains, centred (698,380) r302, with a dashed horizontal axis through its middle extending 20% of the diameter beyond each side (x 336→1060) — drawn behind them, so the mountain band hides its lower half (borrowed from SET 01)",
    s: `<circle cx="698" cy="380" r="302" fill="none" stroke="#2e5a66" stroke-width="1.6"/>
    <line x1="336" y1="380" x2="1060" y2="380" stroke="#2e5a66" stroke-width="1.2" stroke-dasharray="7 8"/>`,
  },
  shootingStar: {
    off: true,
    d: "dotted shooting-star arc, left (180→360, y≈350)",
    s: `<path d="M 180 380 C 240 350 300 342 360 346" fill="none" stroke="#58828d" stroke-width="1.4" stroke-dasharray="1 7" stroke-linecap="round"/>`,
  },

  /* — mountains (the separator) — */
  mountains: {
    d: "solid paper-cut mountain band separating the two worlds (crest y≈470–650, fills down to y810)",
    s: `<path d="M ${V04_MOUNT.replace(/ /g, " L ")} L 1440 810 L 0 810 Z" fill="#08222c"/>`,
  },
  mountainPerforation: {
    d: "dashed stitch perforation floated 10 units above the mountain crest",
    s: `<polyline points="${V04_PERF}" fill="none" stroke="#3f7280" stroke-width="2.2" stroke-dasharray="2 9" stroke-linecap="round"/>`,
  },
  mountainCrosses: {
    d: "five × marks on the mountain slopes (nudged 5 left by user drag)",
    s: [[123, 568], [395, 510], [695, 545], [975, 565], [1255, 600]].map(([x, y]) => cross(x, y, 6, "#3f7280", 2)).join(""),
  },
  mountainsFront: {
    d: "second paper-cut mountain band IN FRONT of the main one — closer, gentler crest (y≈590–700), darker tone",
    s: `<path d="M 0 690 L 140 610 L 300 680 L 480 590 L 660 670 L 840 600 L 1020 690 L 1200 620 L 1360 700 L 1440 660 L 1440 810 L 0 810 Z" fill="#061c26"/>`,
  },
  mountainFrontPerforation: {
    d: "dashed stitch perforation along the front ridge crest, floated 10 units above it — same style as the main mountain's perforation",
    s: `<polyline points="0,680 140,600 300,670 480,580 660,660 840,590 1020,680 1200,610 1360,690 1440,650" fill="none" stroke="#3f7280" stroke-width="2.2" stroke-dasharray="2 9" stroke-linecap="round"/>`,
  },
  planetPeek: {
    off: true,
    d: "tiny dashed planet peeking in front of the ridge, right (1180,730)",
    s: `<g transform="rotate(16 1180 730)"><ellipse cx="1180" cy="730" rx="34" ry="11" fill="none" stroke="#2e5a66" stroke-width="1.6" stroke-dasharray="3 6"/><circle cx="1180" cy="730" r="3" fill="#2e5a66"/></g>`,
  },

  /* — sewing world (below the mountains) — */
  sewingGround: {
    d: "darkest ground band of the sewing world (y810–1000)",
    s: `<rect x="0" y="810" width="1440" height="190" fill="#021016"/>`,
  },
  groundSeam: {
    d: "dashed seam line marking the top edge of the sewing ground (y810)",
    s: `<line x1="0" y1="810" x2="1440" y2="810" stroke="#3f7280" stroke-width="2.2" stroke-dasharray="2 9"/>`,
  },
  groundCrosses: {
    off: true,
    d: "three × marks on the sewing ground (220,930) (900,970) (1330,950)",
    s: [[220, 930], [900, 970], [1330, 950]].map(([x, y]) => cross(x, y, 8, "#3a5a64", 2.8)).join(""),
  },
  stitchLine: {
    off: true,
    d: "faint dotted stitch line above the tape measure (y≈920–940)",
    s: seam("M 60 934 C 400 920 800 940 1380 928", "#9fd8e0", 1.4, "3 8", "round", 0.5),
  },
  threadLoose: {
    off: true,
    d: "loose dotted orange thread end trailing under the main thread",
    s: `<path d="M 700 905 C 820 950 960 968 1120 972" fill="none" stroke="${P.orange}" stroke-width="1.8" stroke-linecap="round" opacity="0.5" stroke-dasharray="1 8"/>`,
  },
  thread: {
    d: "orange thread, thin: single line from the spool (760,891) rising to the mast needle's eye (1280,660); a second, smaller thread falls from the eye to the RIGHT and curls on the ground, kept inside the frame",
    s: `<path d="M 760 891 C 877 862 1000 812 1120 760 C 1208 722 1266 694 1280 660" fill="none" stroke="${P.orange}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M 1280 660 C 1284 700 1294 736 1312 772 C 1330 808 1350 838 1378 856 C 1404 870 1426 878 1422 896 C 1418 914 1386 916 1390 896" fill="none" stroke="${P.orange}" stroke-width="1.6" stroke-linecap="round"/>`,
  },
  spool: {
    d: "thread spool with orange band (small: scale 0.81), centre-bottom (727,891)",
    s: `<g transform="translate(727 891) scale(0.81)">
      <rect x="-44" y="-36" width="88" height="10" rx="4" fill="#04161d" stroke="#7fb0bc" stroke-width="1.4"/>
      <rect x="-36" y="-26" width="72" height="52" rx="6" fill="#04161d" stroke="#7fb0bc" stroke-width="1.6"/>
      <rect x="-44" y="26" width="88" height="10" rx="4" fill="#04161d" stroke="#7fb0bc" stroke-width="1.4"/>
      <line x1="-36" y1="0" x2="36" y2="0" stroke="${P.orange}" stroke-width="5"/>
    </g>`,
  },
  scissors: {
    d: "standing scissors (15% smaller: 0.89× of the 1.05 baseline) at (295,806), blades open right along the ground seam (y810) as if mid-cut, rim-lit",
    s: `<g transform="translate(295 806) rotate(-2) scale(0.89)">
      ${scissors(0, 0, 0, "#04161d", { blade: 210, rim: "#7fb0bc" })}
    </g>`,
  },
  needle: {
    d: "upright mast needle (N4, mirrored, 20% smaller again → 0.64×): standing exactly ON the ground seam at (1280,810), body rising ~163 units, tiny eye at (1280,660)",
    s: `<g transform="translate(1280 810) scale(0.64)">
      <path d="M 6 0 L 2 -240 L 0 -254 L -3 -240 L -6 0 Z" fill="#04161d" stroke="#7fb0bc" stroke-width="1.8"/>
      <ellipse cx="0" cy="-234" rx="2.2" ry="3.4" fill="none" stroke="#7fb0bc" stroke-width="1.6"/>
    </g>`,
  },
  needleFlames: {
    d: "launch flames below the needle-rocket base — m1 nested variant (F1 silhouette + two stacked inner plumes) at 10% smaller, tip far above the ruler",
    s: `<g transform="translate(1280 810) scale(0.9)">
      ${flickers(P.orange)}
      ${plume(P.orange)}
      <g transform="scale(0.72)">${plume("#d9640a")}</g>
      <g transform="scale(0.42)">${plume("#c05008")}</g>
    </g>`,
  },
};

/* extras only used by SET 04b */
const E04B = {
  buttonOrange: {
    d: "orange four-hole button with dark thread cross, bottom left (79,879)",
    s: `<g transform="translate(79 879)">
      <circle r="30" fill="${P.orange}"/>
      <line x1="-10" y1="-10" x2="10" y2="10" stroke="#021016" stroke-width="3" stroke-linecap="round"/>
      <line x1="-10" y1="10" x2="10" y2="-10" stroke="#021016" stroke-width="3" stroke-linecap="round"/>
      <circle cx="-10" cy="-10" r="4.5" fill="#021016"/>
      <circle cx="10" cy="-10" r="4.5" fill="#021016"/>
      <circle cx="-10" cy="10" r="4.5" fill="#021016"/>
      <circle cx="10" cy="10" r="4.5" fill="#021016"/>
    </g>`,
  },
  ruler: {
    d: "tape-measure ruler (R2): rounded-end strip inset at y946–988, metal hook loop at the left end, ticks from the top edge, orange dashed datum line",
    s: `<g>
      <rect x="10" y="946" width="1420" height="42" rx="19" fill="#04161d" stroke="#7fb0bc" stroke-width="1.8"/>
      <circle cx="30" cy="967" r="7" fill="none" stroke="#7fb0bc" stroke-width="3"/>
      ${ticks(56, 1400, 946, 35, 11, "#7fb0bc", { sw: 1.2, every: 5 })}
      <line x1="56" y1="978" x2="1400" y2="978" stroke="${P.orange}" stroke-width="2" stroke-dasharray="6 6" opacity="0.8"/>
    </g>`,
  },
};

/** join named elements in paint order */
const pick = (E, ...keys) => keys.map((k) => E[k].s).join("\n    ");

/* the exact composition of SET 04b (single source of truth, also used by the drag editor) */
const V04_BG_KEYS = ["sky", "stars", "moon", "galaxyDashed", "planetOrange", "starBig", "bigCircle"];
const V04_MID_KEYS = ["mountains", "mountainPerforation", "mountainCrosses", "mountainsFront", "mountainFrontPerforation"];
const V04_FG_KEYS = ["sewingGround", "groundSeam", "thread", "spool", "scissors", "needle"];
const V04B_FG_KEYS = [...V04_FG_KEYS, "needleFlames", "buttonOrange", "ruler"];

const v04 = {
  id: "v04-cutpaper",
  kicker: "SET 04",
  title: "Cut-paper silhouette — two worlds",
  tag: "solid silhouette · perforated edges · 1 orange accent · two separate zones",
  notes:
    "A tall split composition: the UNIVERSE lives entirely above the ridge (crescent moon, dashed galaxies, sprinkle stars, one orange planet); the SEWING world lives entirely below it (standing scissors, a needle driven into the ground, spool and orange thread). The solid paper mountain band separates them, perforated along its crest.",
  vb: "0 0 1440 1000",
  ratio: "1440/1000",
  bg: pick(E04, ...V04_BG_KEYS),
  mid: pick(E04, ...V04_MID_KEYS),
  fg: pick(E04, ...V04_FG_KEYS),
};
V.push(v04);

/* ── 04b · same set + ruler & button props ─────────────────────────────
   ★ MAIN SET — canonical artwork, referenced by name as "Paper Seams"
   (id v04b-cutpaper-props). Every element is a named entry in E04 / E04B;
   the composition is the V04_*_KEYS arrays in paint order. */
V.push({
  ...v04,
  id: "v04b-cutpaper-props",
  name: "Paper Seams",
  main: true,
  kicker: "SET 04b",
  title: "Cut-paper two worlds + ruler & button",
  tag: "same as 04 · ruler along the very bottom · orange button bottom-left",
  notes:
    "Identical to SET 04, plus two tailoring props: a pale-outlined measuring ruler running along the very bottom edge (major/minor ticks), and an orange four-hole button resting on the bottom left.",
  fg: V04B_FG_KEYS.map((k) => E04[k] ?? E04B[k]).map((e) => e.s).join("\n    "),
});

/* ── 05 · Painterly nebula — airy gradients, spray stars ─────────────── */
V.push({
  id: "v05-nebula",
  kicker: "SET 05",
  title: "Painterly nebula",
  tag: "colourful · soft gradients · airy",
  notes:
    "Gas clouds in full colour — violet, teal and ember nebulas layered over spray stars. Hills are translucent gradient bands; a fine thread and a single needle glint keep the tailoring note quiet.",
  bg: `<defs>
    <radialGradient id="v5a"><stop offset="0" stop-color="${P.violet}" stop-opacity="0.34"/><stop offset="0.6" stop-color="${P.violet}" stop-opacity="0.08"/><stop offset="1" stop-color="${P.violet}" stop-opacity="0"/></radialGradient>
    <radialGradient id="v5b"><stop offset="0" stop-color="${P.green}" stop-opacity="0.22"/><stop offset="1" stop-color="${P.green}" stop-opacity="0"/></radialGradient>
    <radialGradient id="v5c"><stop offset="0" stop-color="${P.pink}" stop-opacity="0.26"/><stop offset="1" stop-color="${P.pink}" stop-opacity="0"/></radialGradient></defs>
    <rect width="1440" height="810" fill="#060d15"/>
    <ellipse cx="350" cy="230" rx="430" ry="220" fill="url(#v5a)"/>
    <ellipse cx="1060" cy="300" rx="380" ry="200" fill="url(#v5b)"/>
    <ellipse cx="760" cy="150" rx="300" ry="140" fill="url(#v5c)"/>
    ${stars(81, 200, { rMax: 1.8, oMax: 0.85 })}
    ${stars(82, 26, { color: "#ffffff", rMax: 2.6, rMin: 1.6, oMax: 0.95 })}
    <path d="M 90 420 C 260 300 460 470 620 400 C 760 340 830 240 990 260" fill="none" stroke="${P.ink}" stroke-width="1.4" opacity="0.65" stroke-dasharray="1 7" stroke-linecap="round"/>
    <ellipse cx="540" cy="380" rx="4" ry="4" fill="#ffffff"/><ellipse cx="608" cy="408" rx="3.4" ry="3.4" fill="#ffffff" opacity="0.8"/>`,
  mid: `<defs><linearGradient id="v5mh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f3542" stop-opacity="0.9"/><stop offset="1" stop-color="#071c26" stop-opacity="0.4"/></linearGradient></defs>
    <path d="${ridge(91, 520, 84, 12, { fmt: "d" })} L 1440 660 L 0 660 Z" fill="url(#v5mh)"/>
    ${seam("M 120 480 C 340 420 520 500 760 452 C 1000 404 1180 430 1330 470", P.cream, 1.6, "1 9", "round", 0.8)}
    ${[[120, 480], [340, 428], [620, 470], [900, 440], [1180, 442]].map(([x, y]) => `<circle cx="${x}" cy="${f1(y - 6)}" r="2.4" fill="#ffffff" opacity="0.8"/>`).join("")}`,
  fg: `<defs>
    <linearGradient id="v5f1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a2430"/><stop offset="1" stop-color="#050d10" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="v5f2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#061820"/><stop offset="1" stop-color="#050d10"/></linearGradient></defs>
    <path d="${ridge(92, 648, 70, 12, { fmt: "d" })} L 1440 760 L 0 760 Z" fill="url(#v5f1)"/>
    <path d="${ridge(93, 726, 52, 12, { fmt: "d" })} L 1440 810 L 0 810 Z" fill="url(#v5f2)"/>
    ${needleS(1050, 700, 230, -16, "#bfe7ec", { sw: 1.6, t: 7 })}
    <path d="M 1040 690 l 20 -12 m -10 22 l 16 -20 m -34 2 l 28 -28" stroke="#ffffff" stroke-width="1.4" opacity="0.9" fill="none"/>
    <path d="M 1046 692 C 900 660 700 640 560 650" fill="none" stroke="${P.cream}" stroke-width="1.2" opacity="0.55" stroke-dasharray="1 6"/>`,
});

/* ── 06 · Flat poster geometry — playful mid-century space ───────────── */
V.push({
  id: "v06-poster",
  kicker: "SET 06",
  title: "Flat poster geometry",
  tag: "flat fills · zero glow · poster",
  notes:
    "Mid-century space-poster language: solid planets, dotted orbits, chunky 4-point sparks — tailoring shrunk to bold iconic props (a giant flat needle monolith, a thread wrap, a button).",
  bg: `<rect width="1440" height="810" fill="#07161d"/>
    <circle cx="1120" cy="210" r="64" fill="${P.orange}"/>
    <path d="M 1120 146 a 64 64 0 0 0 0 128 Z" fill="#c87900"/>
    <ellipse cx="1120" cy="210" rx="118" ry="26" fill="none" stroke="${P.orange}" stroke-width="4"/>
    <circle cx="320" cy="180" r="34" fill="${P.blue}"/><circle cx="308" cy="170" r="9" fill="#07161d"/>
    ${[[180, 340], [520, 120], [880, 90], [1330, 380], [700, 250]]
      .map(
        ([x, y]) =>
          `<path d="M${x} ${y - 14} L${x + 4} ${y - 4} L${x + 14} ${y} L${x + 4} ${y + 4} L${x} ${y + 14} L${x - 4} ${y + 4} L${x - 14} ${y} L${x - 4} ${y - 4} Z" fill="${P.cream}"/>`,
      )
      .join("")}
    <ellipse cx="720" cy="430" rx="330" ry="34" fill="none" stroke="${P.cyanDim}" stroke-width="2" stroke-dasharray="3 14"/>`,
  mid: `<path d="${ridge(101, 540, 46, 8, { fmt: "d" })} L 1440 600 L 0 600 Z" fill="#0e2a33"/>
    ${needleS(880, 300, 330, 58, P.cream, { sw: 0, t: 18, fill: P.cream })}
    <circle cx="1178" cy="468" r="9" fill="#07161d"/>
    <path d="M 902 372 C 1060 420 1200 470 1276 470" fill="none" stroke="${P.orange}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="300" cy="470" r="48" fill="${P.orange}"/>
    <circle cx="284" cy="454" r="7" fill="#0e2a33"/><circle cx="316" cy="454" r="7" fill="#0e2a33"/><circle cx="284" cy="486" r="7" fill="#0e2a33"/><circle cx="316" cy="486" r="7" fill="#0e2a33"/>
    <path d="M 340 500 Q 420 520 500 505" fill="none" stroke="${P.cream}" stroke-width="8" stroke-linecap="round"/>`,
  fg: `<path d="${ridge(102, 660, 66, 8, { fmt: "d" })} L 1440 740 L 0 740 Z" fill="#123c48"/>
    <path d="${ridge(103, 736, 44, 8, { fmt: "d" })} L 1440 810 L 0 810 Z" fill="#0b2933"/>
    <path d="M 540 796 Q 640 700 760 780" fill="none" stroke="${P.orange}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="764" cy="778" r="8" fill="${P.orange}"/>
    ${[[250, 764], [1150, 770]].map(([x, y]) => cross(x, y, 10, P.cream, 4)).join("")}`,
});

/* ── 07 · Star-atlas engraving — dense hatching, double hairlines ────── */
V.push({
  id: "v07-atlas",
  kicker: "SET 07",
  title: "Star-atlas engraving",
  tag: "hairline ×2 · hatching · antique",
  notes:
    "An etched celestial atlas: dense micro-stars, concentric orbit rings, double-line ridges with X-hatch 'quilting' inside, and a needle so thin it could be drawn with one hair.",
  bg: `<rect width="1440" height="810" fill="#040f15"/>
    ${stars(111, 260, { rMax: 1, rMin: 0.4, oMax: 0.65 })}
    <g fill="none" stroke="#2a5661" stroke-width="1">
      <ellipse cx="1050" cy="240" rx="300" ry="70"/><ellipse cx="1050" cy="240" rx="240" ry="56"/><ellipse cx="1050" cy="240" rx="180" ry="42"/><ellipse cx="1050" cy="240" rx="120" ry="28"/><ellipse cx="1050" cy="240" rx="60" ry="15"/>
      <circle cx="1050" cy="240" r="3" fill="${P.cyanSoft}" stroke="none"/>
    </g>
    <path d="${spiralPath(420, 260, 2, 4, 60, 1.2, 90)}" fill="none" stroke="#3a6a75" stroke-width="1"/>
    <path d="${spiralPath(420, 260, 2, 8, 64, 1.1, 90)}" fill="none" stroke="#3a6a75" stroke-width="1"/>
    <rect x="0" y="500" width="1440" height="60" fill="none" stroke="#2a5661" stroke-width="1"/>
    ${ticks(0, 1440, 508, 72, 10, "#2a5661", { every: 6 })}`,
  mid: `<path d="M 130 395 l 62 -14 m 8 -6 l 50 -8" stroke="#58828d" stroke-width="1.2" fill="none"/>
    <path d="M 1210 330 l 66 -10 m 6 -6 l 46 -12" stroke="#58828d" stroke-width="1.2" fill="none"/>
    <path d="M 620 330 l 40 10 m 8 2 l 36 6" stroke="#58828d" stroke-width="1.2" fill="none"/>
    ${[[130, 395], [620, 330], [1210, 330]]
      .map(
        ([x, y], i) =>
          `<g fill="none" stroke="#7aa7b0" stroke-width="1.1"><circle cx="${x}" cy="${y}" r="5"/><circle cx="${x}" cy="${y}" r="9" stroke-dasharray="2 3"/></g>` +
          (i < 2 ? `<line x1="${x}" y1="${y}" x2="${i === 0 ? 620 : 1210}" y2="330" stroke="#3a6a75" stroke-width="1"/>` : ""),
      )
      .join("")}
    ${seam("M 90 560 C 360 520 620 560 880 520 C 1120 484 1300 520 1430 545", P.cyan, 1.4, "7 8", "butt", 0.9)}`,
  fg: `<g fill="none" stroke="#2a5661" stroke-width="1.2">
    <polyline points="${ridge(121, 665, 60, 16, {})}"/>
    <polyline points="${ridge(122, 673, 60, 16, {})}"/>
  </g>
  ${[0.08, 0.18, 0.3, 0.42, 0.55, 0.68, 0.8, 0.92].map((t) => cross(f1(90 + 1260 * t), f1(700 + 14 * Math.sin(t * 9)), 5, "#20414a", 1.1)).join("")}
  <path d="${ridge(123, 756, 40, 14, { fmt: "d" })} L 1440 810 L 0 810 Z" fill="#030d12"/>
  ${needleS(1080, 740, 260, -14, "#9cc5cd", { sw: 1.1, t: 5 })}
  ${seam("M 1076 736 C 940 720 800 706 700 700", "#cfe8ec", 1, "4 6", "round", 0.8)}`,
});

/* ── 08 · Plotter / vinyl-cutter — grids, tick skyline, cut line ─────── */
V.push({
  id: "v08-plotter",
  kicker: "SET 08",
  title: "Plotter / vinyl-cutter",
  tag: "plus grid · scanframe · 1 orange accent",
  notes:
    "The look of a cutting plotter: a full plus-mark grid, barcode-like tick skylines, a dotted spiral of cutting nodes — and the dashed 'cut here' line running straight into the scissors.",
  bg: `<rect width="1440" height="810" fill="#030e13"/>
    ${plusGrid(90, "#14424c", { opacity: 0.55 })}
    ${stars(141, 40, { rMax: 1.2, oMax: 0.5 })}
    <rect x="60" y="80" width="1320" height="640" fill="none" stroke="#1d4f58" stroke-width="1.2" stroke-dasharray="10 8"/>
    <circle cx="1120" cy="200" r="74" fill="none" stroke="#2a5c66" stroke-width="1.6" stroke-dasharray="4 6"/>
    <path d="${spiralPath(420, 250, 2.4, 6, 70, 0.2)}" fill="none" stroke="#3d7a86" stroke-width="1.8"/>
    ${[0.15, 0.45, 0.75, 1].map((t) => { const r = 6 + 64 * t; return `<rect x="${f1(420 + r * 0.7)}" y="${f1(250 + r * -0.6)}" width="5" height="5" fill="${P.cyan}"/>`; }).join("")}`,
  mid: `${[520, 560, 600, 640].map((y, i) => `<line x1="0" y1="${y}" x2="1440" y2="${y}" stroke="#2a5c66" stroke-width="${i === 1 ? 2 : 1.2}" opacity="${(0.8 - i * 0.12).toFixed(2)}"/>`).join("")}
    ${ticks(0, 1440, 520, 120, 10.8, "#2a5c66", { every: 2 })}
    ${seam("M 40 470 C 300 430 520 470 760 440 C 960 414 1160 420 1400 444", P.orange, 2, "12 10", "butt", 0.95)}
    <g transform="translate(1150 452) rotate(6)"><path d="M0 0 L74 -16 L76 -10 L4 8 Z" fill="${P.orange}"/><path d="M0 2 L74 20 L76 14 L4 -2 Z" fill="${P.orange}"/><circle cx="-10" cy="-9" r="6" fill="none" stroke="${P.orange}" stroke-width="3.4"/><circle cx="-10" cy="13" r="6" fill="none" stroke="${P.orange}" stroke-width="3.4"/></g>`,
  fg: `${Array.from({ length: 56 }, (_, i) => {
    const r = rng(500 + i);
    const x = i * 26 + 4;
    const h = 40 + Math.abs(28 * Math.sin(i * 0.6)) + r() * 26;
    return `<rect x="${x}" y="${f1(810 - h)}" width="12" height="${f1(h)}" fill="#0a2e38"/>`;
  }).join("")}
    <line x1="0" y1="810" x2="1440" y2="810" stroke="${P.cyan}" stroke-width="2" opacity="0.6"/>
    <rect x="620" y="700" width="9" height="9" fill="${P.orange}"/>`,
});

/* ── 09 · Cosmic cobalt & amber — deep blues, thread is the star ─────── */
V.push({
  id: "v09-cobalt-amber",
  kicker: "SET 09",
  title: "Cosmic cobalt & amber",
  tag: "2 colours · deep gradients · luminous thread",
  notes:
    "All blues build the cosmos; a single luminous AMBER thread carries the whole story — coiling into a loose knot-galaxy mid-sky, then falling to the needle waiting on the ridge.",
  bg: `<defs>
    <radialGradient id="v9dome" cx="0.5" cy="0.68" r="0.9"><stop offset="0" stop-color="#124a66"/><stop offset="0.5" stop-color="#0a2c40"/><stop offset="1" stop-color="#040d14"/></radialGradient>
    <radialGradient id="v9amber"><stop offset="0" stop-color="${P.orange}" stop-opacity="0.3"/><stop offset="1" stop-color="${P.orange}" stop-opacity="0"/></radialGradient></defs>
    <rect width="1440" height="810" fill="url(#v9dome)"/>
    ${stars(151, 150, { color: "#bfe3ff", rMax: 1.8, oMax: 0.75 })}
    <g fill="none" stroke="#2a6a8d" stroke-width="1.4"><ellipse cx="260" cy="200" rx="130" ry="34" stroke-dasharray="8 7"/><ellipse cx="260" cy="200" rx="70" ry="18" stroke-dasharray="5 6"/></g>
    <path d="M 640 320 C 560 220 700 150 780 210 C 860 270 800 380 900 400 C 1000 420 1060 330 1010 250 C 960 170 830 170 810 250" fill="none" stroke="${P.orange}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
    <ellipse cx="850" cy="280" rx="240" ry="150" fill="url(#v9amber)"/>`,
  mid: `<polyline points="${ridge(161, 500, 60, 12, {})}" fill="none" stroke="#2a6a8d" stroke-width="2.4" opacity="0.9"/>
    <path d="M 660 330 C 760 380 900 430 1030 460" fill="none" stroke="${P.orange}" stroke-width="6" stroke-linecap="round" opacity="0.95" style="filter:drop-shadow(0 0 9px rgba(247,156,0,.6))"/>
    ${ticks(120, 1320, 512, 40, 6, "#164b5e", { every: 4 })}`,
  fg: `<polygon points="${ridge(162, 690, 84, 10, {})} 1440,810 0,810" fill="#061824"/>
    <polyline points="${ridge(162, 690, 84, 10, {})}" fill="none" stroke="#0d3a52" stroke-width="3"/>
    <polygon points="${ridge(163, 762, 50, 10, {})} 1440,810 0,810" fill="#03101b"/>
    <polyline points="${ridge(163, 762, 50, 10, {})}" fill="none" stroke="${P.orange}" stroke-width="2.4" opacity="0.75" style="filter:drop-shadow(0 0 6px rgba(247,156,0,.5))"/>
    ${needleS(1010, 712, 240, -16, P.orange, { sw: 2.4, t: 9, glow: "drop-shadow(0 0 10px rgba(247,156,0,.7))" })}
    <path d="M 1004 700 C 900 640 760 500 700 380" fill="none" stroke="${P.orange}" stroke-width="2.6" opacity="0.8"/>
    ${[[300, 716], [560, 736]].map(([x, y]) => cross(x, y, 7, "#0d3a52", 2.6)).join("")}`,
});

/* ── 10 · Knitted hills tapestry — chain-stitch world, colour ────────── */
V.push({
  id: "v10-tapestry",
  kicker: "SET 10",
  title: "Knitted-hills tapestry",
  tag: "chain-stitch texture · full palette · cosy",
  notes:
    "The hills are knitted: rows of chain-stitch arcs make fabric ridges, cross-stitch stars replace points of light, a swirl galaxy is drawn in dashed rings — the needle sticks in the front hill like a mast, thread flying back to the sky.",
  bg: `<rect width="1440" height="810" fill="#071820"/>
    <g fill="none" stroke="${P.cyanSoft}" stroke-width="1.8">
      <ellipse cx="1060" cy="200" rx="120" ry="44" stroke-dasharray="10 9"/><ellipse cx="1060" cy="200" rx="76" ry="28" stroke-dasharray="7 7"/><ellipse cx="1060" cy="200" rx="36" ry="13" stroke-dasharray="4 5"/>
    </g>
    <circle cx="1060" cy="200" r="4" fill="${P.cream}"/>
    ${stars(171, 70, { rMax: 1.6, oMax: 0.7 })}
    ${[0.1, 0.3, 0.55, 0.75, 0.9].map((t) => cross(90 + 1280 * t, 180 + 160 * Math.sin(t * 7), 6, P.green, 2.2)).join("")}`,
  mid: `<path d="${ridge(181, 520, 60, 10, { fmt: "d" })} L 1440 620 L 0 620 Z" fill="#0e2a33"/>
    ${[0, 1, 2, 3].map((row) => chains(505 + row * 12, 34, 10, 44, row % 2 ? P.cyanDim : "#1d5a68", 2.4, 0, { opacity: 0.8 - row * 0.08 })).join("")}
    <path d="M 210 470 C 420 400 640 470 860 420 C 1040 380 1200 400 1330 430" fill="none" stroke="${P.orange}" stroke-width="4" stroke-linecap="round"/>
    <path d="M 210 482 C 420 412 640 482 860 432 C 1040 392 1200 412 1330 442" fill="none" stroke="${P.green}" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
    ${[[214, 470, P.orange], [856, 424, P.orange], [520, 452, P.cream]].map(([x, y, c]) => cross(x, y, 7, c, 3)).join("")}
    ${button(1180, 380, 26, P.cream, { sw: 2.6, holeColor: "#0e2a33" })}`,
  fg: `<defs>
    <linearGradient id="v10g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14424e"/><stop offset="1" stop-color="#0a222b"/></linearGradient>
    <linearGradient id="v10g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b2530"/><stop offset="1" stop-color="#050d10"/></linearGradient></defs>
    <path d="${ridge(182, 648, 62, 10, { fmt: "d" })} L 1440 730 L 0 730 Z" fill="url(#v10g1)"/>
    ${[0, 1, 2].map((row) => chains(668 + row * 13, 40, 12, 38, row % 2 ? P.cyan : P.green, 3, 0, { opacity: 0.85 - row * 0.1 })).join("")}
    <path d="${ridge(183, 742, 48, 10, { fmt: "d" })} L 1440 810 L 0 810 Z" fill="url(#v10g2)"/>
    ${[0, 1].map((row) => chains(762 + row * 13, 44, 12, 34, row % 2 ? P.line : "#0f3d44", 2.6, 0, { opacity: 0.9 })).join("")}
    ${[[180, 700, P.cream], [430, 686, P.orange], [1180, 700, P.cream], [640, 770, P.cyan], [960, 780, P.orange]].map(([x, y, c]) => cross(x, y, 8, c, 3)).join("")}
    ${needleS(760, 736, 300, 197, P.cream, { sw: 2.6, t: 10, glow: "drop-shadow(0 0 9px rgba(75,225,236,.55))" })}
    <path d="M 758 738 C 560 600 700 380 1040 240" fill="none" stroke="${P.orange}" stroke-width="3.4" stroke-linecap="round" opacity="0.9"/>`,
});

/* ── assemble page ───────────────────────────────────────────────────── */
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Parallax Variants — Exploration × Tailoring</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#02070a; color:#e9f4f4; font-family:system-ui, sans-serif; }
  header.page { max-width:1240px; margin:0 auto; padding:48px 24px 8px; }
  .kicker { font-size:.72rem; letter-spacing:.3em; color:#4be1ec; text-transform:uppercase; font-family:ui-monospace,monospace; }
  h1 { font-size:2rem; margin:.4em 0 .2em; }
  .sub { color:#9db3b8; max-width:80ch; line-height:1.6; }
  ol.index { columns:2; max-width:1240px; margin:1.5rem auto 0; padding:0 24px 8px; list-style:none; color:#9db3b8; }
  ol.index li { padding:.2em 0; break-inside:avoid; }
  ol.index a { color:#e9f4f4; text-decoration:none; }
  ol.index a:hover { color:#4be1ec; }
  ol.index .k { color:#4be1ec; font-family:ui-monospace,monospace; font-size:.8rem; margin-right:.6em; }
  section.variant { max-width:1240px; margin:56px auto; padding:0 24px; }
  section.variant h2 { font-size:1.4rem; margin:.3em 0 .1em; }
  .tag { color:#9db3b8; font-family:ui-monospace,monospace; font-size:.78rem; }
  .notes { color:#9db3b8; font-size:.9rem; line-height:1.55; max-width:88ch; margin:.4em 0 1em; }
  .scene { position:relative; width:100%; aspect-ratio:1440/810; border-radius:14px; overflow:hidden;
           border:1px solid #12333d; box-shadow:0 30px 80px rgba(0,0,0,.5); background:#050d10; }
  .scene svg { position:absolute; inset:0; width:100%; height:100%; display:block; }
</style>
</head>
<body>
<header class="page">
  <div class="kicker">VYN — Parallax graphics exploration</div>
  <h1>Ten sets · Exploration × Tailoring</h1>
  <p class="sub">Each set is the full three-layer composition (background / midground / foreground) on the
  site canvas 1440×810. All carry the two concepts — a universe to explore, a world being sewn together —
  under deliberately different art direction: hairline blueprint, thick neon ribbon, strict blue+orange
  duotone, cut-paper silhouette, painterly nebula, flat poster geometry, star-atlas engraving, plotter,
  cobalt&amp;amber, knitted tapestry.</p>
</header>
<ol class="index">
  ${V.map((v) => `<li><a href="#${v.id}"><span class="k">${v.kicker}</span>${v.title} — <em>${v.tag}</em></a></li>`).join("")}
</ol>
${V.map(
  (v) => `<section class="variant" id="${v.id}">
  <div class="kicker">${v.kicker}</div>
  <h2>${v.title}</h2>
  <div class="tag">${v.tag}</div>
  <p class="notes">${v.notes}</p>
  <div class="scene" data-name="${v.id}" style="aspect-ratio:${v.ratio ?? "1440/810"}">
    <svg viewBox="${v.vb ?? "0 0 1440 810"}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${v.bg}</svg>
    <svg viewBox="${v.vb ?? "0 0 1440 810"}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${v.mid}</svg>
    <svg viewBox="${v.vb ?? "0 0 1440 810"}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${v.fg}</svg>
  </div>
</section>`,
).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-variants.html", page);
console.log(`wrote vyn-parallax-variants.html (${(fs.statSync("vyn-parallax-variants.html").size / 1e3).toFixed(0)} KB)`);

/* ── elements catalogue — every named piece of SET 04/04b, isolated ──── */
const EL = { ...E04, ...E04B };
const elPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04 elements — named pieces</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#02070a; color:#e9f4f4; font-family:system-ui, sans-serif; }
  header.page { max-width:1000px; margin:0 auto; padding:48px 24px 8px; }
  .kicker { font-size:.72rem; letter-spacing:.3em; color:#4be1ec; text-transform:uppercase; font-family:ui-monospace,monospace; }
  h1 { font-size:2rem; margin:.4em 0 .2em; }
  .sub { color:#9db3b8; max-width:80ch; line-height:1.6; }
  ol.index { max-width:1000px; margin:1.5rem auto 0; padding:0 24px 8px; list-style:none; color:#9db3b8; columns:2; }
  ol.index li { padding:.2em 0; break-inside:avoid; }
  ol.index a { color:#e9f4f4; text-decoration:none; }
  ol.index a:hover { color:#4be1ec; }
  ol.index code { color:#4be1ec; font-family:ui-monospace,monospace; font-size:.8rem; margin-right:.6em; }
  section.el { max-width:1000px; margin:40px auto; padding:0 24px; }
  .el-scene { position:relative; width:100%; aspect-ratio:1440/1000; border-radius:14px; overflow:hidden;
              border:1px solid #12333d; background:#021016; }
  .el-scene svg { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .el-label { display:flex; gap:.8em; align-items:baseline; padding:.6em .2em 0; }
  .el-label code { color:#4be1ec; font-family:ui-monospace,monospace; font-size:.9rem; }
  .el-label span { color:#9db3b8; font-size:.85rem; }
</style>
</head>
<body>
<header class="page">
  <div class="kicker">VYN — MAIN SET "Paper Seams" (04/04b) anatomy</div>
  <h1>Named elements</h1>
  <p class="sub">Every graphic piece of the cut-paper two-worlds set, shown isolated on the sewing-ground
  tone (#021016) so pale rims stay visible. Reference a piece by its name to move or restyle it.
  Canvas is 1440×1000; coordinates in the descriptions are scene units.</p>
</header>
<ol class="index">
  ${Object.entries(EL).map(([name, e]) => `<li><a href="#el-${name}"><code>${name}</code>${e.d}${e.off ? " <em>— removed from composition</em>" : ""}</a></li>`).join("")}
</ol>
<section class="el" id="el-FULL">
  <div class="el-scene" data-name="el-FULL"><svg viewBox="0 0 1440 1000" aria-hidden="true">${v04.bg}</svg><svg viewBox="0 0 1440 1000" aria-hidden="true">${v04.mid}</svg><svg viewBox="0 0 1440 1000" aria-hidden="true">${V.find((v) => v.id === "v04b-cutpaper-props").fg}</svg></div>
  <div class="el-label"><code>FULL SET 04b</code><span>all elements together — every piece below is one layer of this composition</span></div>
</section>
${Object.entries(EL).map(
  ([name, e]) => `<section class="el" id="el-${name}">
  <div class="el-scene" data-name="el-${name}"><svg viewBox="0 0 1440 1000" aria-hidden="true">${e.s}</svg></div>
  <div class="el-label"><code>${name}</code><span>${e.d}${e.off ? " <em>— removed from composition</em>" : ""}</span></div>
</section>`,
).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-elements.html", elPage);
console.log(`wrote vyn-parallax-elements.html (${(fs.statSync("vyn-parallax-elements.html").size / 1e3).toFixed(0)} KB)`);

/* ── drag editor — move elements with the mouse, copy the offsets ────── */
/* invisible grab pads for thin/scattered elements (scene coords x,y,r) */
const PADS = {
  galaxyDashed: [[260, 210, 70]],
  planetOrange: [[1058, 392, 26]],
  mountainPerforation: [[400, 470, 30], [700, 600, 30], [980, 520, 30]],
  mountainCrosses: [[700, 545, 28]],
  groundSeam: [[700, 810, 32]],
  thread: [[950, 838, 30], [1170, 700, 30]],
};
const dragG = (name, svg, pads = []) =>
  `<g class="drag" data-el="${name}">${pads.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="transparent"/>`).join("")}${svg}</g>`;
const EDITOR_LAYERS = [
  ["bg", V04_BG_KEYS.filter((k) => k !== "sky").map((k) => dragG(k, E04[k].s, PADS[k])).join("\n"), `${E04.sky.s}`],
  ["mid", V04_MID_KEYS.map((k) => dragG(k, E04[k].s, PADS[k])).join("\n"), ""],
  ["fg", V04B_FG_KEYS.filter((k) => k !== "sewingGround").map((k) => dragG(k, (E04[k] ?? E04B[k]).s, PADS[k])).join("\n"), `${E04.sewingGround.s}`],
];
const EDITOR_NAMES = V04_BG_KEYS.filter((k) => k !== "sky")
  .concat(V04_MID_KEYS)
  .concat(V04B_FG_KEYS.filter((k) => k !== "sewingGround"));

const editorPage = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04b "Paper Seams" — drag editor</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#02070a; color:#e9f4f4; font-family:system-ui, sans-serif; }
  header { max-width:1240px; margin:0 auto; padding:36px 24px 10px; }
  .kicker { font-size:.72rem; letter-spacing:.3em; color:#4be1ec; text-transform:uppercase; font-family:ui-monospace,monospace; }
  h1 { font-size:1.7rem; margin:.4em 0 .2em; }
  .sub { color:#9db3b8; max-width:88ch; line-height:1.55; }
  .stage { position:relative; max-width:1240px; margin:20px auto 0; }
  .scene { position:relative; width:100%; aspect-ratio:1440/1000; border-radius:14px; overflow:hidden;
           border:1px solid #12333d; background:#03141c; }
  .scene svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
  .scene g.drag { pointer-events:auto; cursor:move; }
  .scene g.drag:hover { filter:drop-shadow(0 0 3px rgba(75,225,236,.9)); }
  .scene g.drag.sel { filter:drop-shadow(0 0 4px rgba(247,156,0,.95)); }
  .hud { position:absolute; top:10px; left:10px; background:rgba(2,16,22,.85); border:1px solid #12333d;
         border-radius:8px; padding:.5em .8em; font-family:ui-monospace,monospace; font-size:.78rem; color:#9ff3f2; }
  .panel { max-width:1240px; margin:14px auto 40px; padding:0 24px; display:flex; gap:24px; align-items:flex-start; }
  .rows { flex:1; columns:3; font-family:ui-monospace,monospace; font-size:.8rem; }
  .row { display:flex; gap:.6em; break-inside:avoid; padding:.15em 0; color:#9db3b8; }
  .row code { color:#e9f4f4; cursor:pointer; }
  .row code:hover { color:#4be1ec; }
  .row .off { color:#ffd9a0; }
  textarea { flex:1; height:9em; background:#03141c; color:#9ff3f2; border:1px solid #12333d; border-radius:8px;
             font-family:ui-monospace,monospace; font-size:.8rem; padding:.6em; resize:vertical; }
  button { background:#0a2e38; color:#e9f4f4; border:1px solid #164b53; border-radius:8px; padding:.5em 1em;
           cursor:pointer; font-size:.85rem; }
  button:hover { background:#123f4d; }
  .hint { color:#6d868c; font-size:.78rem; margin-top:.4em; }
</style>
</head>
<body>
<header>
  <div class="kicker">VYN — "Paper Seams" (04b) drag editor</div>
  <h1>Drag elements to where you want them</h1>
  <p class="sub">Drag any element with the mouse. Click one, then use the <b>arrow keys</b> to nudge
  (±5 scene units, <b>Shift</b>+arrows ±1). Dropped offsets are listed below. When it looks right,
  press <b>COPY OFFSETS</b> (or select the textarea text) and paste the JSON into the chat — the moves
  get applied to the artwork permanently. Offsets are relative to the current positions, in scene
  units (canvas 1440×1000, +x right, +y down). <code>sky</code> and <code>sewingGround</code> are fixed backdrops.
  Thin or scattered pieces (<code>stars</code>, <code>starBig</code>, <code>mountainPerforation</code>,
  <code>mountainCrosses</code>, <code>groundSeam</code>, <code>thread</code>) are hard to grab with the mouse —
  select them in the list below and nudge with the arrow keys instead.</p>
</header>
<div class="stage">
  <div class="scene" id="scene">
    <svg viewBox="0 0 1440 1000" data-layer="bg">${EDITOR_LAYERS[0][2]}${EDITOR_LAYERS[0][1]}</svg>
    <svg viewBox="0 0 1440 1000" data-layer="mid">${EDITOR_LAYERS[1][2]}${EDITOR_LAYERS[1][1]}</svg>
    <svg viewBox="0 0 1440 1000" data-layer="fg">${EDITOR_LAYERS[2][2]}${EDITOR_LAYERS[2][1]}</svg>
  </div>
  <div class="hud" id="hud">&nbsp;</div>
</div>
<div class="panel">
  <div class="rows" id="rows">${EDITOR_NAMES.map((n) => `<div class="row"><code data-el="${n}">${n}</code><span class="off" data-off="${n}">0, 0</span></div>`).join("")}</div>
  <div style="flex:1;display:flex;flex-direction:column;gap:.6em">
    <textarea id="json" readonly>{}</textarea>
    <button id="copy">COPY OFFSETS</button>
    <button id="reset">RESET ALL</button>
    <div class="hint">Paste the JSON into the chat after dragging.</div>
  </div>
</div>
<script>
(() => {
  const offsets = {};
  const NAMES = ${JSON.stringify(EDITOR_NAMES)};
  let selected = null, start = null;

  const hud = document.getElementById("hud");
  const jsonTA = document.getElementById("json");
  const sync = () => {
    for (const n of NAMES) {
      const o = offsets[n] || [0, 0];
      document.querySelector('.row .off[data-off="' + n + '"]').textContent = o[0] + ", " + o[1];
    }
    jsonTA.value = JSON.stringify(offsets);
    if (selected) {
      const o = offsets[selected.dataset.el] || [0, 0];
      hud.textContent = selected.dataset.el + "  " + (o[0] >= 0 ? "+" : "") + o[0] + " " + (o[1] >= 0 ? "+" : "") + o[1];
    }
  };

  document.querySelectorAll(".scene svg").forEach((svg) => {
    svg.querySelectorAll("g.drag").forEach((g) => {
      const name = g.dataset.el;
      g.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (selected) selected.classList.remove("sel");
        selected = g; g.classList.add("sel");
        start = { x: e.clientX, y: e.clientY, dx: (offsets[name] || [0, 0])[0], dy: (offsets[name] || [0, 0])[1] };
        g.setPointerCapture(e.pointerId);
      });
      g.addEventListener("pointermove", (e) => {
        if (!start || selected !== g) return;
        const s = svg.clientWidth / 1440;
        const dx = Math.round(start.dx + (e.clientX - start.x) / s);
        const dy = Math.round(start.dy + (e.clientY - start.y) / s);
        offsets[name] = [dx, dy];
        g.setAttribute("transform", "translate(" + dx + " " + dy + ")");
        sync();
      });
      g.addEventListener("pointerup", () => { start = null; });
    });
  });

  document.addEventListener("keydown", (e) => {
    if (!selected || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
    const step = e.shiftKey ? 1 : 5;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    const name = selected.dataset.el;
    const o = offsets[name] || [0, 0];
    offsets[name] = [o[0] + d[0], o[1] + d[1]];
    selected.setAttribute("transform", "translate(" + offsets[name][0] + " " + offsets[name][1] + ")");
    sync();
  });

  document.querySelectorAll(".row code").forEach((c) =>
    c.addEventListener("click", () => {
      const g = document.querySelector('.scene g.drag[data-el="' + c.dataset.el + '"]');
      if (!g) return;
      if (selected) selected.classList.remove("sel");
      selected = g; g.classList.add("sel");
      g.scrollIntoView({ block: "nearest" });
      sync();
    })
  );

  document.getElementById("copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(jsonTA.value); }
    catch { jsonTA.select(); document.execCommand("copy"); }
    document.getElementById("copy").textContent = "COPIED ✓";
    setTimeout(() => (document.getElementById("copy").textContent = "COPY OFFSETS"), 1200);
  });
  document.getElementById("reset").addEventListener("click", () => {
    for (const n of NAMES) delete offsets[n];
    document.querySelectorAll(".scene g.drag").forEach((g) => g.removeAttribute("transform"));
    sync();
  });
  sync();
})();
</script>
</body>
</html>`;

fs.writeFileSync("vyn-parallax-editor.html", editorPage);
console.log(`wrote vyn-parallax-editor.html (${(fs.statSync("vyn-parallax-editor.html").size / 1e3).toFixed(0)} KB)`);
