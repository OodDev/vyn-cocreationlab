/**
 * Build-time asset generator (run before `next build`).
 *
 * 1. Pre-optimizes the provided hero artwork (main-bg_UPSCAL.png) into
 *    AVIF + WebP responsive sets (via sharp) — required because static
 *    exports can't use Next's image optimizer. Width sets must match
 *    lib/media.ts.
 * 2. Renders the favicon set + OG fallback PNG from the geometric VYN
 *    letterforms (kept in sync with components/brand/vyn-wordmark.tsx).
 * 3. Generates per-project placeholder "website preview" SVG artwork.
 *
 * Deterministic, idempotent, offline (no network).
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../content/projects.ts";

const ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR: string = join(ROOT, "public");

/* ── Geometry exported from components/brand/vyn-wordmark.tsx (viewBox 480×140)
      scaled to a 512 canvas for icons. ── */
const LETTERS = {
  V: "M112 132 L192 292 L272 132",
  Y: "M312 132 L368 208 L424 132",
  Y_STEM: "M368 208 L368 292",
  N: "M464 292 L464 132 L584 292 L584 132",
};

const DOT = { cx: 368, cy: 330, r: 14 };

const faviconsSvg = (withBgRounded = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 696 464" width="696" height="464">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="696" y2="464" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4be1ec"/>
      <stop offset="1" stop-color="#45e083"/>
    </linearGradient>
  </defs>
  ${withBgRounded ? `<rect width="696" height="464" rx="90" fill="#050d10"/>` : ""}
  <g transform="translate(48, 70)">
    <g fill="none" stroke="url(#g)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
      <path d="${LETTERS.V}"/>
      <path d="${LETTERS.Y} ${LETTERS.Y_STEM}"/>
      <path d="${LETTERS.N}"/>
    </g>
    <circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="#45e083"/>
  </g>
</svg>
`;

const iconSquareSvg = (scale = 0.9) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4be1ec"/>
      <stop offset="1" stop-color="#45e083"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#050d10"/>
  <g transform="translate(${(512 - 696 * scale) / 2}, ${(512 - 464 * scale) / 2}) scale(${scale})">
    <g fill="none" stroke="url(#g)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
      <path d="${LETTERS.V}"/>
      <path d="${LETTERS.Y} ${LETTERS.Y_STEM}"/>
      <path d="${LETTERS.N}"/>
    </g>
    <circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="#45e083"/>
  </g>
</svg>
`;

/* Neutral OG fallback (letters + shapes only — no font dependency). */
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#050d10"/>
      <stop offset="0.68" stop-color="#0a1a20"/>
      <stop offset="1" stop-color="#07231f"/>
    </linearGradient>
    <linearGradient id="g" x1="100" y1="0" x2="640" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4be1ec"/>
      <stop offset="1" stop-color="#45e083"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.3" r="0.5">
      <stop offset="0" stop-color="#4be1ec" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#4be1ec" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(90,188) scale(1.15)">
    <g fill="none" stroke="url(#g)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round">
      <path d="${LETTERS.V}"/>
      <path d="${LETTERS.Y} ${LETTERS.Y_STEM}"/>
      <path d="${LETTERS.N}"/>
    </g>
    <circle cx="${DOT.cx}" cy="${DOT.cy}" r="${DOT.r}" fill="#45e083"/>
  </g>
  <g fill="none" stroke="#4be1ec" stroke-opacity="0.35" stroke-width="3" transform="translate(880,60) rotate(24)">
    <rect width="300" height="300" rx="48"/>
  </g>
  <g fill="none" stroke="#45e083" stroke-opacity="0.4" stroke-width="3" transform="translate(1020,380) rotate(45)">
    <rect width="110" height="110"/>
  </g>
  <g transform="translate(90,470)">
    <rect width="88" height="4" rx="2" fill="#4be1ec"/>
    <rect x="104" width="220" height="4" rx="2" fill="#45e083" opacity="0.7"/>
  </g>
</svg>
`;

/* Placeholder "website preview" browser mockup per project. */
function previewSvg(slug: string, index: number, title: string | undefined): string {
  const hueSets = [
    { a: "#4be1ec", b: "#2bb7c4" },
    { a: "#45e083", b: "#35a86a" },
    { a: "#4be1ec", b: "#45e083" },
    { a: "#9ff3f2", b: "#1f8fa0" },
    { a: "#45e083", b: "#4be1ec" },
    { a: "#2bb7c4", b: "#45e083" },
  ];
  const hue = hueSets[index % hueSets.length];
  if (hue === undefined) throw new Error("hue set missing");
  const { a, b } = hue;
  const labelIndex = String(index + 1).padStart(2, "0");

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="screen" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#071f26"/>
      <stop offset="0.62" stop-color="#0b2a31"/>
      <stop offset="1" stop-color="#0a1418"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="soft" cx="0.7" cy="0.25" r="0.6">
      <stop offset="0" stop-color="${a}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="500" rx="26" fill="#050d10"/>
  <g transform="translate(30,28)">
    <rect width="740" height="444" rx="16" fill="url(#screen)" stroke="#12333a" stroke-width="1.5"/>
    <rect width="740" height="44" rx="16" fill="#0e2026"/>
    <rect y="28" width="740" height="16" fill="#0e2026"/>
    <g fill="#2bb7c4" opacity="0.85">
      <circle cx="26" cy="22" r="6" fill="#e06d5a" opacity="0.9"/>
      <circle cx="48" cy="22" r="6" fill="#e0b45aff" opacity="0.9"/>
      <circle cx="70" cy="22" r="6" fill="#45e083"/>
    </g>
    <rect x="120" y="14" width="330" height="16" rx="8" fill="#0a161a" stroke="#164b53" stroke-width="1"/>
    <rect width="740" height="444" fill="url(#soft)"/>
    <g transform="translate(40,86)">
      <rect width="180" height="10" rx="5" fill="url(#brand)" opacity="0.95"/>
      <rect x="0" y="26" width="420" height="34" rx="8" fill="#d7ecee" opacity="0.92"/>
      <rect x="0" y="72" width="300" height="34" rx="8" fill="#d7ecee" opacity="0.55"/>
      <rect x="0" y="128" width="120" height="30" rx="15" fill="url(#brand)" opacity="0.9"/>
      <g transform="translate(0,196)">
        <rect width="212" height="120" rx="10" fill="#0f2b31" stroke="#164b53"/>
        <rect x="16" y="16" width="52" height="48" rx="8" fill="url(#brand)" opacity="0.85"/>
        <rect x="16" y="76" width="150" height="10" rx="5" fill="#9db3b8" opacity="0.7"/>
        <rect x="16" y="94" width="110" height="8" rx="4" fill="#9db3b8" opacity="0.4"/>
      </g>
      <g transform="translate(228,196)">
        <rect width="212" height="120" rx="10" fill="#0f2b31" stroke="#164b53"/>
        <rect x="16" y="16" width="52" height="48" rx="8" fill="url(#brand)" opacity="0.6"/>
        <rect x="16" y="76" width="150" height="10" rx="5" fill="#9db3b8" opacity="0.7"/>
        <rect x="16" y="94" width="110" height="8" rx="4" fill="#9db3b8" opacity="0.4"/>
      </g>
      <g transform="translate(456,196)">
        <rect width="212" height="120" rx="10" fill="#0f2b31" stroke="#164b53"/>
        <rect x="16" y="16" width="52" height="48" rx="8" fill="url(#brand)" opacity="0.75"/>
        <rect x="16" y="76" width="150" height="10" rx="5" fill="#9db3b8" opacity="0.7"/>
        <rect x="16" y="94" width="110" height="8" rx="4" fill="#9db3b8" opacity="0.4"/>
      </g>
    </g>
    <g transform="translate(596,392)" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#9db3b8">
      <text>PREVIEW ${labelIndex}</text>
    </g>
  </g>
</svg>
`.replace("{{TITLE}}", title ?? slug);
}

