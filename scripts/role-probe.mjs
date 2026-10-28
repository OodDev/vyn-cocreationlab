import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.on("console", (msg) =>
  console.log("[console-" + msg.type() + "]", msg.text()),
);
page.on("pageerror", (err) => console.log("[pageerror]", err.message));
await page.goto("http://localhost:3000/", { waitUntil: "load" });

// Sample the rotating-role text every 250ms for 10s.
for (let i = 0; i < 40; i++) {
  const t = await page.evaluate(() => {
    const kicker = document.querySelector(".kicker");
    return {
      text: kicker?.textContent?.trim() ?? "(none)",
      splash: document.documentElement.getAttribute("data-splash"),
    };
  });
  console.log(String((i * 250).toString()).padStart(4), JSON.stringify(t));
  await new Promise((r) => setTimeout(r, 250));
}
await browser.close();
