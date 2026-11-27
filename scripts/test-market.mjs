import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { safePath } from '../tests/helpers/safe-path.mjs';
import { eraSwitchEntries } from '../tools/gen/src/era-catalog.js';

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), '../tools/a11y/package.json'));
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ERAS = eraSwitchEntries(root).map(([id]) => id);
const MODES = ['light', 'dark'];
const WIDTHS = [[1440, 900], [390, 844]];

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const file = safePath(root, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    const type = path.extname(file) === '.css' ? 'text/css' : path.extname(file) === '.js' ? 'text/javascript' : 'text/html';
    res.writeHead(200, { 'content-type': `${type}; charset=utf-8` });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const failures = [];
const server = await serve();
const { port } = server.address();
const browser = await chromium.launch();
const page = await browser.newContext().then((context) => context.newPage());

try {
  await page.goto(`http://127.0.0.1:${port}/demos/apps-dense/market/index.html`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
  for (const era of ERAS) {
    for (const mode of MODES) {
      await page.evaluate(({ era, mode }) => {
        const root = document.querySelector('[data-groovster-root]');
        root.dataset.era = era;
        root.dataset.mode = mode;
      }, { era, mode });
      for (const [width, height] of WIDTHS) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => document.fonts.ready);
        const report = await page.evaluate((wide) => {
          const found = [];
          const view = document.documentElement.clientWidth;
          const viewH = window.innerHeight;
          if (document.documentElement.scrollWidth > view + 1) found.push(`scroll ${document.documentElement.scrollWidth}`);
          const cards = [...document.querySelectorAll('.ew-product-card')];
          const rows = new Map();
          for (const card of cards) {
            const box = card.getBoundingClientRect();
            const key = Math.round(box.top / 8);
            if (!rows.has(key)) rows.set(key, []);
            rows.get(key).push(card);
          }
          for (const row of rows.values()) {
            const heights = row.map((card) => Math.round(card.getBoundingClientRect().height));
            if (Math.max(...heights) - Math.min(...heights) > 2) found.push(`row heights ${heights.join(',')}`);
            const prices = row.map((card) => card.querySelector('.ew-price')?.getBoundingClientRect().top ?? 0);
            if (Math.max(...prices) - Math.min(...prices) > 2) found.push(`price baseline ${prices.map((n) => Math.round(n)).join(',')}`);
          }
          for (const title of document.querySelectorAll('.ew-product-card__title')) {
            const style = getComputedStyle(title);
            const line = parseFloat(style.lineHeight) || 16;
            const lines = Math.round(title.clientHeight / line);
            if (lines > 2) found.push(`title lines ${lines}`);
          }
          if (wide) {
            const visible = cards.filter((card) => card.getBoundingClientRect().top < viewH && card.getBoundingClientRect().bottom > 0).length;
            if (visible < 8) found.push(`visible ${visible}`);
            const columns = rows.values().next().value?.length ?? 0;
            if (columns < 4) found.push(`columns ${columns}`);
          }
          return found;
        }, width === 1440);
        if (report.length) failures.push(`${era} ${mode} ${width} ${report.join('; ')}`);
      }
      const violations = await new AxeBuilder({ page }).analyze().then((result) =>
        result.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical').map((item) => item.id));
      if (violations.length) failures.push(`${era} ${mode} axe ${violations.join(', ')}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  console.error(`${failures.length} market check(s) failed`);
  process.exit(1);
}
console.log('market grid passed');
