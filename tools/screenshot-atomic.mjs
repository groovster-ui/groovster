import { chromium } from './a11y/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const shots = join(repoRoot, 'demos/showcase/shots');

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

async function main() {
  fs.mkdirSync(shots, { recursive: true });
  await withServer(async (port) => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // Atomic showcase states
    for (const state of [
      { mode: 'light', fidelity: 'costume', name: 'mcm-atomic-costume-light.png' },
      { mode: 'dark', fidelity: 'costume', name: 'mcm-atomic-costume-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'mcm-atomic-whisper-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'mcm-atomic-whisper-dark.png' },
    ]) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/mcm-atomic.html`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(shots, state.name), fullPage: true });
      console.log('saved', state.name);
    }

    // Bare atomic
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/mcm-atomic-bare.html`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: join(shots, 'mcm-atomic-bare-costume-default.png'),
      fullPage: true,
    });
    console.log('saved mcm-atomic-bare-costume-default.png');

    // Controls zoom
    const controlsHtml = `<!doctype html>
<html lang="en" data-era="mcm-atomic" data-mode="light">
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
<style>body{margin:0;padding:48px;display:grid;gap:28px;max-width:520px;background:var(--ew-color-bg-page)}
h1{font:700 14px var(--ew-font-display);letter-spacing:.08em;text-transform:uppercase;margin:0}
.ew-card{max-width:420px}</style>
</head>
<body>
<h1>mcm-atomic controls</h1>
<label class="ew-checkbox"><input class="ew-checkbox__control" type="checkbox" /><span class="ew-checkbox__box"></span><span class="ew-checkbox__label">Unchecked</span></label>
<label class="ew-checkbox"><input class="ew-checkbox__control" type="checkbox" checked /><span class="ew-checkbox__box"></span><span class="ew-checkbox__label">Checked</span></label>
<label class="ew-radio"><input class="ew-radio__control" type="radio" name="r" /><span class="ew-radio__disc"></span><span class="ew-radio__label">Off</span></label>
<label class="ew-radio"><input class="ew-radio__control" type="radio" name="r" checked /><span class="ew-radio__disc"></span><span class="ew-radio__label">On</span></label>
<label class="ew-switch"><input class="ew-switch__control" type="checkbox" role="switch" /><span class="ew-switch__track"><span class="ew-switch__thumb"></span></span><span class="ew-switch__label">Off</span></label>
<label class="ew-switch"><input class="ew-switch__control" type="checkbox" role="switch" checked /><span class="ew-switch__track"><span class="ew-switch__thumb"></span></span><span class="ew-switch__label">On</span></label>
<div class="ew-card"><div class="ew-card__header"><h3>Formica Card</h3></div><div class="ew-card__body"><p>Turquoise band, charcoal outline, kidney corners.</p></div></div>
<button type="button" class="ew-button">Primary</button>
<button type="button" class="ew-button" data-variant="secondary">Secondary</button>
</body></html>`;
    await page.setContent(controlsHtml, { waitUntil: 'networkidle' });
    // Rewrite relative CSS via goto to local server instead
    await page.goto(`data:text/html,placeholder`);
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/mcm-atomic.html`, {
      waitUntil: 'networkidle',
    });
    // Use a dedicated controls page served from memory via route
    await page.route('**/atomic-controls.html', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: controlsHtml })
    );
    await page.goto(`http://127.0.0.1:${port}/atomic-controls.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(shots, 'mcm-atomic-controls-zoom.png') });
    console.log('saved mcm-atomic-controls-zoom.png');

    // Reshoot Deco + Neon showcases (A1/A2 verification)
    for (const state of [
      { mode: 'dark', fidelity: 'costume', name: 'deco-costume-dark.png' },
      { mode: 'light', fidelity: 'costume', name: 'deco-costume-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'deco-whisper-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'deco-whisper-light.png' },
    ]) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/deco.html`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(shots, state.name), fullPage: true });
      console.log('saved', state.name);
    }

    for (const state of [
      { mode: 'dark', fidelity: 'costume', name: 'neon-costume-dark.png' },
      { mode: 'light', fidelity: 'costume', name: 'neon-costume-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'neon-whisper-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'neon-whisper-light.png' },
    ]) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon.html`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(600);
      await page.screenshot({ path: join(shots, state.name), fullPage: true });
      console.log('saved', state.name);
    }

    await page.goto(`http://127.0.0.1:${port}/demos/showcase/deco-bare.html`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(shots, 'deco-bare-costume-default.png'),
      fullPage: true,
    });
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon-bare.html`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: join(shots, 'neon-bare-costume-default.png'),
      fullPage: true,
    });
    console.log('saved deco/neon bare');

    await browser.close();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
