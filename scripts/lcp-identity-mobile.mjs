import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });
await page.evaluateOnNewDocument(() => {
  window.__lcp = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries())
      window.__lcp.push({
        t: Math.round(e.startTime),
        size: Math.round(e.size),
        tag: e.element?.tagName,
        cls: String(e.element?.className ?? "").slice(0, 40),
      });
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
const url = process.argv[2] ?? "http://localhost:3000/";
await page.goto(url, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 8000));
console.log(url, JSON.stringify(await page.evaluate(() => window.__lcp)));
await browser.close();
