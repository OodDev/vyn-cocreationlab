import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const target = process.argv[2] ?? "http://localhost:3000/";
const variant = process.argv[3] ?? "splash"; // "splash" | "nosplash"

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=412,823"],
});
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });

// Set the splash's sessionStorage skip flag BEFORE navigation → boot script
// leaves data-splash unset → overlay stays display:none.
if (variant === "nosplash") {
  const client = await page.target().createCDPSession();
  await client.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `try { window.sessionStorage.setItem("vyn:splash","1"); } catch {}`,
  });
}

await page.evaluateOnNewDocument(() => {
  window.__observed = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__observed.push({
          t: Math.round(e.startTime),
          size: Math.round(e.size),
          cls: e.element
            ? e.element.tagName + "." + (e.element.className || "").slice(0, 40)
            : null,
          url: e.url && e.url.split("/").pop(),
        });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {}
});

await page.goto(target, { waitUntil: "load", timeout: 30000 });
await new Promise((r) => setTimeout(r, 5000));
const out = await page.evaluate(() => ({
  attr: document.documentElement.getAttribute("data-splash"),
  observed: window.__observed,
  direct: performance.getEntriesByType("largest-contentful-paint").map((e) => ({
    t: Math.round(e.startTime),
    size: Math.round(e.size),
    url: e.url && e.url.split("/").pop(),
  })),
}));
console.log("variant:", variant);
console.log(JSON.stringify(out, null, 1));
await browser.close();
