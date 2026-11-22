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

async function shot(page, outName) {
  const out = join(repoRoot, 'demos/showcase/shots', outName);
  await page.screenshot({ path: out, fullPage: true });
  console.log('saved', outName);
}

async function main() {
  await withServer(async (port) => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const states = [
      { mode: 'dark', fidelity: 'costume', name: 'neon-costume-dark.png' },
      { mode: 'light', fidelity: 'costume', name: 'neon-costume-light.png' },
      { mode: 'dark', fidelity: 'whisper', name: 'neon-whisper-dark.png' },
      { mode: 'light', fidelity: 'whisper', name: 'neon-whisper-light.png' },
    ];

    for (const state of states) {
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon.html`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(({ mode, fidelity }) => {
        document.documentElement.setAttribute('data-mode', mode);
        document.documentElement.setAttribute('data-fidelity-band', fidelity);
      }, state);
      await page.waitForTimeout(700);
      await shot(page, state.name);
    }

    await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon-bare.html`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(600);
    await shot(page, 'neon-bare-costume-default.png');

    await browser.close();
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
