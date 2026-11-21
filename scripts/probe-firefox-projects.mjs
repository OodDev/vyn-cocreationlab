import { firefox } from "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode/pwprobe/node_modules/playwright-core/index.mjs";

const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto("http://localhost:4567", { waitUntil: "load" });
await page.waitForTimeout(1500);

// Land inside the projects act: scroll to the section's sticky pin.
await page.evaluate(() => {
  const scene = document.querySelector(".hs-scene");
  const top = scene.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top + window.innerHeight * 1.2);
});
await page.waitForTimeout(1200);

const probe = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      sel,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      position: cs.position,
      top: cs.top,
      display: cs.display,
      gridTemplateRows: cs.gridTemplateRows,
      overflow: cs.overflow,
      height: cs.height,
      transform: cs.transform,
      animationName: cs.animationName,
      animationTimeline: cs.animationTimeline,
    };
  };
  return {
    scrollY: Math.round(window.scrollY),
    innerSize: [window.innerWidth, window.innerHeight],
    head: pick(".hs-head"),
    sticky: pick(".hs-sticky"),
    scene: pick(".hs-scene"),
    track: pick(".hs-track"),
    trackzone: pick(".hs-trackzone"),
    kicker: pick(".hs-head .kicker"),
  };
});
console.log(JSON.stringify(probe, null, 2));

await page.screenshot({ path: "screenshots/errors/firefox-projects-probe.png" });
await browser.close();
