/**
 * Generates vyn-parallax-fire.html — 5 ORANGE + 5 BLUE fire variations for
 * the needle-rocket launch flames of SET 04b (cut-paper two worlds).
 * Deterministic, no randomness.
 *
 * Tiles: 1440×360 (seam at y120) so every variant reads in its scene context:
 * sewing ground below the seam, a short needle-mast stub sprouting the fire.
 * f1–f5 use the set's orange accent; b1–b5 recolour the same five geometries
 * into the set's blue palette (rim #7fb0bc · line #3f7280 · deep #2e5a66 ·
 * pale #cfe8ec).
 */
import fs from "node:fs";

const rim = "#7fb0bc"; // pale cut-paper edge light
const fill = "#04161d"; // silhouette fill
const orange = "#f79c00";
const deepOrange = "#d9640a";
const midOrange = "#c05008"; // between-tone for stacked cuts
const mount = "#08222c"; // mountain band tone
const groundC = "#021016"; // sewing ground tone
const seamCol = "#3f7280";

const fireBG = `<rect width="1440" height="120" fill="${mount}"/>
  <rect y="120" width="1440" height="240" fill="${groundC}"/>
  <line x1="0" y1="120" x2="1440" y2="120" stroke="${seamCol}" stroke-width="2.2" stroke-dasharray="2 9"/>`;

/* needle-mast stub above the seam (context marker for where the fire sits) */
const stub = `<g transform="translate(720 120)">
  <path d="M -4 0 L -2 -70 L 0 -75 L 2 -70 L 4 0 Z" fill="${fill}" stroke="${rim}" stroke-width="1.8"/>
</g>`;

/* plume silhouette reused by the stacked variant */
const plume = (c) =>
  `<path d="M -22 0 C -24 20 -18 38 -10 56 C -4 74 -2 92 0 108 C 2 92 4 74 10 56 C 18 38 24 20 22 0 Z" fill="${c}"/>`;

/* ── orange geometries (matching the scene's current flame for F1) ───── */
const g1 = (o, c) => `
      <path d="M -10 -2 C -22 12 -26 26 -20 40 C -15 28 -12 14 -10 -2 Z" fill="${o}"/>
      <path d="M 10 -2 C 22 12 26 26 20 40 C 15 28 12 14 10 -2 Z" fill="${o}"/>
      <path d="M -22 0 C -24 20 -18 38 -10 56 C -4 74 -2 92 0 108 C 2 92 4 74 10 56 C 18 38 24 20 22 0 Z" fill="${o}"/>
      <path d="M -9 0 C -12 16 -6 32 0 52 C 6 32 12 16 9 0 Z" fill="${c}"/>`;

const g2 = (a, b, c) => `
      <g transform="scale(1.35)">${plume(a)}</g>
      <g transform="scale(0.85)">${plume(b)}</g>
      <g transform="scale(0.45)">${plume(c)}</g>`;

const g3 = (a, b, dot) => `
      <g transform="rotate(-16)"><path d="M -3 -2 C -7 22 -5 44 0 62 C 5 44 7 22 3 -2 Z" fill="${a}"/></g>
      <g transform="rotate(16)"><path d="M -3 -2 C -7 22 -5 44 0 62 C 5 44 7 22 3 -2 Z" fill="${b}"/></g>
      <path d="M -3 -2 C -6 18 -3 36 0 50 C 3 36 6 18 3 -2 Z" fill="${a}"/>
      <circle cx="-34" cy="64" r="2.6" fill="${dot}"/>
      <circle cx="30" cy="60" r="2.2" fill="${dot}"/>
      <circle cx="0" cy="82" r="2.6" fill="${dot}"/>`;

const g4 = (a, c) => `
      <path d="M -20 0 L -26 18 L -12 14 L -18 34 L -4 30 L -6 52 L 0 34 L 6 52 L 4 30 L 18 34 L 12 14 L 26 18 L 20 0 Z" fill="${a}"/>
      <g transform="scale(0.5)"><path d="M -20 0 L -26 18 L -12 14 L -18 34 L -4 30 L -6 52 L 0 34 L 6 52 L 4 30 L 18 34 L 12 14 L 26 18 L 20 0 Z" fill="${c}"/></g>`;

