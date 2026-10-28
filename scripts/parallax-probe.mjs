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
await new Promise((r) => setTimeout(r, 1500));

const info = await page.evaluate(() => {
  const scene = document.querySelector(".px-scene");
  const y = window.scrollY;
  const top = scene.getBoundingClientRect().top + y;
  const h = scene.offsetHeight;
  const vh = window.innerHeight;
  const anims = document.getAnimations();
  return {
    supportsView: CSS.supports("animation-timeline", "view()"),
    prefersReduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    totalAnims: anims.length,
    pxAnims: anims.filter((a) => (a.animationName ?? "").startsWith("px-")).length,
    pinStart: Math.round(top),
    pinEnd: Math.round(top + h - vh),
  };
});
console.log(JSON.stringify(info, null, 2));

const readState = () =>
  page.evaluate(() => {
    const sels = [".px-layer-bg", ".px-layer-mid", ".px-layer-fg", ".px-line1", ".px-line2"];
    const out = {};
    for (const s of sels) out[s] = getComputedStyle(document.querySelector(s)).transform;
    out.progress = Object.fromEntries(
      document
        .getAnimations()
        .filter((a) => (a.animationName ?? "").startsWith("px-"))
        .map((a) => [a.animationName, a.effect.getComputedTiming().progress]),
    );
    return out;
  });

for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
  const y = info.pinStart + (info.pinEnd - info.pinStart) * frac;
  await page.evaluate((yy) => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, yy);
  }, y);
  await new Promise((r) => setTimeout(r, 400));
  const state = await readState();
  console.log(`frac ${frac} @y=${Math.round(y)}`, JSON.stringify(state, null, 1));
  await page.screenshot({ path: `${OUT}/parallax-${Math.round(frac * 100)}.png` });
}
await browser.close();
console.log("done");
