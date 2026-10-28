/**
 * Generates vyn-parallax-fire-mix.html — the F1 (classic plume) × F2
 * (stacked paper cuts) fire blend for SET 04b, shown three different ways:
 *
 *   M1 · nested   — one F1 silhouette (plume + side flickers) radiating with
 *                   two inner F2-style scaled plumes in graded tones
 *   M2 · stepped  — three copies of the F1 plume offset downward and scaled
 *                   up slightly, creating a stepped echo flame
 *   M3 · sliced   — the F1 plume cut into three horizontal paper strips with
 *                   air gaps, like the flame was cut into ribbons
 *
 * Tiles: 1440×360 (seam at y120), mast stub for context. Deterministic.
 */
import fs from "node:fs";

const rim = "#7fb0bc";
const fill = "#04161d";
const orange = "#f79c00";
const deepOrange = "#d9640a";
const midOrange = "#c05008";
const mount = "#08222c";
const groundC = "#021016";
const seamCol = "#3f7280";

const fireBG = `<rect width="1440" height="120" fill="${mount}"/>
  <rect y="120" width="1440" height="240" fill="${groundC}"/>
  <line x1="0" y1="120" x2="1440" y2="120" stroke="${seamCol}" stroke-width="2.2" stroke-dasharray="2 9"/>`;

const stub = `<g transform="translate(720 120)">
  <path d="M -4 0 L -2 -70 L 0 -75 L 2 -70 L 4 0 Z" fill="${fill}" stroke="${rim}" stroke-width="1.8"/>
</g>`;

/* shared F1 geometry */
const plume = (c) =>
  `<path d="M -22 0 C -24 20 -18 38 -10 56 C -4 74 -2 92 0 108 C 2 92 4 74 10 56 C 18 38 24 20 22 0 Z" fill="${c}"/>`;
const flickers = (c) => `
  <path d="M -10 -2 C -22 12 -26 26 -20 40 C -15 28 -12 14 -10 -2 Z" fill="${c}"/>
  <path d="M 10 -2 C 22 12 26 26 20 40 C 15 28 12 14 10 -2 Z" fill="${c}"/>`;

/* M1 · nested — F1 full silhouette spilling F2's nested plumes inside */
const m1 = `<g transform="translate(720 120) scale(0.9)">
      ${flickers(orange)}
      ${plume(orange)}
      <g transform="scale(0.72)">${plume(deepOrange)}</g>
      <g transform="scale(0.42)">${plume(midOrange)}</g>
    </g>`;

/* M2 · stepped — three F1 plumes, each lower and larger, echo down the stack */
const m2 = `<g transform="translate(720 120) scale(0.9)">
      <g transform="translate(0 16) scale(1.2)">${plume(deepOrange)}</g>
      <g transform="translate(0 8) scale(1.1)">${plume(midOrange)}</g>
      <g transform="translate(0 0)">${plume(orange)}</g>
      ${flickers(orange)}
    </g>`;

/* M3 · sliced — the F1 plume cut into three staggered paper strips */
const sliceA = `<clipPath id="mix-slice-a"><rect x="-40" y="-4" width="80" height="36"/></clipPath>`;
const sliceB = `<clipPath id="mix-slice-b"><rect x="-40" y="38" width="80" height="34"/></clipPath>`;
const sliceC = `<clipPath id="mix-slice-c"><rect x="-40" y="78" width="80" height="34"/></clipPath>`;
const m3 = `<defs>${sliceA}${sliceB}${sliceC}</defs>
    <g transform="translate(720 120) scale(0.9)">
      ${flickers(orange)}
      <g clip-path="url(#mix-slice-a)">${plume(orange)}</g>
      <g clip-path="url(#mix-slice-b)">${plume(deepOrange)}</g>
      <g clip-path="url(#mix-slice-c)">${plume(midOrange)}</g>
    </g>`;

const MIXES = [
  ["m1-nested", "M1 · nested (F1 shape + F2 layering)", "the full F1 silhouette — plume with side flickers — with two inner F2 plumes stacked inside in graded oranges", m1],
  ["m2-stepped", "M2 · stepped echo", "three F1 plumes, each one shifted down and scaled up behind the last — the flame repeats itself like echoes of paper cuts", m2],
  ["m3-sliced", "M3 · sliced ribbons", "the F1 plume cut into three horizontal strips with air gaps, tones stepping orange → deep → mid downward", m3],
];

const tile = ([id, name, desc, svg]) => `<section class="prop" id="${id}">
  <div class="prop-scene" data-name="${id}" style="aspect-ratio:1440/360"><svg viewBox="0 0 1440 360" aria-hidden="true">${fireBG}${stub}${svg}</svg></div>
  <div class="prop-label"><code>${id}</code><strong>${name}</strong><span>${desc}</span></div>
</section>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04b — fire mix F1 × F2</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#02070a; color:#e9f4f4; font-family:system-ui, sans-serif; }
  header.page { max-width:1100px; margin:0 auto; padding:48px 24px 8px; }
  .kicker { font-size:.72rem; letter-spacing:.3em; color:#4be1ec; text-transform:uppercase; font-family:ui-monospace,monospace; }
  h1 { font-size:2rem; margin:.4em 0 .2em; }
  .sub { color:#9db3b8; max-width:80ch; line-height:1.6; }
  section.prop { max-width:1100px; margin:34px auto; padding:0 24px; }
  .prop-scene { position:relative; width:100%; border-radius:14px; overflow:hidden;
                border:1px solid #12333d; background:#021016; }
  .prop-scene svg { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .prop-label { display:flex; gap:.8em; align-items:baseline; padding:.6em .2em 0; flex-wrap:wrap; }
  .prop-label code { color:#4be1ec; font-family:ui-monospace,monospace; font-size:.9rem; }
  .prop-label strong { font-size:.95rem; }
  .prop-label span { color:#9db3b8; font-size:.85rem; }
</style>
</head>
<body>
<header class="page">
  <div class="kicker">VYN — SET 04b launch fire</div>
  <h1>Fire mix — F1 classic × F2 stacked, three ways</h1>
  <p class="sub">The classic plume geometry (F1) combined with the stacked-paper-cuts technique
  (F2). Same tile context as the scene: needle mast on the seam (y120), fire licking down into the
  sewing ground. Pick one and it becomes the new <code>needleFlames</code>.</p>
</header>
${MIXES.map(tile).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-fire-mix.html", page);
console.log(`wrote vyn-parallax-fire-mix.html (${(fs.statSync("vyn-parallax-fire-mix.html").size / 1e3).toFixed(0)} KB)`);
