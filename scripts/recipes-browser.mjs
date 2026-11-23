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
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
const ERAS = eraSwitchEntries(root);

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

async function overflow(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const nodes = [...document.querySelectorAll('.site-wrap, .site-nav, .site-bar, h1, .ew-card, .site-filters')];
    return nodes
      .filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && (box.right > width + 1 || box.left < -1);
      })
      .map((el) => `${el.tagName}.${el.className}`.slice(0, 80));
  });
}

async function axe(page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations
    .filter((item) => item.impact === 'serious' || item.impact === 'critical')
    .map((item) => `${item.id}: ${item.help}`);
}

async function openSkin(page) {
  const details = page.locator('details.site-skin');
  if ((await details.count()) === 0) return;
  const open = await details.evaluate((el) => el.open);
  if (!open) await details.locator('summary').click();
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
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));

try {
  const sites = ['editorial', 'event', 'commerce', 'hospitality', 'dashboard'];
  for (const id of sites) {
    errors.length = 0;
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`http://127.0.0.1:${port}/demos/recipes/${id}/index.html`, { waitUntil: 'networkidle' });
    const violations = await axe(page);
    if (violations.length) fail(`${id} axe ${violations.join('; ')}`);
    const wide = await overflow(page);
    if (wide.length) fail(`${id} desktop overflow ${wide.join(', ')}`);
    await openSkin(page);
    for (const [era, name] of ERAS) {
      await page.getByRole('button', { name, exact: true }).click();
      await page.locator(`[data-groovster-root][data-era="${era}"]`).waitFor();
    }
    if (id === 'editorial') {
      await page.locator('#reader-email').fill('reader@example.test');
      await page.locator('#newsletter input[type="checkbox"]').check();
      await page.getByRole('button', { name: 'Request the list' }).click();
      await page.locator('#newsletter [data-demo-status]').waitFor({ state: 'visible' });
    }
    if (id === 'event') {
      await page.getByRole('button', { name: 'Review hold' }).click();
      await page.locator('#ticket-dialog[open]').waitFor();
      await page.getByRole('button', { name: 'Close' }).click();
    }
    if (id === 'commerce') {
      await page.locator('[data-cart-add]').first().click();
      await page.locator('[data-cart-count]').filter({ hasText: '1' }).waitFor();
      await page.getByRole('button', { name: /Cart/ }).click();
      await page.locator('#cart-dialog[open]').waitFor();
    }
    if (id === 'hospitality') {
      await page.locator('#arrive').fill('2026-12-01');
      await page.locator('#depart').fill('2026-12-04');
      await page.locator('#guest-name').fill('Ada North');
      await page.getByRole('button', { name: 'Send request' }).click();
      await page.locator('#reserve-dialog[open]').waitFor();
    }
    if (id === 'dashboard') {
      await page.locator('#lane-search').fill('NL-1048');
      await page.locator('[data-row-count]').filter({ hasText: '1 matching' }).waitFor();
    }
    if (errors.length) fail(`${id} pageerror ${errors.join('; ')}`);
    await page.setViewportSize({ width: 390, height: 844 });
    const narrow = await overflow(page);
    if (narrow.length) fail(`${id} mobile overflow ${narrow.join(', ')}`);
    console.log(`${id} ok`);
  }

  const modes = ['light', 'dark'];
  const widths = [
    [1440, 900],
    [390, 844],
  ];
  for (const id of sites) {
    await page.goto(`http://127.0.0.1:${port}/demos/recipes/${id}/index.html`, { waitUntil: 'networkidle' });
    for (const [era] of ERAS) {
      for (const mode of modes) {
        for (const [width, height] of widths) {
          await page.setViewportSize({ width, height });
          await page.evaluate(({ era, mode }) => {
            const root = document.querySelector('[data-groovster-root]');
            root.dataset.era = era;
            root.dataset.mode = mode;
          }, { era, mode });
          const problems = await page.evaluate(() => {
            const viewW = document.documentElement.clientWidth;
            const viewH = window.innerHeight;
            const found = [];
            if (document.documentElement.scrollWidth > viewW + 1) {
              found.push(`scrollWidth ${document.documentElement.scrollWidth}`);
            }
            const nodes = [...document.querySelectorAll('.site-wrap, .site-nav, .site-bar, h1, .ew-card, .site-filters')];
            for (const el of nodes) {
              const box = el.getBoundingClientRect();
              if (box.width > 0 && (box.right > viewW + 1 || box.left < -1)) {
                found.push(`${el.tagName}.${String(el.className).slice(0, 60)}`);
              }
            }
            const hero = document.querySelector('.ew-hero');
            const title = hero?.querySelector('.ew-hero__title, h1');
            if (hero && title) {
              const titleBox = title.getBoundingClientRect();
              const heroBox = hero.getBoundingClientRect();
              if (titleBox.top < -1 || titleBox.bottom > viewH + 1) found.push('title outside first viewport');
              if (titleBox.top < heroBox.top - 1 || titleBox.bottom > heroBox.bottom + 1) found.push('title outside hero');
              const stage = hero.querySelector('.ew-hero__stage');
              if (stage) {
                const stageBox = stage.getBoundingClientRect();
                if (stageBox.height > 24 && stageBox.width > 24) {
                  const below = titleBox.top >= stageBox.bottom - 4;
                  const beside = titleBox.right <= stageBox.left + 8 || titleBox.left >= stageBox.right - 8;
                  if (below && !beside) found.push('title under art');
                }
              }
            }
            return found;
          });
          if (problems.length) fail(`${id} ${era} ${mode} ${width} ${problems.join(', ')}`);
        }
      }
    }
    console.log(`${id} heroes ok`);
  }

  errors.length = 0;
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`http://127.0.0.1:${port}/demos/launch/index.html`, { waitUntil: 'networkidle' });
  const launchAxe = await axe(page);
  if (launchAxe.length) fail(`launch axe ${launchAxe.join('; ')}`);
  await page.getByRole('button', { name: 'Hotel' }).click();
  await page.waitForFunction(() => document.querySelector('#preview').src.includes('hospitality'));
  const frame = page.frameLocator('#preview');
  await frame.locator('h1', { hasText: 'Marlowe' }).waitFor();
  await page.getByRole('button', { name: 'Deco', exact: true }).click();
  await frame.locator('[data-era="deco"]').waitFor();
  if (errors.length) fail(`launch pageerror ${errors.join('; ')}`);
  console.log('launch ok');
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(`${failures.length} site check(s) failed`);
  process.exit(1);
}
console.log('recipe sites passed');
