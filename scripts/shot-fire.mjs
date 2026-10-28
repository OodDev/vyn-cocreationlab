import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL =
  "file:///Users/pol/Documents/[X]/WebDev 2026/PillonSuka/VYN_CoCreationLab_WebsiteQuick/vyn-parallax-fire.html";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";

const only = process.argv[2] ? process.argv[2].split(",") : null;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1.4 });
await page.goto(FILE_URL, { waitUntil: "networkidle0" });

const scenes = await page.$$(".prop-scene");
console.log(`found ${scenes.length} fire tiles`);
for (const scene of scenes) {
  const name = await scene.evaluate((el) => el.dataset.name);
  if (only && !only.includes(name)) continue;
  await page.evaluate((el) => el.scrollIntoView({ block: "center" }), scene);
  await new Promise((r) => setTimeout(r, 100));
  await scene.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`captured ${name}.png`);
}
await browser.close();
