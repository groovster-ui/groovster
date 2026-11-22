import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ERAS = ['neutral', 'deco', 'neon', 'mcm-atomic', 'memphis', 'groovy', 'earth'];

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  if (p.endsWith('.woff2')) return 'font/woff2';
  return 'text/html';
}

function fixture(era) {
  return `<!doctype html>
<html><body style="padding:120px 24px">
<link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
<script src="/packages/elements/dist/era-elements.js"></script>
<div data-era="${era}" data-mode="light" class="ew-root">
  <ew-select class="ew-select" id="sel-a">
    <label class="ew-select__label">A</label>
    <select class="ew-select__control">
      <option value="1">One</option>
      <option value="2">Two</option>
    </select>
  </ew-select>
  <ew-select class="ew-select" id="sel-b">
    <label class="ew-select__label">B</label>
    <select class="ew-select__control">
      <option value="x">X</option>
      <option value="y">Y</option>
    </select>
  </ew-select>
  <p id="neighbor">Neighbor field should not move</p>
  <ew-tooltip id="tip" class="ew-tooltip" style="margin-top:40px">
    <button type="button" class="ew-button">Hover me</button>
    <span class="ew-tooltip__tip" role="tooltip">Anchored tip</span>
  </ew-tooltip>
</div>
</body></html>`;
}

async function withPage(era, fn) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fixture(era));
      return;
    }
    const file = path.join(REPO, url.replace(/^\//, ''));
    if (!fs.existsSync(file)) {
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
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  try {
    await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

for (const era of ERAS) {
  test(`${era}: select lists use unique anchors and popover top-layer`, async () => {
    await withPage(era, async (page) => {
      const before = await page.locator('#neighbor').boundingBox();
      const a = page.locator('#sel-a .ew-select__trigger');
      await a.click();
      const meta = await page.evaluate(() => {
        const aTrig = document.querySelector('#sel-a .ew-select__trigger');
        const bTrig = document.querySelector('#sel-b .ew-select__trigger');
        const aList = document.querySelector('#sel-a [role="listbox"]');
        return {
          aAnchor: aTrig.style.getPropertyValue('anchor-name'),
          bAnchor: bTrig.style.getPropertyValue('anchor-name'),
          aListAnchor: aList.style.getPropertyValue('position-anchor'),
          popover: aList.getAttribute('popover'),
          open: aList.matches(':popover-open'),
          aPos: getComputedStyle(aList).position,
        };
      });
      assert.ok(meta.aAnchor.startsWith('--ew-select-'));
      assert.ok(meta.bAnchor.startsWith('--ew-select-'));
      assert.notEqual(meta.aAnchor, meta.bAnchor);
      assert.equal(meta.aListAnchor, meta.aAnchor);
      assert.equal(meta.popover, 'manual');
      assert.equal(meta.open, true);
      assert.ok(['fixed', 'absolute'].includes(meta.aPos));
      const after = await page.locator('#neighbor').boundingBox();
      assert.equal(Math.round(before.y), Math.round(after.y));
    });
  });

  test(`${era}: tooltip tip is anchored without shifting layout`, async () => {
    await withPage(era, async (page) => {
      const before = await page.locator('#neighbor').boundingBox();
      await page.locator('#tip .ew-button').hover();
      const tip = await page.evaluate(() => {
        const tipEl = document.querySelector('#tip .ew-tooltip__tip');
        const trig = document.querySelector('#tip .ew-button');
        return {
          pos: getComputedStyle(tipEl).position,
          anchor: tipEl.style.getPropertyValue('position-anchor') || getComputedStyle(tipEl).getPropertyValue('position-anchor'),
          trigAnchor: trig.style.getPropertyValue('anchor-name'),
        };
      });
      assert.ok(['fixed', 'absolute'].includes(tip.pos));
      const after = await page.locator('#neighbor').boundingBox();
      assert.equal(Math.round(before.y), Math.round(after.y));
    });
  });
}
