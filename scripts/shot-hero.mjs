/**
 * Shoots the hero section with the splash + entrance animations settled
 * (waits through the ~3.4s splash/scramble window) and reports what the
 * LCP <img> actually loaded. Run with `node scripts/shot-hero.mjs` against
 * a dev server on port 3333.
 */
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3333/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 7000)); // splash + scramble settle
await page.screenshot({ path: `${OUT}/hero.png` });

const lcp = await page.evaluate(() => {
  const img = document.querySelector("img");
  return {
    currentSrc: img?.currentSrc ?? null,
    naturalWidth: img?.naturalWidth ?? null,
  };
});
console.log(JSON.stringify(lcp, null, 2));
await browser.close();
