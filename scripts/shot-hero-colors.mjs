/**
 * Scratch: showcases the hero section ("Get in touch" CTA visible) in three
 * background treatments:
 *   1. hero-color-1-original.png — as it is (dark artwork)
 *   2. hero-color-2-orange.png   — website orange (#f79c00) bg
 *   3. hero-color-3-white.png    — white bg
 * Light variants hide the artwork, keep the CTA cyan accent and darken the
 * type for legibility. Scratch output — intentionally untracked.
 * Run with `node scripts/shot-hero-colors.mjs` against a dev server on :3333.
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/Users/pol/Documents/[X]/WebDev 2026/PillonSuka/VYN_CoCreationLab_MAIN2_deeps/hero-color-shots";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Waits through the ~3.4s splash + scramble entrance window so the shot is settled.
await page.goto("http://localhost:4567/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 7000));
await page.screenshot({ path: `${OUT}/hero-color-1-original.png` });

// Shared override: kill the artwork + gradients, repaint the section.
const variants = [
  {
    file: "hero-color-2-orange.png",
    css: `
      section[aria-labelledby="hero-title"] { background: #f79c00 !important; }
      section[aria-labelledby="hero-title"] img { display: none !important; }
      section[aria-labelledby="hero-title"] [aria-hidden="true"].bg-gradient-to-t,
      section[aria-labelledby="hero-title"] [aria-hidden="true"].bg-gradient-to-r { display: none !important; }
      section[aria-labelledby="hero-title"], section[aria-labelledby="hero-title"] h1,
      section[aria-labelledby="hero-title"] h1 span { color: #1c1200 !important; }
      section[aria-labelledby="hero-title"] .text-muted,
      section[aria-labelledby="hero-title"] .kicker { color: #3d2a00 !important; }
      section[aria-labelledby="hero-title"] a[href^="mailto"] { color: #04121a !important; }
    `,
  },
  {
    file: "hero-color-3-white.png",
    css: `
      section[aria-labelledby="hero-title"] { background: #ffffff !important; }
      section[aria-labelledby="hero-title"] img { display: none !important; }
      section[aria-labelledby="hero-title"] [aria-hidden="true"].bg-gradient-to-t,
      section[aria-labelledby="hero-title"] [aria-hidden="true"].bg-gradient-to-r { display: none !important; }
      section[aria-labelledby="hero-title"], section[aria-labelledby="hero-title"] h1,
      section[aria-labelledby="hero-title"] h1 span { color: #0b1220 !important; }
      section[aria-labelledby="hero-title"] .text-muted,
      section[aria-labelledby="hero-title"] .kicker { color: #46555f !important; }
      section[aria-labelledby="hero-title"] a[href^="mailto"] { color: #04090c !important; }
    `,
  },
];

for (const v of variants) {
  await page.addStyleTag({ content: v.css });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: `${OUT}/${v.file}` });
}

await browser.close();
console.log("shots written");
