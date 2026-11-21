/**
 * Hero background bake-off: screenshots the hero section (text included)
 * once per candidate artwork in public/images/hero/candidates/. Each run
 * waits out the splash, strips the <picture>'s negotiated <source> slots and
 * points the hero <img> directly at the candidate (transparency therefore
 * shows the page's --color-bg behind it), then screenshots to
 * <tmp>/hero-<candidate>.png. Run: `node scripts/shot-hero-variants.mjs`
 * against a dev server on port 3333.
 */
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";
/** Repo-root source file → slug served under /images/hero/candidates/. */
const CANDIDATES = [
  ["main-bg.jpg", "original-main-bg.jpg"],
  ["main-bg_UPSCAL.png", "upscaled-current.png"],
  ["main-bg 2.jpg", "main-bg-2.jpg"],
  ["main-bg1_hands_lines_transparent.png", "hands-lines-transparent.png"],
  ["main-bg_transpUPSCAL.png", "transparent-upscaled.png"],
  ["main-bg_hands_no_dark_final.png", "hands-no-dark-final.png"],
];

/* Materialize candidates into public/ on demand; deleted again after the
 * run so the static export never ships them. */
const DEST = join(ROOT, "public", "images", "hero", "candidates");
rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
for (const [source, slug] of CANDIDATES) {
  copyFileSync(join(ROOT, source), join(DEST, slug));
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// One load; the splash settles once, then we permutate the artwork in place.
await page.goto("http://localhost:3333/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 7000));

for (const [, slug] of CANDIDATES) {
  const ok = await page.evaluate(async (candidate) => {
    const img = document.querySelector('section[aria-labelledby="hero-title"] img');
    if (!img) return "no hero img";
    const picture = img.closest("picture");
    picture?.querySelectorAll("source").forEach((s) => s.remove());
    img.srcset = "";
    img.sizes = "auto";
    img.src = `/images/hero/candidates/${candidate}`;
    try {
      await img.decode();
    } catch {
      return "decode failed";
    }
    return img.currentSrc;
  }, slug);
  console.log(slug, "→", ok);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({
    path: `${OUT}/hero-${slug.replace(/\.[a-z]+$/, "")}.png`,
  });
}
await browser.close();
rmSync(DEST, { recursive: true, force: true });
console.log("done");
