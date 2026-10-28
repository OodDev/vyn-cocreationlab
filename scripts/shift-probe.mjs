import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const target = process.argv[2] ?? "http://localhost:3000/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=412,823"],
});
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1, isMobile: true });
await page.evaluateOnNewDocument(() => {
  window.__shift = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__shift.push({
          t: Math.round(e.startTime),
          value: Math.round(e.value * 1000) / 1000,
          score: Math.round((e.layoutShift || {}).value * 1000) / 1000,
          sources: (e.sources || []).slice(0, 6).map((s) => {
            const n = s.node;
            if (!n) return "none";
            const r =
              s.previousRect && s.currentRect
                ? `prev(x${s.previousRect.x},y${s.previousRect.y},h${s.previousRect.height},w${s.previousRect.width})→cur(x${s.currentRect.x},y${s.currentRect.y},h${s.currentRect.height},w${s.currentRect.width})`
                : "";
            const desc =
              (n.nodeName ?? "?") +
              " " +
              (typeof n.className === "string" ? n.className.slice(0, 70) : "") +
              (n.id ? "#" + n.id : "");
            return desc + " " + r;
          }),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch {}
});
await page.goto(target, { waitUntil: "load", timeout: 30000 });
await new Promise((r) => setTimeout(r, 8000));
const out = await page.evaluate(() => window.__shift);
console.log(JSON.stringify(out, null, 1));
await browser.close();
