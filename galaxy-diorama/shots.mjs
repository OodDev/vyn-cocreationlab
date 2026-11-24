import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = here;
const out = path.join(here, 'concepts');
fs.mkdirSync(out, { recursive: true });

const CHROME = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const file = path.join(root, url === '/' ? 'concepts.html' : url);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('nope'); return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--use-gl=angle', '--use-angle=metal', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 1 });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const manifest = [];

for (let v = 1; v <= 15; v++) {
  await page.goto(`${base}/concepts.html?v=${v}`, { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 700));
  const meta = await page.evaluate(() => window.__preset);
  const file = path.join(out, `${String(v).padStart(2, '0')}-${slug(meta.name)}.png`);
  await page.screenshot({ path: file });
  manifest.push({ v, id: meta.id, name: meta.name, file: path.basename(file) });
  console.log('ok', path.basename(file));
}

await browser.close();
server.close();
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('done', manifest.length);
