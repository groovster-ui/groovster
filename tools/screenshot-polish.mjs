import { chromium } from './a11y/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { listEraIds } from './gen/src/era-catalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const ERAS = listEraIds(repoRoot);

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.woff2')) return 'font/woff2';
  return 'text/html';
}

async function withServer(fn) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(repoRoot, url.replace(/^\//, ''));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('missing');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(file) });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  try {
    await fn(port);
  } finally {
    server.close();
  }
}

function controlsHtml(era) {
  return `<!doctype html>
<html lang="en" data-era="${era}" data-mode="dark">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
<style>body{margin:0;padding:48px;display:grid;gap:28px;max-width:520px}
h1{font:600 14px system-ui;opacity:.7;margin:0}</style>
</head>
<body>
<h1>${era} controls</h1>
<label class="ew-checkbox"><input class="ew-checkbox__control" type="checkbox" /><span class="ew-checkbox__box"></span><span class="ew-checkbox__label">Unchecked</span></label>
<label class="ew-checkbox"><input class="ew-checkbox__control" type="checkbox" checked /><span class="ew-checkbox__box"></span><span class="ew-checkbox__label">Checked</span></label>
<label class="ew-radio"><input class="ew-radio__control" type="radio" name="r" /><span class="ew-radio__disc"></span><span class="ew-radio__label">Off</span></label>
<label class="ew-radio"><input class="ew-radio__control" type="radio" name="r" checked /><span class="ew-radio__disc"></span><span class="ew-radio__label">On</span></label>
<label class="ew-switch"><input class="ew-switch__control" type="checkbox" role="switch" /><span class="ew-switch__track"><span class="ew-switch__thumb"></span></span><span class="ew-switch__label">Off</span></label>
<label class="ew-switch"><input class="ew-switch__control" type="checkbox" role="switch" checked /><span class="ew-switch__track"><span class="ew-switch__thumb"></span></span><span class="ew-switch__label">On</span></label>
<div class="ew-card"><div class="ew-card__header"><h3>Title Clear</h3></div><div class="ew-card__body"><p>Frame should not cross this copy.</p></div></div>
</body></html>`;
}

async function main() {
  await withServer(async (port) => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const shots = join(repoRoot, 'demos/showcase/shots');

    // Neon showcase states
    for (const state of [
      { mode: 'dark', fidelity: 'costume', name: 'neon-costume-dark.png' },
      { mode: 'light', fidelity: 'costume', name: 'neon-costume-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'neon-whisper-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'neon-whisper-light.png' },
    ]) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon.html`, { waitUntil: 'networkidle' });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(shots, state.name), fullPage: true });
      console.log('saved', state.name);
    }
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon-bare.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(shots, 'neon-bare-costume-default.png'), fullPage: true });
    console.log('saved neon-bare-costume-default.png');

    // Deco showcase states
    for (const state of [
      { mode: 'dark', fidelity: 'costume', name: 'deco-costume-dark.png' },
      { mode: 'light', fidelity: 'costume', name: 'deco-costume-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'deco-whisper-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'deco-whisper-light.png' },
    ]) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/deco.html`, { waitUntil: 'networkidle' });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(shots, state.name), fullPage: true });
      console.log('saved', state.name);
    }
    if (fs.existsSync(join(repoRoot, 'demos/showcase/deco-bare.html'))) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/deco-bare.html`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      await page.screenshot({ path: join(shots, 'deco-bare-costume-default.png'), fullPage: true });
      console.log('saved deco-bare-costume-default.png');
    }

    // Zoomed controls per era
    for (const era of ERAS) {
      await page.setContent(controlsHtml(era).replaceAll('href="/', `href="http://127.0.0.1:${port}/`), {
        waitUntil: 'networkidle',
      });
      // setContent with absolute CSS
      await page.goto(`data:text/html,` + encodeURIComponent(controlsHtml(era)), { waitUntil: 'domcontentloaded' });
    }

    // Serve controls via temp routes using evaluate navigation to inline pages through server file
    for (const era of ERAS) {
      const tmp = join(repoRoot, 'demos/showcase', `_controls-${era}.html`);
      fs.writeFileSync(tmp, controlsHtml(era).replaceAll('href="/packages/', 'href="../../packages/'));
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/_controls-${era}.html`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(shots, `${era}-controls-zoom.png`), fullPage: true });
      console.log('saved', `${era}-controls-zoom.png`);
      fs.unlinkSync(tmp);
    }

    await browser.close();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
