import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { listEraIds } from '../../tools/gen/src/era-catalog.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ERAS = listEraIds(REPO);
const MODES = ['light', 'dark'];

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  if (p.endsWith('.woff2')) return 'font/woff2';
  return 'text/html';
}

function fixtureHtml() {
  const blocks = ERAS.flatMap((era) =>
    MODES.map(
      (mode) => `
<div class="ew-root case" data-era="${era}" data-mode="${mode}" data-testid="${era}-${mode}">
  <label class="ew-checkbox">
    <input class="ew-checkbox__control" type="checkbox" data-off />
    <span class="ew-checkbox__box" aria-hidden="true"></span>
    <span class="ew-checkbox__label">Off</span>
  </label>
  <label class="ew-checkbox">
    <input class="ew-checkbox__control" type="checkbox" checked data-on />
    <span class="ew-checkbox__box" aria-hidden="true"></span>
    <span class="ew-checkbox__label">On</span>
  </label>
  <label class="ew-radio">
    <input class="ew-radio__control" type="radio" name="r-${era}-${mode}" data-off />
    <span class="ew-radio__disc" aria-hidden="true"></span>
    <span class="ew-radio__label">Off</span>
  </label>
  <label class="ew-radio">
    <input class="ew-radio__control" type="radio" name="r-${era}-${mode}" checked data-on />
    <span class="ew-radio__disc" aria-hidden="true"></span>
    <span class="ew-radio__label">On</span>
  </label>
  <label class="ew-switch">
    <input class="ew-switch__control" type="checkbox" role="switch" data-off />
    <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
    <span class="ew-switch__label">Off</span>
  </label>
  <label class="ew-switch">
    <input class="ew-switch__control" type="checkbox" role="switch" checked data-on />
    <span class="ew-switch__track" aria-hidden="true"><span class="ew-switch__thumb"></span></span>
    <span class="ew-switch__label">On</span>
  </label>
</div>`
    )
  ).join('\n');
  return `<!doctype html>
<html><head>
<link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
</head><body style="margin:0;padding:16px">${blocks}</body></html>`;
}

function tickVisible(transform) {
  if (!transform || transform === 'none') return false;
  // scale(0) → matrix(0, 0, 0, 0, …); rotate(-45deg) scale(1) → matrix(0.707…)
  return !/^matrix\(\s*0(\.0+)?\s*,\s*0(\.0+)?\s*,\s*0(\.0+)?\s*,\s*0(\.0+)?\s*,/.test(transform);
}

async function withPage(fn) {
  const html = fixtureHtml();
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
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
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  try {
    await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

for (const era of ERAS) {
  for (const mode of MODES) {
    test(`checked controls differ visibly — ${era}/${mode}`, async () => {
      await withPage(async (page) => {
        const result = await page.evaluate(({ era, mode }) => {
          const root = document.querySelector(`[data-testid="${era}-${mode}"]`);
          const boxOff = root.querySelector('.ew-checkbox [data-off] + .ew-checkbox__box');
          const boxOn = root.querySelector('.ew-checkbox [data-on] + .ew-checkbox__box');
          const discOn = root.querySelector('.ew-radio [data-on] + .ew-radio__disc');
          const trackOff = root.querySelector('.ew-switch [data-off] + .ew-switch__track');
          const trackOn = root.querySelector('.ew-switch [data-on] + .ew-switch__track');
          const thumbOn = trackOn.querySelector('.ew-switch__thumb');
          const cs = (el, pseudo) => getComputedStyle(el, pseudo);

          const toRgb = (cssColor) => {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d', { colorSpace: 'srgb' });
            ctx.fillStyle = '#000';
            ctx.fillStyle = cssColor;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
            return { r, g, b, a: a / 255 };
          };
          const lum = ({ r, g, b }) => {
            const lin = [r, g, b].map((c) => {
              const s = c / 255;
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
          };
          const contrast = (a, b) => {
            const L1 = lum(a);
            const L2 = lum(b);
            return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          };
          const differ = (a, b) =>
            Math.abs(a.r - b.r) > 2 || Math.abs(a.g - b.g) > 2 || Math.abs(a.b - b.b) > 2;

          const boxOffRgb = toRgb(cs(boxOff).backgroundColor);
          const boxOnRgb = toRgb(cs(boxOn).backgroundColor);
          const tickColor =
            cs(boxOn, '::after').borderBottomColor ||
            cs(boxOn, '::after').borderColor ||
            cs(boxOn, '::after').color;
          const tickRgb = toRgb(tickColor);
          const discRgb = toRgb(cs(discOn).backgroundColor);
          const dotRgb = toRgb(cs(discOn, '::after').backgroundColor);
          const trackOffRgb = toRgb(cs(trackOff).backgroundColor);
          const trackOnRgb = toRgb(cs(trackOn).backgroundColor);
          const thumbOnRgb = toRgb(cs(thumbOn).backgroundColor);

          return {
            checkboxDiffer: differ(boxOffRgb, boxOnRgb),
            checkboxOff: cs(boxOff).backgroundColor,
            checkboxOn: cs(boxOn).backgroundColor,
            tickTransform: cs(boxOn, '::after').transform,
            tickContrast: contrast(tickRgb, boxOnRgb),
            radioDotTransform: cs(discOn, '::after').transform,
            radioContrast: contrast(dotRgb, discRgb),
            switchDiffer: differ(trackOffRgb, trackOnRgb),
            switchOff: cs(trackOff).backgroundColor,
            switchOn: cs(trackOn).backgroundColor,
            thumbContrast: contrast(thumbOnRgb, trackOnRgb),
            thumbOn: cs(thumbOn).backgroundColor,
          };
        }, { era, mode });

        assert.ok(
          result.checkboxDiffer,
          `${era}/${mode} checkbox fill must change when checked (off=${result.checkboxOff} on=${result.checkboxOn})`
        );
        assert.ok(
          tickVisible(result.tickTransform),
          `${era}/${mode} checkbox tick must be visible (transform=${result.tickTransform})`
        );
        assert.ok(
          result.tickContrast >= 3,
          `${era}/${mode} checkbox tick contrast ${result.tickContrast.toFixed(2)} < 3`
        );
        assert.ok(
          tickVisible(result.radioDotTransform),
          `${era}/${mode} radio dot must scale in (transform=${result.radioDotTransform})`
        );
        assert.ok(
          result.radioContrast >= 3,
          `${era}/${mode} radio indicator contrast ${result.radioContrast.toFixed(2)} < 3`
        );
        assert.ok(
          result.switchDiffer,
          `${era}/${mode} switch track must change when on (off=${result.switchOff} on=${result.switchOn})`
        );
        assert.ok(
          result.thumbContrast >= 3,
          `${era}/${mode} switch thumb/track contrast ${result.thumbContrast.toFixed(2)} < 3 (thumb=${result.thumbOn} track=${result.switchOn})`
        );
      });
    });
  }
}
