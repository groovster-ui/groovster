/**
 * Swiss and Bauhaus reference demos.
 * 4 sites × 5 widths × 2 modes × 3 fidelity bands = 120 combinations,
 * plus one functional check per site.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium } from 'playwright';
import { expect } from 'playwright/test';
import { safePath } from '../helpers/safe-path.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SITES = ['swiss-journal', 'swiss-console', 'bauhaus-museum', 'bauhaus-studio'];
const WIDTHS = [320, 375, 768, 1024, 1440];
const MODES = ['light', 'dark'];
const BANDS = ['whisper', 'standard', 'costume'];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

assert.equal(
  SITES.length * WIDTHS.length * MODES.length * BANDS.length,
  120,
  'modernist coverage must stay at 120 viewport/mode/fidelity combinations'
);

let server;
let port;
let browser;

function startServer() {
  const httpServer = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const file = safePath(root, decodeURIComponent(url.pathname).replace(/^\/+/, ''));
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    httpServer.listen(0, '127.0.0.1', () => resolve(httpServer));
  });
}

test.before(async () => {
  server = await startServer();
  port = server.address().port;
  browser = await chromium.launch({ headless: true });
});

test.after(async () => {
  await browser?.close();
  server?.close();
});

async function openDemo(site, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  const href = `http://127.0.0.1:${port}/demos/reference/${site}/index.html`;
  await page.goto(href, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-era]').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready);
  return { page, errors, href };
}

async function expectText(locator, expected, message) {
  try {
    await expect.poll(async () => (await locator.textContent())?.trim(), { message }).toBe(expected);
  } catch (error) {
    const actual = ((await locator.textContent()) || '').trim();
    throw new Error(`${message}: expected "${expected}", got "${actual}". ${error.message}`);
  }
}

test('each reference demo keeps mode, fidelity, and layout across 120 combinations', { timeout: 180_000 }, async () => {
  let checks = 0;
  for (const site of SITES) {
    for (const width of WIDTHS) {
      const { page, errors } = await openDemo(site, width);
      try {
        for (const mode of MODES) {
          for (const band of BANDS) {
            const where = `${site} at ${width}px / ${mode} / ${band}`;
            await page.locator('[data-mode-switch]').selectOption(mode);
            await page.locator('[data-band-switch]').selectOption(band);
            const root = page.locator('[data-era]');
            await expect.poll(async () => root.getAttribute('data-mode'), { message: `${where}: data-mode did not change` }).toBe(mode);
            await expect
              .poll(async () => root.getAttribute('data-fidelity-band'), { message: `${where}: data-fidelity-band did not change` })
              .toBe(band);
            const modeNow = await root.getAttribute('data-mode');
            const bandNow = await root.getAttribute('data-fidelity-band');
            assert.equal(modeNow, mode, `${where}: data-mode stayed "${modeNow}"`);
            assert.equal(bandNow, band, `${where}: data-fidelity-band stayed "${bandNow}"`);
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
            assert.equal(overflow, false, `${where}: page overflows horizontally`);
            checks += 1;
          }
        }
        assert.deepEqual(errors, [], `${site} at ${width}px browser errors: ${errors.join('; ')}`);
      } finally {
        await page.close();
      }
    }
  }
  assert.equal(checks, 120, `ran ${checks} combinations, expected 120`);
});

test('bauhaus-studio cart adds the first product price', { timeout: 30_000 }, async () => {
  const { page, errors } = await openDemo('bauhaus-studio', 375);
  try {
    await page.locator('[data-buy]').first().click();
    await expectText(page.locator('[data-cart]'), '$89.00', 'bauhaus-studio cart at 375px');
    assert.deepEqual(errors, [], `bauhaus-studio browser errors: ${errors.join('; ')}`);
  } finally {
    await page.close();
  }
});

test('swiss-console resolve marks the first issue Resolved', { timeout: 30_000 }, async () => {
  const { page, errors } = await openDemo('swiss-console', 375);
  try {
    await page.locator('[data-resolve]').first().click();
    await expectText(page.locator('[data-status]').first(), 'Resolved', 'swiss-console resolution at 375px');
    assert.deepEqual(errors, [], `swiss-console browser errors: ${errors.join('; ')}`);
  } finally {
    await page.close();
  }
});

test('bauhaus-museum ticket calculator totals three tickets', { timeout: 30_000 }, async () => {
  const { page, errors } = await openDemo('bauhaus-museum', 375);
  try {
    await page.locator('[data-tickets]').fill('3');
    await expectText(page.locator('[data-cart]'), '$54.00', 'bauhaus-museum ticket calculator at 375px');
    assert.deepEqual(errors, [], `bauhaus-museum browser errors: ${errors.join('; ')}`);
  } finally {
    await page.close();
  }
});

test('swiss-journal filter keeps the typography article', { timeout: 30_000 }, async () => {
  const { page, errors } = await openDemo('swiss-journal', 375);
  try {
    await page.locator('[data-filter]').fill('typography');
    await expect
      .poll(async () => page.locator('[data-filterable]:visible').count(), {
        message: 'swiss-journal filter at 375px should leave one visible article',
      })
      .toBe(1);
    const visible = await page.locator('[data-filterable]:visible').count();
    assert.equal(visible, 1, `swiss-journal filter at 375px left ${visible} visible articles, expected 1`);
    assert.deepEqual(errors, [], `swiss-journal browser errors: ${errors.join('; ')}`);
  } finally {
    await page.close();
  }
});
