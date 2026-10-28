/**
 * Generates vyn-parallax-props.html — 5 RULER + 5 NEEDLE variations for
 * SET 04b (cut-paper two worlds). Deterministic, no randomness.
 *
 * Ruler tiles: 1440×160 (the very bottom strip of the scene).
 * Needle tiles: 1440×460 (mountain tone above the seam, sewing ground below),
 * so every variant reads in its natural scene context.
 */
import fs from "node:fs";

const rim = "#7fb0bc"; // pale cut-paper edge light
const fill = "#04161d"; // prop silhouette fill
const orange = "#f79c00";
const mount = "#08222c"; // mountain band tone
const groundC = "#021016"; // sewing ground tone
const seamCol = "#3f7280";
const f1 = (v) => Number(v.toFixed(1));

const rulerBG = `<rect width="1440" height="160" fill="${groundC}"/>`;
const needleBG = `<rect width="1440" height="330" fill="${mount}"/>
  <rect y="330" width="1440" height="130" fill="${groundC}"/>
  <line x1="0" y1="330" x2="1440" y2="330" stroke="${seamCol}" stroke-width="2.2" stroke-dasharray="2 9"/>`;

/* ── rulers ──────────────────────────────────────────────────────────── */
function ticks(x0, x1, yTop, down, step, majorEvery, hMinor, hMajor, dash = "") {
  let out = "";
  let i = 0;
  for (let x = x0; x <= x1; x += step, i++) {
    const major = i % majorEvery === 0;
    const len = major ? hMajor : hMinor;
    const y2 = down ? yTop + len : yTop - len;
    out += `<line x1="${x}" y1="${yTop}" x2="${x}" y2="${f1(y2)}" stroke="${rim}" stroke-width="${major ? 2 : 1.3}"${dash}/>`;
  }
  return out;
}

/* R1 · straight strip — the current baseline */
const r1 = `
  <rect x="0" y="118" width="1440" height="32" fill="${fill}" stroke="${rim}" stroke-width="1.6"/>
  ${ticks(0, 1440, 118, true, 40, 5, 9, 16)}`;

/* R2 · tape measure — rounded ends, hook loop, ticks from the top edge, orange datum line */
const r2 = `
  <rect x="10" y="106" width="1420" height="42" rx="19" fill="${fill}" stroke="${rim}" stroke-width="1.8"/>
  <circle cx="30" cy="127" r="7" fill="none" stroke="${rim}" stroke-width="3"/>
  ${ticks(56, 1400, 106, true, 39, 5, 11, 18)}
  <line x1="56" y1="138" x2="1400" y2="138" stroke="${orange}" stroke-width="2" stroke-dasharray="6 6" opacity="0.8"/>`;

/* R3 · zigzag cut edge — paper-cut sawtooth top edge, ticks rising from the bottom */
const zigPts = Array.from({ length: 24 }, (_, i) => `${(i + 1) * 60},${i % 2 === 0 ? 134 : 116}`).join(" ");
const r3 = `
  <path d="M 0 116 L ${zigPts} L 1440 116 L 1440 150 L 0 150 Z" fill="${fill}" stroke="${rim}" stroke-width="1.6"/>
  ${ticks(20, 1440, 150, false, 40, 5, 8, 15)}`;

/* R4 · perforated ghost — outline only, everything dashed like a stitch perforation */
const r4 = `
  <rect x="0" y="118" width="1440" height="32" fill="none" stroke="${rim}" stroke-width="1.6" stroke-dasharray="3 9"/>
  ${ticks(0, 1440, 118, true, 40, 5, 9, 16, ` stroke-dasharray="2 5"`)}
  <line x1="0" y1="150" x2="1440" y2="150" stroke="${rim}" stroke-width="1.2" stroke-dasharray="2 7" opacity="0.7"/>`;

