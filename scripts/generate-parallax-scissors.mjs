/**
 * Generates vyn-parallax-scissors.html — 5 SCISSORS variations for
 * SET 04b (cut-paper two worlds). Deterministic, no randomness.
 *
 * Tiles: 1440×460 (seam at y330, sewing ground below) so every variant reads
 * in its scene context — the scissors stand on the seam like in the
 * composition. S1 is the current baseline; pick one and it becomes the new
 * `scissors` element.
 */
import fs from "node:fs";

const rim = "#7fb0bc";
const fill = "#04161d";
const orange = "#f79c00";
const mount = "#08222c";
const groundC = "#021016";
const seamCol = "#3f7280";

const tileBG = `<rect width="1440" height="330" fill="${mount}"/>
  <rect y="330" width="1440" height="130" fill="${groundC}"/>
  <line x1="0" y1="330" x2="1440" y2="330" stroke="${seamCol}" stroke-width="2.2" stroke-dasharray="2 9"/>`;

/* S1 · baseline — the exact current scene geometry (mid-cut along the seam) */
const s1 = `<g transform="translate(400 330) rotate(-2) scale(1.05)">
      <path d="M0 6 L210 -30 L216 -20 L29.4 12 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M0 6 L210 42 L216 32 L29.4 2 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M -58.8 -14 L 0 6 L -58.8 28" fill="none" stroke="${rim}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="-71.4" cy="-16" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
      <circle cx="-71.4" cy="30" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
    </g>`;

/* S2 · closed poseur — blades shut, resting on the ground in a long diagonal */
const s2 = `<g transform="translate(760 330) rotate(24) scale(1.05)">
      <path d="M 19 10 L 168 2 L 174 -8 L -19 8 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M 19 2 L 168 -14 L 174 -24 L -19 -8 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M 0 -2 L 24 -8 L 40 -22 L 52 -16 L 34 -2 Z" fill="${fill}" stroke="${rim}" stroke-width="1.6"/>
      <circle cx="34" cy="18" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
      <circle cx="12" cy="36" r="15" fill="none" stroke="${rim}" stroke-width="8"/>
    </g>
    <path d="M 0 372 C 180 388 300 380 430 368 C 560 356 660 348 780 352" fill="none" stroke="${rim}" stroke-width="1.4" stroke-dasharray="2 8" opacity="0.7"/>`;

/* S3 · giant planted X — scissors rammed into the ground, blades pointing up */
const s3 = `<g transform="translate(740 330) rotate(-90) scale(1.05)">
      <path d="M0 6 L210 -30 L216 -20 L29.4 12 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M0 6 L210 42 L216 32 L29.4 2 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M -58.8 -14 L 0 6 L -58.8 28" fill="none" stroke="${rim}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="-71.4" cy="-16" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
      <circle cx="-71.4" cy="30" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
    </g>`;

/* S4 · perforated ghost — same mid-cut pose but every line dashed, as if the
   scissors were only stitch-perforated into the design */
const s4 = `<g transform="translate(400 330) rotate(-2) scale(1.05)">
      <path d="M0 6 L210 -30 L216 -20 L29.4 12 Z" fill="none" stroke="${rim}" stroke-width="1.4" stroke-dasharray="3 6"/>
      <path d="M0 6 L210 42 L216 32 L29.4 2 Z" fill="none" stroke="${rim}" stroke-width="1.4" stroke-dasharray="3 6"/>
      <path d="M -58.8 -14 L 0 6 L -58.8 28" fill="none" stroke="${rim}" stroke-width="5" stroke-linecap="round" stroke-dasharray="4 6"/>
      <circle cx="-71.4" cy="-16" r="17" fill="none" stroke="${rim}" stroke-width="6" stroke-dasharray="5 6"/>
      <circle cx="-71.4" cy="30" r="17" fill="none" stroke="${rim}" stroke-width="6" stroke-dasharray="5 6"/>
    </g>`;

/* S5 · snipping the thread — scissors raised, an orange thread runs between
   the open blades and falls to the ground beyond the cut point */
const s5 = `<g transform="translate(430 262) rotate(-18) scale(1.05)">
      <path d="M0 6 L210 -30 L216 -20 L29.4 12 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M0 6 L210 42 L216 32 L29.4 2 Z" fill="${fill}" stroke="${rim}" stroke-width="1.4"/>
      <path d="M -58.8 -14 L 0 6 L -58.8 28" fill="none" stroke="${rim}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="-71.4" cy="-16" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
      <circle cx="-71.4" cy="30" r="17" fill="none" stroke="${rim}" stroke-width="8"/>
    </g>
    <path d="M 120 318 C 240 306 340 300 448 310" fill="none" stroke="${orange}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M 700 352 C 790 380 900 402 1000 396" fill="none" stroke="${orange}" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="455" cy="311" r="3" fill="${orange}"/>`;

const SCISSORS = [
  ["s1-midcut", "S1 · mid-cut on the seam", "current baseline — open blades lying along the ground seam as if just cutting it", s1],
  ["s2-closed", "S2 · closed poseur", "blades shut, resting in a long diagonal on the ground with a faint perforated drag line behind", s2],
  ["s3-plantedx", "S3 · giant planted X", "blades rammed vertically into the ground like a closed flag", s3],
  ["s4-ghost", "S4 · perforated ghost", "identical mid-cut pose, but every line dashed — the scissors as stitch-perforation only", s4],
  ["s5-snipthread", "S5 · snipping the thread", "raised at an angle with the orange thread running INTO the open blades and falling away beyond the cut", s5],
];

const tile = ([id, name, desc, svg]) => `<section class="prop" id="${id}">
  <div class="prop-scene" data-name="${id}" style="aspect-ratio:1440/460"><svg viewBox="0 0 1440 460" aria-hidden="true">${tileBG}${svg}</svg></div>
  <div class="prop-label"><code>${id}</code><strong>${name}</strong><span>${desc}</span></div>
</section>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04b — scissors variations</title>
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
  <div class="kicker">VYN — SET 04b scissors</div>
  <h1>Scissors — 5 variations</h1>
  <p class="sub">Every tile shows the sewing ground and the ground seam (y330) — same context as the
  composition, where the scissors stand on the seam. Pick one and it becomes the new
  <code>scissors</code> element.</p>
</header>
${SCISSORS.map(tile).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-scissors.html", page);
console.log(`wrote vyn-parallax-scissors.html (${(fs.statSync("vyn-parallax-scissors.html").size / 1e3).toFixed(0)} KB)`);
