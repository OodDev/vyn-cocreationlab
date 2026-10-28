import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3333/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1500));

const info = await page.evaluate(() => {
  const scene = document.querySelector(".px-scene");
  const y = window.scrollY;
  return { pinStart: Math.round(scene.getBoundingClientRect().top + y), pinEnd: Math.round(scene.getBoundingClientRect().top + y + scene.offsetHeight - window.innerHeight) };
});

for (const frac of [0.15, 0.3, 0.42]) {
  const y = info.pinStart + (info.pinEnd - info.pinStart) * frac;
  await page.evaluate((yy) => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, yy); }, y);
  await new Promise((r) => setTimeout(r, 400));
  const progress = await page.evaluate(() =>
    Object.fromEntries(document.getAnimations().filter((a) => ["px-thread", "px-thread-tail"].includes(a.animationName)).map((a) => [a.animationName || "?", +a.effect.getComputedTiming().progress.toFixed(2)])));
  console.log(`frac ${frac}`, JSON.stringify(progress));
  await page.screenshot({ path: `${OUT}/px-thread-${Math.round(frac * 100)}.png` });
}
await browser.close();
console.log("done");
