/**
 * Hero background bake-off: screenshots the hero section (text included)
 * once per candidate artwork in public/images/hero/candidates/. Each run
 * waits out the splash, strips the <picture>'s negotiated <source> slots and
 * points the hero <img> directly at the candidate (transparency therefore
 * shows the page's --color-bg behind it), then screenshots to
 * <tmp>/hero-<candidate>.png. Run: `node scripts/shot-hero-variants.mjs`
 * against a dev server on port 3333.
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";
const CANDIDATES = [
  "original-main-bg.jpg",
  "upscaled-current.png",
  "main-bg-2.jpg",
  "hands-lines-transparent.png",
  "transparent-upscaled.png",
  "hands-no-dark-final.png",
];

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

for (const candidate of CANDIDATES) {
  const ok = await page.evaluate(async (name) => {
    const img = document.querySelector('section[aria-labelledby="hero-title"] img');
    if (!img) return "no hero img";
    const picture = img.closest("picture");
    picture?.querySelectorAll("source").forEach((s) => s.remove());
    img.srcset = "";
    img.sizes = "auto";
    img.src = `/images/hero/candidates/${name}`;
    try {
      await img.decode();
    } catch {
      return "decode failed";
    }
    return img.currentSrc;
  }, candidate);
  console.log(candidate, "→", ok);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({
    path: `${OUT}/hero-${candidate.replace(/\.[a-z]+$/, "")}.png`,
  });
}
await browser.close();
console.log("done");
