import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1800));
const out = await page.evaluate(() => {
  const rules = [];
  const walk = (rs) => {
    for (const r of rs ?? []) {
      if (r.type === CSSRule.KEYFRAMES_RULE) {
        if (r.name.startsWith("px-")) rules.push(r.cssText);
      } else if (r.cssRules) walk(r.cssRules);
    }
  };
  for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} }
  return rules;
});
console.log(out.join("\n\n"));
await browser.close();
