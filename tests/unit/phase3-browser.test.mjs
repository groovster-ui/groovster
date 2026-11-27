import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { safePath } from '../helpers/safe-path.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js')) return 'text/javascript';
  if (file.endsWith('.woff2')) return 'font/woff2';
  return 'text/html';
}

function lum(hex) {
  const n = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const [hi, lo] = lum(foreground) > lum(background) ? [lum(foreground), lum(background)] : [lum(background), lum(foreground)];
  return (hi + 0.05) / (lo + 0.05);
}

function hex(color) {
  const match = color.match(/rgba?\((\d+), (\d+), (\d+)/);
  assert.ok(match, color);
  return `#${[match[1], match[2], match[3]].map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
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

test('phase 3 era leftovers hold on the dense pages', async () => {
  const server = await serve();
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://127.0.0.1:${port}/demos/apps-dense/site/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const root = document.querySelector('[data-groovster-root]');
      root.dataset.era = 'groovy';
      root.dataset.mode = 'light';
    });
    const groovy = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    assert.ok(groovy.scroll <= groovy.client + 1, `groovy scroll ${groovy.scroll}`);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => {
      const root = document.querySelector('[data-groovster-root]');
      root.dataset.era = 'mcm-atomic';
      root.dataset.mode = 'dark';
      const card = document.querySelector('.ew-card');
      const link = document.createElement('a');
      link.className = 'ew-card__title';
      link.href = '#work';
      link.textContent = 'Margin notes';
      card.querySelector('h3').replaceWith(link);
    });
    const atomic = await page.evaluate(() => {
      const link = document.querySelector('a.ew-card__title');
      const color = getComputedStyle(link).color;
      const bg = getComputedStyle(link.closest('.ew-card')).backgroundColor;
      return { color, bg };
    });
    assert.ok(contrast(hex(atomic.color), hex(atomic.bg)) >= 4.5, `${atomic.color} on ${atomic.bg}`);

    await page.goto(`http://127.0.0.1:${port}/demos/apps-dense/stream/index.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const root = document.querySelector('[data-groovster-root]');
      root.dataset.era = 'mcm-atomic';
      root.dataset.mode = 'light';
    });
    const shelf = await page.evaluate(() => {
      const node = document.querySelector('.ew-shelf');
      const style = getComputedStyle(node);
      return { image: style.backgroundImage, color: style.backgroundColor };
    });
    assert.equal(shelf.image, 'none');
    assert.doesNotMatch(shelf.color, /, 0\)/);

    await page.goto(`http://127.0.0.1:${port}/demos/apps-dense/site/index.html`, { waitUntil: 'networkidle' });
    const neon = await page.evaluate(() => {
      const root = document.querySelector('[data-groovster-root]');
      root.dataset.era = 'neon';
      root.dataset.mode = 'light';
      const link = document.querySelector('.ew-link');
      const style = getComputedStyle(link);
      let node = link;
      let bg = 'rgba(0, 0, 0, 0)';
      while (node) {
        const next = getComputedStyle(node).backgroundColor;
        if (next && !next.endsWith(', 0)')) { bg = next; break; }
        node = node.parentElement;
      }
      return { color: style.color, bg, deco: style.textDecorationLine, decoColor: style.textDecorationColor };
    });
    assert.match(neon.deco, /underline/);
    assert.match(neon.decoColor, /226, 24, 106/);
    assert.ok(contrast(hex(neon.color), hex(neon.bg)) >= 4.5, `${neon.color} on ${neon.bg}`);

    const memphis = await page.evaluate(() => {
      const root = document.querySelector('[data-groovster-root]');
      root.dataset.era = 'memphis';
      root.dataset.mode = 'light';
      const heading = document.querySelector('.ew-section-heading');
      const after = getComputedStyle(heading, '::after');
      return { content: after.content, height: parseFloat(after.height), image: after.backgroundImage };
    });
    assert.notEqual(memphis.content, 'none');
    assert.ok(memphis.height >= 8, `squiggle ${memphis.height}`);
    assert.match(memphis.image, /svg/i);

    const neutral = await page.evaluate(() => {
      const root = document.querySelector('[data-groovster-root]');
      root.dataset.era = 'neutral';
      root.dataset.mode = 'light';
      const hero = document.querySelector('.ew-hero');
      const title = document.querySelector('.ew-hero__title');
      return {
        image: getComputedStyle(hero).backgroundImage,
        size: parseFloat(getComputedStyle(title).fontSize),
      };
    });
    assert.match(neutral.image, /gradient/i);
    assert.ok(neutral.size >= 40, `neutral title ${neutral.size}`);
  } finally {
    await browser.close();
    server.close();
  }
});
