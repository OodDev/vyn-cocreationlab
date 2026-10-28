import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const target = process.argv[2] ?? "http://localhost:3000/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=412,823"],
});
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });
// Optional real throttling, mirroring Lighthouse mobile (slow 4G + 4x CPU):
//   node scripts/lcp-probe.mjs <url> throttled
if (process.argv[3] === "throttled") {
  await page.emulateNetworkConditions({
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await page.emulateCPUThrottling(4);
}
await page.evaluateOnNewDocument(() => {
  window.__lcp = [];
  window.__paint = [];
  window.__samples = [];
  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__lcp.push({
          t: Math.round(e.startTime),
          size: Math.round(e.size),
          cls: e.element
            ? e.element.tagName + "." + (e.element.className || "").slice(0, 60)
            : null,
          url: e.url,
        });
      }
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        window.__paint.push({ t: Math.round(e.startTime), name: e.name });
    }).observe({ type: "paint", buffered: true });
  } catch {}

  // Sample hero visibility + image load state at intervals, appended with timestamp.
  const heroImgSel = 'section[aria-labelledby="hero-title"] img';
  const heroTitleSel = "#hero-title > span";
  let last = -1;
  const tick = () => {
    const t = Math.round(performance.now());
    if (t < last + 400) return void requestAnimationFrame(tick);
    last = t;
    const img = document.querySelector(heroImgSel);
    const title = document.querySelector(heroTitleSel);
    const op = (el) => (el ? getComputedStyle(el).opacity : "n/a");
    window.__samples.push({
      t,
      vis: document.visibilityState,
      imgComplete: img ? img.complete : "n/a",
      imgSrc: img ? (img.currentSrc || img.src || "").split("/").pop() : "n/a",
      imgOpacity: op(img),
      imgRect: img
        ? (() => {
            const r = img.getBoundingClientRect();
            return `${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.top)}`;
          })()
        : "n/a",
      titleOpacity: title.textContent?.slice(0, 8) + ":" + op(title),
      splash: document.documentElement.getAttribute("data-splash"),
    });
    if (t < 6500) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await page.goto(target, { waitUntil: "load", timeout: 30000 });
await new Promise((r) => setTimeout(r, 7500));
const out = await page.evaluate(() => ({
  lcp: window.__lcp,
  paint: window.__paint,
  samples: window.__samples,
}));
console.log(JSON.stringify(out, null, 1));
await browser.close();
