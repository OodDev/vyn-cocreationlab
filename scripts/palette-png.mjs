import puppeteer from "puppeteer-core";
import fs from "node:fs";

/**
 * Renders the site's color palette (the @theme tokens in app/globals.css,
 * dark theme) to vyn-palette.png. Headless Chrome screenshot of a
 * self-contained HTML page → no font/renderer surprises outside the browser.
 */

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "vyn-palette.png";

// name, label, css value, composited-over-bg hex, note
const SWATCHES = [
  ["--color-bg", "Background", "#050d10", "#050d10", "Page background (OLED-dark teal-black)"],
  ["--color-surface", "Surface", "#0a161a", "#0a161a", "Cards, footer, panels"],
  ["--color-elev", "Elevated", "#0e1e24", "#0e1e24", "Overlays, mobile menu, sticky header"],
  ["--color-line", "Hairline", "rgba(90,216,232,0.16)", "#132e33", "Borders, dividers (composited over bg)"],
  ["--color-line-strong", "Hairline strong", "rgba(90,216,232,0.32)", "#204e55", "Hover borders (composited over bg)"],
  ["--color-accent", "Accent (cyan)", "#4be1ec", "#4be1ec", "Primary neon — links, CTAs, focus ring (10:1 vs bg)"],
  ["--color-accent-dim", "Accent dim", "#2ba7b3", "#2ba7b3", "Secondary cyan — meta text, tags"],
  ["--color-accent-2", "Accent 2 (green)", "#45e083", "#45e083", "Secondary neon — kickers, checkmarks (9.6:1 vs bg)"],
  ["--color-ink", "Ink", "#e9f4f4", "#e9f4f4", "Headings & body text (16:1 vs bg)"],
  ["--color-muted", "Muted", "#9db3b8", "#9db3b8", "Paragraph text, descriptions (7.9:1 vs bg)"],
  ["--color-faint", "Faint", "#6d868c", "#6d868c", "Footnotes, disabled, timestamps"],
];
const EXTRA = [
  ["Logo gradient", "#ffffff → #4bd0e8 → #3dff47", "PolarisBreathe mark (white → cyan → neon green)"],
];

const cards = SWATCHES.map(
  ([token, label, value, visual, note]) => `
  <div class="card">
    <div class="swatch" style="background:${visual}"></div>
    <div class="meta">
      <div class="token">${token}</div>
      <div class="label">${label}</div>
      <div class="value">${value}${value !== visual ? `  ·  composited ${visual}` : ""}</div>
      <div class="note">${note}</div>
    </div>
  </div>`,
).join("");

const gradientBar = `
  <div class="gradrow">
    <div class="grad"></div>
    <div class="grad-meta">
      <div class="token">logo gradient</div>
      <div class="label">PolarisBreathe mark</div>
      <div class="value">${EXTRA[0][1]}</div>
    </div>
  </div>`;

const html = `<style>
  * { margin: 0; box-sizing: border-box; font-family: -apple-system, ui-sans-serif, system-ui, "Helvetica Neue", sans-serif; }
  body { background: #050d10; color: #e9f4f4; padding: 64px; width: 1400px; }
  .kicker { color: #45e083; font-size: 15px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; }
  h1 { font-size: 44px; font-weight: 700; margin: 10px 0 6px; letter-spacing: -0.01em; }
  .sub { color: #9db3b8; font-size: 17px; margin-bottom: 44px; }
  .sub code { color: #4be1ec; font-size: 15px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
  .card { background: #0a161a; border: 1px solid #204e55; border-radius: 16px; overflow: hidden; }
  .swatch { height: 128px; border-bottom: 1px solid #132e33; }
  .meta { padding: 16px 18px 18px; }
  .token { color: #4be1ec; font: 600 13px/1.3 ui-monospace, "SF Mono", Menlo, monospace; }
  .label { color: #e9f4f4; font-size: 19px; font-weight: 700; margin: 5px 0 3px; }
  .value { color: #9db3b8; font: 12px/1.5 ui-monospace, "SF Mono", Menlo, monospace; }
  .note { color: #6d868c; font-size: 13px; margin-top: 7px; line-height: 1.45; }
  .gradrow { margin-top: 26px; background: #0a161a; border: 1px solid #204e55; border-radius: 16px; display: flex; overflow: hidden; }
  .grad { width: 46%; background: linear-gradient(90deg, #ffffff, #4bd0e8 50%, #3dff47); }
  .grad-meta { padding: 20px 24px; }
  .foot { margin-top: 40px; color: #6d868c; font-size: 14px; }
  .foot strong { color: #9db3b8; }
</style>
  <div class="kicker">Design tokens</div>
  <h1>VYN – CoCreation Lab — Color palette</h1>
  <div class="sub">Dark theme is the single intended theme · tokens from <code>app/globals.css</code> <code>@theme</code> · derived from the hero artwork (main-bg.jpg)</div>
  <div class="grid">${cards}</div>
  ${gradientBar}
  <div class="foot">Contrast checked against <strong>--color-bg #050d10</strong>: ink 16:1 · muted 7.9:1 · accent 10:1 · accent-2 9.6:1 → WCAG 2.2 AA ✓ · light theme planned later (AddLightModeLater.txt)</div>`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1400, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "load" });
  const full = await page.$eval("body", (b) => b.scrollHeight);
  await page.setViewport({ width: 1400, height: full + 4, deviceScaleFactor: 2 });
  await new Promise((r) => setTimeout(r, 120));
  await page.screenshot({ path: OUT });
  await browser.close();
  console.log(`wrote ${OUT} (${fs.statSync(OUT).size / 1024 | 0} KB, 2800×${(full + 4) * 2})`);
} catch (err) {
  await browser.close();
  throw err;
}