async function write(filePath: string, data: Buffer | string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, data);
  console.log("wrote", filePath.replace(PUBLIC_DIR, "public"));
}

async function main() {
  /* 1 ─ Hero responsive set */
  const HERO = [
    { w: 640, h: 360 },
    { w: 960, h: 540 },
    { w: 1280, h: 720 },
    { w: 1600, h: 900 },
    { w: 1920, h: 1080 },
    { w: 3200, h: 1800 },
    { w: 4778, h: 2688 },
  ];
  for (const { w, h } of HERO) {
    const base = sharp(join(ROOT, "main-bg_UPSCAL.png")).resize(w, h, { fit: "cover" });
    await write(
      join(PUBLIC_DIR, "images", "hero", `bg-${w}.avif`),
      await base.clone().avif({ quality: 48 }).toBuffer(),
    );
    await write(
      join(PUBLIC_DIR, "images", "hero", `bg-${w}.webp`),
      await base.clone().webp({ quality: 78 }).toBuffer(),
    );
  }

  /* 2 ─ Favicon set */
  await write(join(PUBLIC_DIR, "favicon", "favicon.svg"), faviconsSvg());
  const SQUARE_ICONS: Array<[string, number]> = [
    ["icon-32", 32],
    ["icon-96", 96],
    ["icon-192", 192],
    ["icon-512", 512],
  ];
  for (const [name, size] of SQUARE_ICONS) {
    await write(
      join(PUBLIC_DIR, "favicon", `${name}.png`),
      await sharp(Buffer.from(iconSquareSvg(0.86)))
        .resize(size, size)
        .png()
        .toBuffer(),
    );
  }
  await write(
    join(PUBLIC_DIR, "favicon", "apple-touch-icon.png"),
    await sharp(Buffer.from(iconSquareSvg(0.86)))
      .resize(180, 180)
      .png()
      .toBuffer(),
  );
  await write(
    join(PUBLIC_DIR, "favicon", "maskable-512.png"),
    await sharp(Buffer.from(iconSquareSvg(0.68)))
      .resize(512, 512)
      .png()
      .toBuffer(),
  );

  /* 2b ─ Stable OG fallback referenced from JSON-LD */
  await write(
    join(PUBLIC_DIR, "og", "vyn-og.png"),
    await sharp(Buffer.from(ogSvg)).png().toBuffer(),
  );

  /* 3 ─ Per-project preview placeholders */
  for (let i = 0; i < projects.length; i += 1) {
    const project = projects[i];
    if (project === undefined) continue;
    await write(
      join(PUBLIC_DIR, "images", "projects", `preview-${project.slug}.svg`),
      previewSvg(project.slug, i, project.title),
    );
  }
}

main()
  .then(function (): void {
    console.log("assets done");
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