/* R5 · soft measuring tape — wavy cloth ribbon with perpendicular ticks + orange datum */
function cubicPt(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const b0 = u * u * u, b1 = 3 * u * u * t, b2 = 3 * u * t * t, b3 = t * t * t;
  return [p0[0] * b0 + p1[0] * b1 + p2[0] * b2 + p3[0] * b3,
          p0[1] * b0 + p1[1] * b1 + p2[1] * b2 + p3[1] * b3];
}
const tapeSegs = [
  [[0, 110], [360, 70], [720, 140], [1080, 96]],
  [[1080, 96], [1260, 78], [1350, 100], [1440, 92]],
];
const tapePts = [];
for (const s of tapeSegs) for (let i = 0; i <= 24; i++) tapePts.push(cubicPt(s[0], s[1], s[2], s[3], i / 24));
const top = [], bot = [], ticksR5 = [];
tapePts.forEach((p, i) => {
  const q = tapePts[Math.min(i + 1, tapePts.length - 1)];
  const r = tapePts[Math.max(i - 1, 0)];
  const dx = q[0] - r[0], dy = q[1] - r[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  top.push([p[0] + nx * 13, p[1] + ny * 13]);
  bot.push([p[0] - nx * 13, p[1] - ny * 13]);
  if (i % 3 === 0) {
    const major = i % 15 === 0;
    ticksR5.push(`<line x1="${f1(p[0] - nx * 13)}" y1="${f1(p[1] - ny * 13)}" x2="${f1(p[0] + nx * 13)}" y2="${f1(p[1] + ny * 13)}" stroke="${rim}" stroke-width="${major ? 2 : 1.2}"/>`);
  }
});
const ribbonPath = `M ${top.map((p) => p.map(f1).join(" ")).join(" L ")} L ${bot.reverse().map((p) => p.map(f1).join(" ")).join(" L ")} Z`;
const r5 = `
  <path d="${ribbonPath}" fill="${fill}" stroke="${rim}" stroke-width="1.6"/>
  ${ticksR5.join("")}
  <path d="M 0 110 C 360 70 720 140 1080 96 C 1260 78 1350 100 1440 92" fill="none" stroke="${orange}" stroke-width="1.6" stroke-dasharray="5 6" opacity="0.8"/>`;

/* ── needles ─────────────────────────────────────────────────────────── */
/** needle body along +x, butt at origin, eye near the tip (same proportions as the scene needle) */
const needleBody = (len) => `<path d="M 0 -6 L ${len - 26} -2 L ${len} 0 L ${len - 26} 3 L 0 6 Z" fill="${fill}" stroke="${rim}" stroke-width="1.8"/>
  <ellipse cx="${len - 34}" cy="0" rx="7" ry="4" fill="none" stroke="${rim}" stroke-width="2.2"/>`;

/* N1 · driven 40° — the current baseline, butt at the seam, tip buried in the ground */
const n1 = `
  <g transform="translate(180 330) rotate(40)">${needleBody(200)}</g>`;

/* N2 · lying on the ground — horizontal, thread trailing from the eye to the right */
const n2 = `
  <g transform="translate(520 386) rotate(-3)">${needleBody(260)}</g>
  <path d="M 748 372 C 850 398 950 394 1060 382 C 1150 374 1260 382 1360 376" fill="none" stroke="${orange}" stroke-width="3" stroke-linecap="round"/>`;

/* N3 · curved needle — crescent silhouette, eye at the tip, thread dangling to the ground */
const n3 = `
  <path d="M 150 250 Q 300 150 440 200 Q 310 180 158 262 Z" fill="${fill}" stroke="${rim}" stroke-width="1.8"/>
  <ellipse cx="424" cy="202" rx="7" ry="4" fill="none" stroke="${rim}" stroke-width="2.2" transform="rotate(-18 424 202)"/>
  <path d="M 428 208 C 490 268 430 330 340 344 C 260 356 200 336 140 352" fill="none" stroke="${orange}" stroke-width="3" stroke-linecap="round"/>`;

/* N4 · upright mast — stuck point-down like a flagpole, thread hanging from the eye and pooling
   (mirrored horizontally: thread falls to the LEFT; much smaller eye) */
const n4 = `
  <g transform="translate(360 330)">
    <path d="M 6 0 L 2 -240 L 0 -254 L -3 -240 L -6 0 Z" fill="${fill}" stroke="${rim}" stroke-width="1.8"/>
    <ellipse cx="0" cy="-234" rx="2.2" ry="3.4" fill="none" stroke="${rim}" stroke-width="1.6"/>
  </g>
  <path d="M 357 100 C 342 170 306 230 256 280 C 220 314 160 336 80 344 C 20 350 0 372 60 376 C 110 379 120 362 70 358" fill="none" stroke="${orange}" stroke-width="3" stroke-linecap="round"/>`;

/* N5 · crossed pair — two needles forming an X, linked by a thread arc over the top */
const n5 = `
  <g transform="translate(600 340) rotate(-28)">${needleBody(260)}</g>
  <g transform="translate(840 340) rotate(-152)">${needleBody(260)}</g>
  <path d="M 800 234 C 760 150 680 150 641 234" fill="none" stroke="${orange}" stroke-width="3" stroke-linecap="round"/>`;

/* ── assemble page ───────────────────────────────────────────────────── */
const RULERS = [
  ["r1-straight", "R1 · straight strip", "current baseline — flat strip, major/minor ticks down from the top edge", r1],
  ["r2-tape", "R2 · tape measure", "rounded ends, metal hook loop at the left, ticks from the top edge, orange datum line near the bottom", r2],
  ["r3-zigzag", "R3 · zigzag cut edge", "paper-cut sawtooth top edge, ticks rising from the bottom edge", r3],
  ["r4-perforated", "R4 · perforated ghost", "no fill — outline and ticks all dashed, like the ruler was stitch-perforated into the ground", r4],
  ["r5-softtape", "R5 · soft measuring tape", "wavy cloth ribbon flowing across the bottom, ticks perpendicular to the curve, dashed orange datum", r5],
];
const NEEDLES = [
  ["n1-driven", "N1 · driven 40°", "current baseline — butt at the seam, tip buried in the ground at 40°", n1],
  ["n2-lying", "N2 · lying on the ground", "horizontal on the sewing ground, orange thread trailing from the eye to the right", n2],
  ["n3-curved", "N3 · curved needle", "crescent silhouette mid-air, eye at the tip, thread dangling down to the ground", n3],
  ["n4-upright", "N4 · upright mast", "stuck point-down like a flagpole, eye at the top, thread hanging and pooling on the ground", n4],
  ["n5-crossed", "N5 · crossed pair", "two needles forming an X rooted in the ground, linked by an orange thread arc over the top", n5],
];

const tile = ([id, name, desc, svg], vb, ratio, bg) => `<section class="prop" id="${id}">
  <div class="prop-scene" data-name="${id}" style="aspect-ratio:${ratio}"><svg viewBox="${vb}" aria-hidden="true">${bg}${svg}</svg></div>
  <div class="prop-label"><code>${id}</code><strong>${name}</strong><span>${desc}</span></div>
</section>`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SET 04b — ruler &amp; needle variations</title>
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
  <div class="kicker">VYN — SET 04b props</div>
  <h1>Ruler &amp; needle — 5 variations each</h1>
  <p class="sub">Same cut-paper language as the set: dark silhouette fill, pale rim light, orange as the
  only accent. Ruler tiles show the very bottom strip of the scene (1440×160). Needle tiles show the
  seam line and ground (1440×460). Pick a variant per prop and it becomes the new <code>ruler</code> /
  <code>needle</code> element.</p>
</header>
<h2 style="max-width:1100px;margin:2em auto 0;padding:0 24px">Rulers</h2>
${RULERS.map((v) => tile(v, "0 0 1440 160", "1440/160", rulerBG)).join("")}
<h2 style="max-width:1100px;margin:2em auto 0;padding:0 24px">Needles</h2>
${NEEDLES.map((v) => tile(v, "0 0 1440 460", "1440/460", needleBG)).join("")}
</body>
</html>`;

fs.writeFileSync("vyn-parallax-props.html", page);
console.log(`wrote vyn-parallax-props.html (${(fs.statSync("vyn-parallax-props.html").size / 1e3).toFixed(0)} KB)`);