const g5 = (a, b, c) => `
      <circle cx="-16" cy="26" r="14" fill="${a}"/>
      <circle cx="14" cy="30" r="12" fill="${a}"/>
      <circle cx="0" cy="54" r="17" fill="${a}"/>
      <path d="M -14 34 C -8 28 10 30 12 36" fill="none" stroke="${b}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <path d="M -12 58 C -4 52 8 54 12 60" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="3 5" opacity="0.85"/>`;

const g1B = g1;
const g2B = g2;
const g3B = g3;
const g4B = g4;
const g5B = g5;

const at = (svg) => `<g transform="translate(720 120)">${svg}</g>`;

/* ── variants ────────────────────────────────────────────────────────── */
const FIRES = [
  ["f1-classic", "F1 · classic plume", "current baseline — orange teardrop with deep core and two side flickers", at(g1(orange, deepOrange))],
  ["f2-stacked", "F2 · stacked paper cuts", "three nested plumes, 135% / 85% / 45% — the flame as layered cut paper", at(g2(orange, deepOrange, midOrange))],
  ["f3-twinjets", "F3 · twin jets", "two slim jets veering left and right with a center tongue, spark dots thrown off", at(g3(orange, deepOrange, orange))],
  ["f4-burst", "F4 · spike burst", "jagged paper-burst crown of spikes with its own half-scale core", at(g4(orange, midOrange))],
  ["f5-puffs", "F5 · exhaust puffs", "rounded exhaust puffs of circles instead of a plume, dashed vapor arcs beneath", at(g5(orange, deepOrange, midOrange))],

  ["b1-classic", "B1 · classic plume (blue)", "same F1 geometry — pale rim with pale-bright core", at(g1B(rim, "#cfe8ec"))],
  ["b2-stacked", "B2 · stacked paper cuts (blue)", "same F2 geometry — deep / line / pale stacked tones", at(g2B("#2e5a66", seamCol, "#cfe8ec"))],
  ["b3-twinjets", "B3 · twin jets (blue)", "same F3 geometry — rim jets with pale sparks", at(g3B(rim, seamCol, "#cfe8ec"))],
  ["b4-burst", "B4 · spike burst (blue)", "same F4 geometry — rim crown with line-tone core", at(g4B(rim, seamCol))],
  ["b5-puffs", "B5 · exhaust puffs (blue)", "same F5 geometry — rim puffs with dashed pale vapor", at(g5B(rim, seamCol, "#cfe8ec"))],
];

const tile = ([id, name, desc, svg]) => `<section class="prop" id="${id}">
  <div class="prop-scene" data-name="${id}" style="aspect-ratio:1440/360"><svg viewBox="0 0 1440 360" aria-hidden="true">${fireBG}${stub}${svg}</svg></div>
  <div class="prop-label"><code>${id}</code><strong>${name}</strong><span>${desc}</span></div>
</section>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04b — launch-fire variations</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#02070a; color:#e9f4f4; font-family:system-ui, sans-serif; }
  header.page { max-width:1100px; margin:0 auto; padding:48px 24px 8px; }
  .kicker { font-size:.72rem; letter-spacing:.3em; color:#4be1ec; text-transform:uppercase; font-family:ui-monospace,monospace; }
  h1 { font-size:2rem; margin:.4em 0 .2em; }
  h2 { font-size:1.3rem; margin:2.2em 0 .2em; }
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
  <h1>Needle-rocket fire — 5 orange + 5 blue</h1>
  <p class="sub">Every tile shows the needle-mast stub standing on the seam (y120) with the fire
  licking down into the sewing ground — same context as the scene. <b>F1–F5</b> use the set's orange
  accent; <b>B1–B5</b> recolour the identical geometries into the set's blue palette. Pick one and it
  becomes the new <code>needleFlames</code> element.</p>
</header>
<h2 style="max-width:1100px;margin:2em auto 0;padding:0 24px">Orange</h2>
${FIRES.slice(0, 5).map(tile).join("")}
<h2 style="max-width:1100px;margin:2em auto 0;padding:0 24px">Blue</h2>
${FIRES.slice(5).map(tile).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-fire.html", page);
console.log(`wrote vyn-parallax-fire.html (${(fs.statSync("vyn-parallax-fire.html").size / 1e3).toFixed(0)} KB)`);
