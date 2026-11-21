/**
 * Shoots the splashscreen close up while it is still on screen (the glow
 * banding check): a full-viewport shot and a tight center clip that makes
 * ring banding obvious. Run: `node scripts/shot-splash.mjs` against a dev
 * server on port 3333.
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
await new Promise((r) => setTimeout(r, 2200)); // mid-splash, logo drawn
await page.screenshot({ path: `${OUT}/splash-full.png` });
await page.screenshot({
  path: `${OUT}/splash-center.png`,
  clip: { x: 370, y: 130, width: 700, height: 640 },
});
await browser.close();
console.log("done");
