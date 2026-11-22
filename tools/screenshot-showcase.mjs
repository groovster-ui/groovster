import { chromium } from './a11y/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

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

async function shot(page, outName, opts = {}) {
  const out = join(repoRoot, 'demos/showcase/shots', outName);
  await page.screenshot({ path: out, fullPage: Boolean(opts.fullPage) });
  console.log('saved', outName);
}

async function main() {
  await withServer(async (port) => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const decoStates = [
      { mode: 'dark', fidelity: 'costume', name: 'deco-costume-dark.png' },
      { mode: 'light', fidelity: 'costume', name: 'deco-costume-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'deco-whisper-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'deco-whisper-light.png' },
    ];

    for (const state of decoStates) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/deco.html`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(600);
      await shot(page, state.name, { fullPage: true });
    }

    // Bare deco (no fidelity-band) — proves costume default
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/deco-bare.html`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(500);
    await shot(page, 'deco-bare-costume-default.png', { fullPage: true });

    const smokeTargets = [
      { radio: '#era-neon-dark', name: 'neon-dark.png' },
      { radio: '#era-neon-light', name: 'neon-light.png' },
      { radio: '#era-atomic-dark', name: 'mcm-atomic-dark.png' },
      { radio: '#era-atomic-light', name: 'mcm-atomic-light.png' },
    ];
    for (const target of smokeTargets) {
      await page.goto(`http://127.0.0.1:${port}/demos/smoke/index.html`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.checked = true;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, target.radio);
      await page.waitForTimeout(500);
      await shot(page, target.name, { fullPage: true });
    }

    await browser.close();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
