import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { safePath } from '../helpers/safe-path.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  return 'text/html';
}

const FIXTURE = `<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
</head>
<body>
  <div id="bare" data-era="deco" data-mode="light" class="ew-root">
    <div class="ew-card"><div class="ew-card__header"><h3>Bare</h3></div></div>
    <hr class="ew-ornament-divider" data-variant="ornament" />
  </div>
  <div id="anc-wrap" data-fidelity-band="whisper">
    <div id="anc" data-era="deco" data-mode="light" class="ew-root">
      <div class="ew-card"><div class="ew-card__header"><h3>Ancestor whisper</h3></div></div>
    </div>
  </div>
  <div id="self" data-era="deco" data-mode="light" data-fidelity-band="whisper" class="ew-root">
    <div class="ew-card"><div class="ew-card__header"><h3>Self whisper</h3></div></div>
  </div>
</body>
</html>`;

async function withPage(fn) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(FIXTURE);
      return;
    }
    const file = safePath(REPO, url.replace(/^\//, ''));
    if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('missing');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(file) });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  try {
    await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

test('costume ornament applies with no data-fidelity-band', async () => {
  await withPage(async (page) => {
    const display = await page.evaluate(() => {
      const before = getComputedStyle(document.querySelector('#bare .ew-card'), '::before').content;
      const after = getComputedStyle(document.querySelector('#bare .ew-card__header'), '::after').content;
      return { before, after };
    });
    assert.notEqual(display.before, 'none');
    assert.notEqual(display.after, 'none');
  });
});

test('ancestor whisper mutes costume ornament', async () => {
  await withPage(async (page) => {
    const display = await page.evaluate(() => {
      const before = getComputedStyle(document.querySelector('#anc .ew-card'), '::before').display;
      return before;
    });
    assert.equal(display, 'none');
  });
});

test('self whisper mutes costume ornament', async () => {
  await withPage(async (page) => {
    const display = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('#self .ew-card'), '::before').display;
    });
    assert.equal(display, 'none');
  });
});
