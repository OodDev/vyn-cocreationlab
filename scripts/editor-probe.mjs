import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1300, height: 950 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(
  "file:///Users/pol/Documents/[X]/WebDev 2026/PillonSuka/VYN_CoCreationLab_WebsiteQuick/vyn-parallax-editor.html",
  { waitUntil: "networkidle0" },
);

// drag the moon: try several points inside its bbox until one lands on painted pixels
const moon = await page.$('g[data-el="moon"]');
const box = await moon.boundingBox();
let json = "{}";
outer: for (const fx of [0.2, 0.3, 0.15, 0.4, 0.5, 0.6, 0.7, 0.8]) {
  for (const fy of [0.3, 0.5, 0.2, 0.7]) {
    const px = box.x + box.width * fx;
    const py = box.y + box.height * fy;
    await page.mouse.move(px, py);
    await page.mouse.down();
    await page.mouse.move(px - 100, py + 50, { steps: 4 });
    await page.mouse.up();
    json = await page.$eval("#json", (el) => el.value);
    if (json !== "{}") break outer;
  }
}
const hud = await page.$eval("#hud", (el) => el.textContent);
const moonTransform = await page.$eval('g[data-el="moon"]', (el) => el.getAttribute("transform"));
await page.screenshot({ path: `${OUT}/editor-probe.png` });
console.log("pageerrors:", errors.length ? errors : "none");
console.log("json:", json);
console.log("hud:", hud);
console.log("moon transform:", moonTransform);
await browser.close();
