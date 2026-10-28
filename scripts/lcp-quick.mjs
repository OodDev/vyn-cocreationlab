import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const variants = [
  { name: "desktop", vp: null, cpu: 0, net: false },
  {
    name: "mobile-nodpr",
    vp: { width: 412, height: 823, deviceScaleFactor: 1, isMobile: true },
    cpu: 0,
    net: false,
  },
  { name: "desktop-cpu4x", vp: null, cpu: 4, net: false },
  {
    name: "mobile-full-throttle",
    vp: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true },
    cpu: 4,
    net: true,
  },
];
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
for (const v of variants) {
  const page = await browser.newPage();
  if (v.vp) await page.setViewport(v.vp);
  if (v.cpu) await page.emulateCPUThrottling(v.cpu);
  if (v.net)
    await page.emulateNetworkConditions({
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
  await page.evaluateOnNewDocument(() => {
    window.__l = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        window.__l.push({
          t: Math.round(e.startTime),
          size: Math.round(e.size),
          url: (e.url || "").split("/").pop(),
          tag: e.element?.tagName,
        });
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, v.net ? 9000 : 5000));
  console.log(v.name + ":", JSON.stringify(await page.evaluate(() => window.__l)));
  await page.close();
}
await browser.close();
