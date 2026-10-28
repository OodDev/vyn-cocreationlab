import puppeteer from "puppeteer-core";

/**
 * Verify the overlapping-assembly parallax choreography (see globals.css
 * px-* block): drive the scroll through the pre-pin roll-in AND the pin,
 * read each layer's transform and the px-* animation progresses, and
 * screenshot the sticky viewport at each stop so the assembly can be
 * eyeballed frame by frame.
 *
 * Fractions are pin-relative: negative = pre-pin roll (PIN ~(frac·100)%
 * on the HUD, e.g. frac −0.34 = "PIN −34%"), 0 = lock, 1 = release.
 *
 * Usage: node scripts/verify-parallax-assembly.mjs [port] (default 3000)
 */
const PORT = process.argv[2] ?? "3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = decodeURIComponent(new URL("../parallax-shots/", import.meta.url).pathname);
import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1800));

const info = await page.evaluate(() => {
  const scene = document.querySelector(".px-scene");
  const y = window.scrollY;
  const top = scene.getBoundingClientRect().top + y;
  return {
    supportsView: CSS.supports("animation-timeline", "view()"),
    pinStart: Math.round(top),
    pinEnd: Math.round(top + scene.offsetHeight - window.innerHeight),
  };
});
console.log(JSON.stringify(info));

const readState = () =>
  page.evaluate(() => {
    const transform = (sel) => {
      const m = getComputedStyle(document.querySelector(sel)).transform;
      if (m === "none") return null;
      const v = m.match(/matrix\(([^)]+)\)/);
      if (!v) return m;
      const p = v[1].split(",").map(Number);
      return { ty: +p[5].toFixed(1), sx: +p[0].toFixed(3) };
    };
    const progress = {};
    for (const a of document.getAnimations()) {
      const n = a.animationName ?? "";
      if (n.startsWith("px-")) {
        const p = a.effect.getComputedTiming().progress;
        if (p != null) progress[n] = Number(p.toFixed(3));
      }
    }
    return {
      bg: transform(".px-layer-bg"),
      mid: transform(".px-layer-mid"),
      midfront: transform(".px-layer-midfront"),
      fg: transform(".px-layer-fg"),
      line1: Number(getComputedStyle(document.querySelector(".px-line1")).opacity),
      line2: Number(getComputedStyle(document.querySelector(".px-line2")).opacity),
      progress,
    };
  });

const FRACTIONS = [
  -0.6, -0.44, -0.34, -0.23, -0.12, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.62, 0.75,
  0.92, 1,
];
for (const frac of FRACTIONS) {
  const y = info.pinStart + (info.pinEnd - info.pinStart) * frac;
  await page.evaluate((yy) => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, yy);
  }, y);
  await new Promise((r) => setTimeout(r, 350));
  const state = await readState();
  console.log(`frac ${frac}`, JSON.stringify(state));
  // Negative fracs are the pre-pin roll-in → tag shots "rollNN" so files
  // sort cleanly: roll60 … roll12, 00 (lock) … 100 (release).
  const abs = Math.abs(Math.round(frac * 100));
  const tag =
    frac < 0 ? `roll${String(abs).padStart(2, "0")}` : String(abs).padStart(2, "0");
  await page.screenshot({
    path: `${OUT}assembly-${tag}.png`,
  });
}
await browser.close();
console.log("screenshots written to parallax-shots/");
