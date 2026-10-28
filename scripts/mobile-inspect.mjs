import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--enable-features=CalcHeightSystemUI"],
});
const page = await browser.newPage();
await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true });
const url = process.argv[2] ?? "http://localhost:3000/";
await page.goto(url, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: "/tmp/mobile-700ms.png" });
const info = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll("img")].map((i) => ({
    cls: String(i.className).slice(0, 60),
    complete: i.complete,
    currentSrc: (i.currentSrc || "").split("/").pop(),
    rect: (({ top, left, width, height }) => ({
      top: Math.round(top),
      left: Math.round(left),
      w: Math.round(width),
      h: Math.round(height),
    }))(i.getBoundingClientRect()),
    vis: getComputedStyle(i).visibility,
    op: getComputedStyle(i).opacity,
    disp: getComputedStyle(i).display,
  }));
  return {
    dataSplash: document.documentElement.getAttribute("data-splash"),
    splashDisplay: getComputedStyle(document.querySelector(".splash") ?? document.body).display,
    imgs,
    scrollY: scrollY,
    vh: innerHeight,
  };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
