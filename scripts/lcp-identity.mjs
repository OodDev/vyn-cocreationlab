import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 600 });
await page.emulateCPUThrottling(4);
await page.emulateNetworkConditions({
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
});
await page.evaluateOnNewDocument(() => {
  window.__lcp = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      const el = e.element?.tagName + "." + String(e.element?.className ?? "").slice(0, 60);
      window.__lcp.push({ t: Math.round(e.startTime), size: Math.round(e.size), el });
    }
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
await page.goto("http://localhost:3000/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 9000));
const entries = await page.evaluate(() => window.__lcp);
for (const e of entries) console.log(JSON.stringify(e));
await browser.close();
