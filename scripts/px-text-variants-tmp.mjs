import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = "/private/var/folders/zx/d5vxsf3d6t3gxgnpz121thy00000gn/T/opencode";
const URL = "http://localhost:4567/";

// 6 text treatments applied to the SAME scene at the SAME pinned hold frame.
const VARIANTS = [
  {
    name: "a-caps",
    line1: "EVERY PROJECT STARTS AS UNCHARTED GALAXIES OF IDEAS.",
    line2: "LET'S WEAVE THEM TO YOUR EXACT, TREASURED MEASURE.",
    css: `.px-statement-inner h2 { font-size: clamp(1.1rem, 2.2vw, 1.7rem); }
          .px-line1, .px-line2 { letter-spacing: .18em; font-weight: 700; }`,
  },
  {
    name: "b-outline",
    line1: "Every project starts as uncharted galaxies of ideas.",
    line2: "Let's weave them to your exact, treasured measure.",
    css: `.px-line1, .px-line2 {
            color: transparent;
            -webkit-text-stroke: 1.2px rgba(230,242,244,.92);
          }`,
  },
  {
    name: "c-galaxy-fill",
    line1: "Every project starts as uncharted galaxies of ideas.",
    line2: "Let's weave them to your exact, treasured measure.",
    css: `.px-line1, .px-line2 {
            background:
              radial-gradient(circle at 18% 30%, rgba(255,255,255,.95) 0 1px, transparent 2px),
              radial-gradient(circle at 62% 70%, #fff 0 1px, transparent 2px),
              radial-gradient(circle at 84% 24%, rgba(255,255,255,.9) 0 1.5px, transparent 2.5px),
              radial-gradient(circle at 40% 82%, rgba(255,255,255,.8) 0 1px, transparent 2px),
              linear-gradient(180deg, #eafaff 0%, #4be1ec 55%, #45e083 110%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 6px rgba(75,225,236,.45));
            background-size: 90px 90px, 70px 70px, 110px 110px, 60px 60px, 100% 100%;
          }`,
  },
  {
    name: "d-minimal-quiet",
    line1: "Every project starts as uncharted galaxies of ideas.",
    line2: "Let's weave them to your exact, treasured measure.",
    css: `.px-statement-inner { max-width: 34rem; }
          .px-statement-inner h2 { font-size: clamp(1.25rem, 2.4vw, 1.8rem); font-weight: 400; }
          .px-line1, .px-line2 { color: rgba(230,242,244,.85); letter-spacing: .02em; }`,
  },
  {
    name: "e-kicker-mono",
    line1: "Every project starts as uncharted galaxies of ideas.",
    line2: "Let's weave them to your exact, treasured measure.",
    css: `.px-statement-inner::before {
            content: "./VYN\\2014PROCESSES"; display: block; margin-bottom: 14px;
            font-family: var(--font-jetbrains-mono, monospace);
            font-size: 11px; letter-spacing: .3em; color: #45e083;
          }
          .px-statement-inner h2 { font-size: clamp(1.3rem, 2.6vw, 2rem); font-weight: 500; }`,
  },
  {
    name: "f-bold-highlight",
    line1: "Every project starts as uncharted galaxies of ideas.",
    line2: "Let's weave them to your exact, treasured measure.",
    css: `.px-statement-inner h2 { font-size: clamp(1.8rem, 4.4vw, 3.1rem); font-weight: 800; letter-spacing: -.02em; }
          .px-line1 em, .px-line2 em { font-style: normal; color: #4be1ec; }`,
    line1HTML: "Every project starts as uncharted <em>galaxies</em> of ideas.",
    line2HTML: "Let's weave them to your exact, <em>treasured</em> measure.",
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(URL, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 2000));

// Scroll to the pinned HOLD frame (statement 2 landed, world still).
const pos = await page.evaluate(() => {
  const scene = document.querySelector(".px-scene");
  const top = scene.getBoundingClientRect().top + window.scrollY;
  const pinStart = top;
  const pinEnd = top + scene.offsetHeight - window.innerHeight;
  return { pinStart, pinEnd, hold: pinStart + (pinEnd - pinStart) * 0.66 };
});
await page.evaluate((y) => {
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
}, pos.hold);
await new Promise((r) => setTimeout(r, 700));

for (const v of VARIANTS) {
  await page.evaluate((v) => {
    const l1 = document.querySelector(".px-line1");
    const l2 = document.querySelector(".px-line2");
    l1.textContent = v.line1;
    l2.textContent = v.line2;
    if (v.line1HTML) l1.innerHTML = v.line1HTML;
    if (v.line2HTML) l2.innerHTML = v.line2HTML;
    let style = document.getElementById("mock-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "mock-style";
      document.head.appendChild(style);
    }
    style.textContent = v.css;
  }, v);
  await new Promise((r) => setTimeout(r, 350));
  await page.screenshot({ path: `${OUT}/px-text-${v.name}.png` });
  console.log("shot", v.name);
}
await browser.close();
console.log("done");
