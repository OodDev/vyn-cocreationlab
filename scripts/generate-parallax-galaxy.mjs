/**
 * Generates vyn-parallax-galaxy.html — 5 GALAXY variations for SET 04b
 * (cut-paper two worlds). Deterministic, no randomness.
 *
 * Tiles: 1440×360 upper-sky context (sky tone + a few sprinkle stars) with the
 * galaxy centred at (720,180). G1 is the current baseline (dashed-halo pair,
 * tilted 16°). All in the set's galaxy line colours (#3a5a64 / #58828d /
 * pale #cfe8ec), dashed cut-paper language only.
 */
import fs from "node:fs";

const galaxyCol = "#3a5a64";
const galaxySoft = "#58828d";
const pale = "#cfe8ec";
const skyC = "#03141c";

/* sparse stars for context */
const ctxStars = [
  [180, 320, 1.4, 0.45], [420, 60, 1.2, 0.4], [620, 300, 1.4, 0.35],
  [920, 90, 1.2, 0.4], [1120, 280, 1.3, 0.45], [1310, 150, 1.4, 0.4],
]
  .map(([x, y, r, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${pale}" opacity="${o}"/>`)
  .join("");

const skyBG = `<rect width="1440" height="360" fill="${skyC}"/>${ctxStars}`;

/* G1 · baseline — the exact current scene geometry, re-centred */
const g1 = `<g transform="rotate(16 720 180)">
      <ellipse cx="720" cy="180" rx="88" ry="26" fill="none" stroke="${galaxyCol}" stroke-width="1.4" stroke-dasharray="6 6"/>
      <ellipse cx="720" cy="180" rx="46" ry="13" fill="none" stroke="${galaxyCol}" stroke-width="1.2"/>
    </g>`;

/* G2 · spiral — dashed spiral band circling a soft core dot */
const g2 = `<path d="M 800 180 a 80 26 0 1 0 -160 0 a 58 19 0 1 1 116 8 a 38 12 0 1 0 -76 -6"
      fill="none" stroke="${galaxyCol}" stroke-width="1.4" stroke-dasharray="7 7"/>
    <circle cx="720" cy="180" r="4" fill="${pale}" opacity="0.75"/>
    <circle cx="806" cy="184" r="2.4" fill="${galaxySoft}"/>
    <circle cx="628" cy="188" r="2" fill="${galaxySoft}"/>`;

/* G3 · pinwheel — dashed ring + six dashed radial spokes */
const spokes = [0, 60, 120, 180, 240, 300]
  .map((a) => `<line x1="0" y1="-20" x2="0" y2="-76" transform="rotate(${a})" stroke="${galaxyCol}" stroke-width="1.3" stroke-dasharray="4 5"/>`)
  .join("");
const g3 = `<g transform="translate(720 180)">
      <circle r="90" fill="none" stroke="${galaxyCol}" stroke-width="1.2" stroke-dasharray="5 8"/>
      ${spokes}
      <circle r="3.4" fill="${pale}" opacity="0.75"/>
    </g>`;

/* G4 · barred — a bold dashed bar with dashed halo wings tilted 24° */
const g4 = `<g transform="rotate(24 720 180)">
      <ellipse cx="720" cy="180" rx="118" ry="32" fill="none" stroke="${galaxyCol}" stroke-width="1.2" stroke-dasharray="5 9"/>
      <ellipse cx="720" cy="180" rx="64" ry="17" fill="none" stroke="${galaxyCol}" stroke-width="1.2" stroke-dasharray="3 7"/>
      <line x1="652" y1="180" x2="788" y2="180" stroke="${galaxySoft}" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round"/>
      <circle cx="652" cy="180" r="2.6" fill="${pale}" opacity="0.8"/>
      <circle cx="788" cy="180" r="2.6" fill="${pale}" opacity="0.8"/>
    </g>`;

/* G5 · comet drift — elongated dashed body with a trailing dot chain */
const trail = [-1, -2, -3, -4, -5]
  .map((i, k) => `<circle cx="${826 - i * -44}" cy="${222 + i * 13}" r="${2.8 - Math.abs(i) * 0.35}" fill="${galaxySoft}" opacity="${0.75 - Math.abs(i) * 0.1}"/>`)
  .join("");
const g5 = `<g transform="rotate(-14 720 180)">
      <ellipse cx="720" cy="180" rx="104" ry="22" fill="none" stroke="${galaxyCol}" stroke-width="1.4" stroke-dasharray="8 6"/>
      <ellipse cx="720" cy="180" rx="44" ry="9" fill="none" stroke="${galaxyCol}" stroke-width="1.2" stroke-dasharray="4 6"/>
      <circle cx="720" cy="180" r="3" fill="${pale}" opacity="0.7"/>
    </g>
    ${trail}`;

const GALAXIES = [
  ["g1-dashedhalo", "G1 · dashed halo pair", "current baseline — two concentric dashed ellipses tilted 16°", g1],
  ["g2-spiral", "G2 · spiral band", "a dashed spiral band curling twice around a pale core dot, drift dots on the arms", g2],
  ["g3-pinwheel", "G3 · pinwheel", "dashed ring with six dashed radial spokes around a bright core", g3],
  ["g4-barred", "G4 · barred galaxy", "bold dashed bar across a tilted dashed halo of two ellipse wings", g4],
  ["g5-comet", "G5 · comet drift", "elongated dashed body with a fading dot chain trailing off the tip", g5],
];

const tile = ([id, name, desc, svg]) => `<section class="prop" id="${id}">
  <div class="prop-scene" data-name="${id}" style="aspect-ratio:1440/360"><svg viewBox="0 0 1440 360" aria-hidden="true">${skyBG}${svg}</svg></div>
  <div class="prop-label"><code>${id}</code><strong>${name}</strong><span>${desc}</span></div>
</section>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04b — galaxy variations</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#02070a; color:#e9f4f4; font-family:system-ui, sans-serif; }
  header.page { max-width:1100px; margin:0 auto; padding:48px 24px 8px; }
  .kicker { font-size:.72rem; letter-spacing:.3em; color:#4be1ec; text-transform:uppercase; font-family:ui-monospace,monospace; }
  h1 { font-size:2rem; margin:.4em 0 .2em; }
  .sub { color:#9db3b8; max-width:80ch; line-height:1.6; }
  section.prop { max-width:1100px; margin:34px auto; padding:0 24px; }
  .prop-scene { position:relative; width:100%; border-radius:14px; overflow:hidden;
                border:1px solid #12333d; background:#03141c; }
  .prop-scene svg { position:absolute; inset:0; width:100%; height:100%; display:block; }
  .prop-label { display:flex; gap:.8em; align-items:baseline; padding:.6em .2em 0; flex-wrap:wrap; }
  .prop-label code { color:#4be1ec; font-family:ui-monospace,monospace; font-size:.9rem; }
  .prop-label strong { font-size:.95rem; }
  .prop-label span { color:#9db3b8; font-size:.85rem; }
</style>
</head>
<body>
<header class="page">
  <div class="kicker">VYN — SET 04b galaxies</div>
  <h1>galaxyDashed — 5 variations</h1>
  <p class="sub">Upper-sky context with a sprinkle of stars; every variant keeps the cut-paper
  dashed-line language in the set's galaxy tones. Pick one and it becomes the new
  <code>galaxyDashed</code> element.</p>
</header>
${GALAXIES.map(tile).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-galaxy.html", page);
console.log(`wrote vyn-parallax-galaxy.html (${(fs.statSync("vyn-parallax-galaxy.html").size / 1e3).toFixed(0)} KB)`);
