import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
for (const id of ["t1"]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  await page.evaluateOnNewDocument(() => {
    window.__lcp = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        window.__lcp.push({
          t: Math.round(e.startTime),
          size: Math.round(e.size),
          tag: e.element?.tagName,
          src: (e.url || "").split("/").pop(),
        });
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto(`http://localhost:3000/${id}.html`, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 2500));
  console.log(id, ":", JSON.stringify(await page.evaluate(() => window.__lcp)));
  await page.close();
}
await browser.close();
