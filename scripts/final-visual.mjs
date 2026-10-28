import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
const shots = [
  { name: "home-mobile", vp: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true }, wait: 3000 },
  { name: "home-desktop", vp: { width: 1440, height: 900, deviceScaleFactor: 1 }, wait: 3000 },
];
for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport(s.vp);
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, s.wait));
  await page.screenshot({ path: `/tmp/final-${s.name}.png` });
  await page.close();
}
await browser.close();
console.log("done");
