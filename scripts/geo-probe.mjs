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
  window.__rows = [];
  let last = -1;
  const desc = (el, i) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      i,
      tag: el.tagName,
      cls: (typeof el.className === "string"
        ? el.className
        : (el.className?.baseVal ?? "")
      ).slice(0, 46),
      pos: cs.position,
      disp: cs.display,
      y: Math.round(r.y),
      h: Math.round(r.height),
      top: cs.top,
    };
  };
  const tick = () => {
    const t = Math.round(performance.now());
    if (t >= last + 400) {
      last = t;
      const kids = Array.from(document.body.children);
      window.__rows.push({
        t,
        htmlOverflow: getComputedStyle(document.documentElement).overflow,
        bodyOverflow: getComputedStyle(document.body).overflow,
        kids: kids.map(desc),
      });
    }
    if (t < 5200) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await page.goto(target, { waitUntil: "load", timeout: 30000 });
await new Promise((r) => setTimeout(r, 6000));
const out = await page.evaluate(() => window.__rows);
console.log(JSON.stringify(out, null, 1));
await browser.close();
