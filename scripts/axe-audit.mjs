import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
const axeSource = readFileSync(
  new URL("../node_modules/axe-core/axe.min.js", import.meta.url),
  "utf8",
);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pages = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
let failed = false;
for (const path of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });
  await page.goto(`http://localhost:3000${path}`, { waitUntil: "load" });
  // Let the splash finish so axe sees the resting state (axe freezes animations itself as well).
  await new Promise((r) => setTimeout(r, 2800));
  await page.evaluate(axeSource);
  const results = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    }),
  );
  const violations = results.violations.filter((v) => v.impact && v.impact !== "minor");
  console.log(`== ${path} == impact≥moderate violations: ${violations.length}`);
  for (const v of violations) {
    failed = true;
    console.log(`  [${v.impact}] ${v.id} (${v.help})`);
    for (const n of v.nodes.slice(0, 4))
      console.log(`    node: ${(n.target ?? []).join(" ")}`.slice(0, 140));
  }
  if (violations.length === 0) console.log("  clean ✓");
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
