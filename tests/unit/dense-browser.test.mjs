import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { safePath } from '../helpers/safe-path.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ERAS = ['neutral', 'deco', 'groovy', 'mcm-atomic', 'memphis', 'neon', 'swiss', 'bauhaus', 'art-nouveau'];

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.woff2')) return 'font/woff2';
  return 'text/html';
}

function serve() {
  const server = createServer((req, res) => {
    const file = safePath(REPO, decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname).replace(/^\/+/, ''));
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      res.end('missing');
      return;
    }
    res.writeHead(200, { 'content-type': contentType(file) });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

test('truncation, compact type, and era controls hold in every era', async () => {
  const server = await serve();
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/tests/elements/fixtures/dense-phase2.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    for (const era of ERAS) {
      const report = await page.evaluate((era) => {
        const stage = document.querySelector('#stage');
        stage.dataset.era = era;
        delete stage.dataset.density;
        const title = stage.querySelector('.ew-card__title--truncate');
        const clamp = stage.querySelector('.ew-clamp-2');
        const lines = (node) => {
          const style = getComputedStyle(node);
          if (style.whiteSpace === 'nowrap') return 1;
          const parsed = parseFloat(style.lineHeight);
          const line = Number.isFinite(parsed) ? parsed : parseFloat(style.fontSize) * 1.2;
          return Math.round(node.clientHeight / line);
        };
        const button = stage.querySelector('.ew-button');
        const openFace = getComputedStyle(button).fontFamily;
        const openTitle = getComputedStyle(stage.querySelector('h3')).fontSize;
        stage.dataset.density = 'compact';
        const card = stage.querySelector('.ew-card');
        const pad = parseFloat(getComputedStyle(card).paddingTop);
        const compactFace = getComputedStyle(button).fontFamily;
        const compactTitle = parseFloat(getComputedStyle(stage.querySelector('h3')).fontSize);
        const items = [...stage.querySelectorAll('.ew-segmented__item')];
        const tops = items.map((item) => item.offsetTop);
        const segmented = stage.querySelector('.ew-segmented');
        return {
          truncate: lines(title),
          clamp: lines(clamp),
          nowrap: getComputedStyle(title).whiteSpace,
          pad,
          openFace,
          compactFace,
          openTitle,
          compactTitle,
          oneRow: new Set(tops).size === 1,
          scrolls: segmented.scrollWidth > segmented.clientWidth,
          badgeRadius: getComputedStyle(stage.querySelector('.ew-badge')).borderRadius,
          chipRadius: getComputedStyle(stage.querySelector('.ew-chip')).borderRadius,
        };
      }, era);
      assert.equal(report.truncate, 1, `${era} truncate`);
      assert.ok(report.clamp <= 2, `${era} clamp ${report.clamp}`);
      assert.equal(report.nowrap, 'nowrap', era);
      assert.ok(report.pad >= 8 && report.pad <= 12, `${era} pad ${report.pad}`);
      assert.ok(Math.abs(report.compactTitle - 16.8) < 0.2, `${era} compact title ${report.compactTitle}`);
      assert.equal(report.oneRow, true, `${era} segmented wraps`);
      assert.equal(report.scrolls, true, `${era} segmented does not scroll`);
      if (era === 'deco') {
        assert.match(report.openFace, /Limelight/i);
        assert.doesNotMatch(report.compactFace, /Limelight/i);
        assert.equal(report.badgeRadius, '0px');
      }
      if (era === 'groovy') assert.match(report.chipRadius, /999px/);
      if (era === 'mcm-atomic') assert.match(report.badgeRadius, /14px/);
      if (era === 'art-nouveau') assert.match(report.chipRadius, /999px/);
    }
  } finally {
    await browser.close();
    server.close();
  }
});
