import puppeteer from "puppeteer-core";
import fs from "node:fs";

/**
 * Records a promo video of the site from first paint: splashscreen
 * (PolarisBreathe) → splash leaves → hero entrance → the three rotating
 * roles cycle once (Web Developing → Photography → Drone → back).
 *
 * Full-quality DESKTOP capture:
 *   • viewport 1440×900 @1x — the site's own desktop QA size
 *   • CDP Page.startScreencast with JPEG quality 100 (visually lossless)
 *     at ~30 fps (every 2nd frame)
 *   • TWO browsers, strictly sequential: a capture browser (a second page
 *     in the same browser stalls the screencast — Chrome headless quirk),
 *     then an encode-only browser which re-plays the frames in real time
 *     into a canvas and records with Chrome's native H.264 MediaRecorder
 *     encoder at 25 Mbps. No ffmpeg needed.
 *
 * End-time math (current constants): splash gone ~5.37s → Web Developing
 * scramble ~1.33s + hold 1.5s → Photography 0.9 + 1.5 → Drone 0.6 + 1.5 →
 * back to Web Developing resolved ~13.3s + one hold beat.
 */

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL_TO_SHOOT = "http://localhost:3001/";
const END_AT_MS = 15200;
const VIEWPORT = { width: 1440, height: 900 };
const OUT_FILE = "vyn-intro-desktop.mp4";
const BITRATE = 25_000_000;
const JPEG_QUALITY = 100;
const EVERY_NTH_FRAME = 2;
const BATCH_FRAMES = 5;
const B64_CHUNK = 4_000_000;

const browserOpts = {
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
};

// ─── stage 1: capture ────────────────────────────────────────────────────
const captureBrowser = await puppeteer.launch(browserOpts);
/** Captured frames in order: { t: seconds since first frame, b64 } */
const frames = [];

try {
  const page = await captureBrowser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(URL_TO_SHOOT, { waitUntil: "load" });

  const client = await page.createCDPSession();
  await client.send("Page.enable");

  let firstT = 0;
  client.on("Page.screencastFrame", (frame) => {
    client
      .send("Page.screencastFrameAck", { sessionId: frame.sessionId })
      .catch(() => {});
    if (firstT === 0) firstT = frame.metadata.timestamp;
    frames.push({ t: frame.metadata.timestamp - firstT, b64: frame.data });
  });

  await client.send("Page.startScreencast", {
    format: "jpeg",
    quality: JPEG_QUALITY,
    maxWidth: VIEWPORT.width,
    maxHeight: VIEWPORT.height,
    everyNthFrame: EVERY_NTH_FRAME,
  });

  await new Promise((r) => setTimeout(r, END_AT_MS));
  await client.send("Page.stopScreencast");
  console.log(`captured ${frames.length} frames over ${frames.at(-1)?.t.toFixed(2)}s`);
} finally {
  await captureBrowser.close();
}

// ─── stage 2: encode in a separate browser ──────────────────────────────
const encodeBrowser = await puppeteer.launch(browserOpts);
try {
  const rec = await encodeBrowser.newPage();
  await rec.goto("about:blank");
  await rec.evaluate(() => {
    window.__frames = [];
    window.__videoB64 = "";
  });

  let sent = 0;
  while (sent < frames.length) {
    const batch = frames.slice(sent, sent + BATCH_FRAMES).map((f) => [f.t, f.b64]);
    sent += batch.length;
    await rec.evaluate((list) => {
      window.__frames.push(...list);
    }, batch);
  }
  const transferred = await rec.evaluate(() => window.__frames.length);
  if (transferred !== frames.length) {
    throw new Error(
      `frame transfer mismatch: node ${frames.length} vs page ${transferred}`,
    );
  }

  await rec.evaluate(async ([w, h, bitrate]) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#050d10";
    ctx.fillRect(0, 0, w, h);

    const mimeType = [
      "video/mp4;codecs=avc1.64002A",
      "video/mp4;codecs=avc1.42E01E",
      "video/mp4",
    ].find((m) => MediaRecorder.isTypeSupported(m));
    if (!mimeType) throw new Error("no mp4-capable MediaRecorder MIME in this Chrome");

    const chunks = [];
    const rec = new MediaRecorder(canvas.captureStream(30), {
      mimeType,
      videoBitsPerSecond: bitrate,
    });
    rec.ondataavailable = (e) => chunks.push(e.data);
    const finished = new Promise((res, rej) => {
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const fr = new FileReader();
        fr.onloadend = () => {
          window.__videoB64 = String(fr.result).split(",")[1] ?? "";
          res(window.__videoB64.length);
        };
        fr.onerror = () => rej(new Error("blob read failed"));
        fr.readAsDataURL(blob);
      };
      rec.onerror = (e) => rej(new Error(`recorder error: ${e.error}`));
    });
    rec.start();

    const list = window.__frames;
    const load = (i) => {
      if (i >= list.length) return Promise.resolve(null);
      const img = new Image();
      img.src = `data:image/jpeg;base64,${list[i][1]}`;
      // decode() ahead of time so the actual drawImage call stays fast
      return img.decode().then(() => img, () => null);
    };

    // Real-time playback: draw frame i at its captured timestamp offset,
    // decoding frame i+1 while the current one is on the canvas.
    let next = load(0);
    const t0 = performance.now() + 50;
    for (let i = 0; i < list.length; i += 1) {
      const img = await next;
      const wait = t0 + list[i][0] * 1000 - performance.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (img) ctx.drawImage(img, 0, 0, w, h);
      next = load(i + 1);
    }
    await new Promise((r) => setTimeout(r, 350));
    rec.stop();
    await finished;
  }, [VIEWPORT.width, VIEWPORT.height, BITRATE]);

  // Pull the mp4 out of the page in slices (a single multi-MB return value
  // can exceed the CDP message budget).
  const total = await rec.evaluate(() => window.__videoB64.length);
  if (total === 0) throw new Error("encoder produced empty video");
  let full = "";
  for (let s = 0; s < total; s += B64_CHUNK) {
    full += await rec.evaluate(
      (k, chunkSize) => window.__videoB64.slice(k, k + chunkSize),
      s,
      B64_CHUNK,
    );
  }

  fs.writeFileSync(OUT_FILE, Buffer.from(full, "base64"));
  console.log(
    `wrote ${OUT_FILE} (${(fs.statSync(OUT_FILE).size / 1e6).toFixed(1)} MB, ${VIEWPORT.width}×${VIEWPORT.height})`,
  );
} finally {
  await encodeBrowser.close();
}
