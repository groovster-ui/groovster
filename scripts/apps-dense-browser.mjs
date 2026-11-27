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
const shots = process.env.GROOVSTER_SHOTS === '1';
const shotDir = path.join(root, 'demos/apps-dense/baselines');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const APPS = ['mail', 'market', 'chat', 'stream', 'site', 'home'];
const NARROW = new Set(['mail', 'chat', 'home']);
const ERAS = eraSwitchEntries(root).map(([id]) => id);
const MODES = ['light', 'dark'];

function serve() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const file = safePath(root, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const failures = [];
function fail(message) {
  failures.push(message);
  console.error(message);
}

const server = await serve();
const { port } = server.address();
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();

try {
  if (shots) fs.mkdirSync(shotDir, { recursive: true });
  for (const app of APPS) {
    await page.goto(`http://127.0.0.1:${port}/demos/apps-dense/${app}/index.html`, { waitUntil: 'networkidle' });
    await page.addStyleTag({
      content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
    });
    for (const era of ERAS) {
      for (const mode of MODES) {
        await page.evaluate(({ era, mode }) => {
          const root = document.querySelector('[data-groovster-root]');
          root.dataset.era = era;
          root.dataset.mode = mode;
        }, { era, mode });
        const widths = [[1440, 900]];
        if (NARROW.has(app)) widths.push([390, 844]);
        for (const [width, height] of widths) {
          await page.setViewportSize({ width, height });
          const problems = await page.evaluate(() => {
            const found = [];
            const view = document.documentElement.clientWidth;
            if (document.documentElement.scrollWidth > view + 1) {
              found.push(`scroll ${document.documentElement.scrollWidth}`);
            }
            const button = document.querySelector('.ew-button');
            if (button) {
              const style = getComputedStyle(button);
              if (/spicy/i.test(style.fontFamily)) found.push('display face on button');
              if (style.textTransform === 'uppercase' && !button.classList.contains('ew-caps')) {
                found.push('uppercase control');
              }
            }
            const selected = document.querySelector('.is-selected, [aria-selected="true"], [aria-current="page"]');
            if (selected) {
              const style = getComputedStyle(selected);
              const weight = Number(style.fontWeight);
              const mark = style.boxShadow !== 'none' || style.fontWeight === '700' || weight >= 600;
              if (!mark) found.push('selected has no marker');
            }
            return found;
          });
          if (problems.length) fail(`${app} ${era} ${mode} ${width} ${problems.join(', ')}`);
          if (shots && width === 1440) {
            await page.screenshot({
              path: path.join(shotDir, `${app}-${era}-${mode}.jpg`),
              type: 'jpeg',
              quality: 60,
            });
          }
          if (shots && width === 390) {
            await page.screenshot({
              path: path.join(shotDir, `${app}-${era}-${mode}-390.jpg`),
              type: 'jpeg',
              quality: 60,
            });
          }
        }
        await page.setViewportSize({ width: 1440, height: 900 });
        const violations = await new AxeBuilder({ page })
          .analyze()
          .then((result) =>
            result.violations
              .filter((item) => item.impact === 'serious' || item.impact === 'critical')
              .map((item) => item.id)
          );
        if (violations.length) fail(`${app} ${era} ${mode} axe ${violations.join(', ')}`);
      }
    }
    console.log(`${app} ok`);
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`${failures.length} dense check(s) failed`);
  process.exit(1);
}
console.log('dense apps passed');
