import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { safePath } from '../helpers/safe-path.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WIDTHS = [320, 768, 1024, 1440, 1920];

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js')) return 'text/javascript';
  if (file.endsWith('.woff2')) return 'font/woff2';
  if (file.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/** Decode a non-interlaced 8-bit PNG (Playwright screenshots) with no extra deps. */
function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) throw new Error('not a png');
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 6;
  const idat = [];
  while (offset + 8 <= buffer.length) {
    const len = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') break;
    offset += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!bpp) throw new Error(`unsupported png color type ${colorType}`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const out = Buffer.alloc(width * height * 4);
  let src = 0;
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[src++];
    const recon = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const x = raw[src + i];
      const left = i >= bpp ? recon[i - bpp] : 0;
      const up = prev[i];
      const ul = i >= bpp ? prev[i - bpp] : 0;
      let val = x;
      if (filter === 1) val = (x + left) & 255;
      else if (filter === 2) val = (x + up) & 255;
      else if (filter === 3) val = (x + ((left + up) >> 1)) & 255;
      else if (filter === 4) val = (x + paeth(left, up, ul)) & 255;
      else if (filter !== 0) throw new Error(`png filter ${filter}`);
      recon[i] = val;
    }
    src += stride;
    if (bpp === 4) recon.copy(out, y * width * 4);
    else {
      for (let x = 0; x < width; x++) {
        const o = (y * width + x) * 4;
        out[o] = recon[x * 3];
        out[o + 1] = recon[x * 3 + 1];
        out[o + 2] = recon[x * 3 + 2];
        out[o + 3] = 255;
      }
    }
    prev = recon;
  }
  return { width, height, data: out };
}

function relLuminance(r, g, b) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
  const L1 = relLuminance(a[0], a[1], a[2]);
  const L2 = relLuminance(b[0], b[1], b[2]);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

function parseRgb(color) {
  const m = String(color).match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (!m) throw new Error(`unparsed color ${color}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function aaFloor(fontSize, fontWeight) {
  const bold = Number(fontWeight) >= 700;
  const large = fontSize >= 24 || (bold && fontSize >= 18.66);
  return large ? 3 : 4.5;
}

function pixelAt(png, x, y) {
  const xx = Math.max(0, Math.min(png.width - 1, x));
  const yy = Math.max(0, Math.min(png.height - 1, y));
  const i = (yy * png.width + xx) * 4;
  return [png.data[i], png.data[i + 1], png.data[i + 2]];
}

function overlaps(a, b) {
  return a.x < b.x + b.width - 1 && a.x + a.width > b.x + 1 && a.y < b.y + b.height - 1 && a.y + a.height > b.y + 1;
}

async function withServer(fn) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = safePath(REPO, url.replace(/^\//, ''));
    if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('missing');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(file) });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    await fn(port, browser);
  } finally {
    await browser.close();
    server.close();
  }
}

test('Atomic hero text stays on one side of the split and meets AA', async () => {
  await withServer(async (port, browser) => {
    const page = await browser.newPage({ deviceScaleFactor: 1 });
    const failures = [];
    for (const mode of ['light', 'dark']) {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`http://127.0.0.1:${port}/demos/showcase/mcm-atomic.html`, {
          waitUntil: 'networkidle',
        });
        await page.evaluate((next) => {
          document.documentElement.setAttribute('data-mode', next);
          document.documentElement.removeAttribute('data-fidelity-band');
        }, mode);
        await page.evaluate(() => document.fonts.ready);
        const layout = await page.evaluate(() => {
          const texts = ['.ew-hero .ew-script', '.ew-hero .ew-hero__title', '.ew-hero .ew-hero__subtitle'].map(
            (sel) => {
              const el = document.querySelector(sel);
              const style = getComputedStyle(el);
              const box = el.getBoundingClientRect();
              return {
                sel,
                color: (() => {
                  const canvas = document.createElement('canvas');
                  canvas.width = canvas.height = 1;
                  const ctx = canvas.getContext('2d', { willReadFrequently: true });
                  ctx.fillStyle = style.color;
                  ctx.fillRect(0, 0, 1, 1);
                  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                  return `rgb(${r}, ${g}, ${b})`;
                })(),
                fontSize: Number.parseFloat(style.fontSize),
                fontWeight: style.fontWeight,
                box: { x: box.x, y: box.y, width: box.width, height: box.height },
              };
            },
          );
          const stage = document.querySelector('.ew-hero__stage').getBoundingClientRect();
          const hero = document.querySelector('.ew-hero').getBoundingClientRect();
          return {
            texts,
            stage: { x: stage.x, y: stage.y, width: stage.width, height: stage.height },
            hero: { x: hero.x, y: hero.y, width: hero.width, height: hero.height },
          };
        });
        for (const text of layout.texts) {
          if (overlaps(text.box, layout.stage)) {
            failures.push(`${mode} ${width} ${text.sel} crosses the object stage`);
          }
        }
        await page.addStyleTag({
          content:
            '.ew-hero .ew-script,.ew-hero .ew-hero__title,.ew-hero .ew-hero__subtitle{color:transparent!important;text-shadow:none!important}',
        });
        const heroBox = layout.hero;
        const shot = decodePng(
          await page.screenshot({
            clip: {
              x: Math.max(0, heroBox.x),
              y: Math.max(0, heroBox.y),
              width: Math.min(width, heroBox.width),
              height: Math.min(900, heroBox.height),
            },
          }),
        );
        for (const text of layout.texts) {
          const floor = aaFloor(text.fontSize, text.fontWeight);
          const ink = parseRgb(text.color);
          const samples = [];
          const left = Math.ceil(text.box.x - heroBox.x) + 3;
          const top = Math.ceil(text.box.y - heroBox.y) + 3;
          const right = Math.floor(text.box.x + text.box.width - heroBox.x) - 3;
          const bottom = Math.floor(text.box.y + text.box.height - heroBox.y) - 3;
          for (let y = top; y <= Math.max(top, bottom); y += 7) {
            for (let x = left; x <= Math.max(left, right); x += 7) {
              samples.push(pixelAt(shot, x, y));
            }
          }
          if (!samples.length) samples.push(pixelAt(shot, left, top));
          const worst = samples.reduce((min, px) => Math.min(min, contrast(ink, px)), Infinity);
          if (worst < floor - 0.05) {
            failures.push(
              `${mode} ${width} ${text.sel} contrast ${worst.toFixed(2)} < ${floor} (size ${text.fontSize}px)`,
            );
          }
        }
      }
    }
    assert.deepEqual(failures, []);
    await page.close();
  });
});

test('Atomic scatter covers the page without positioning the body', async () => {
  await withServer(async (port, browser) => {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/mcm-atomic.html`, { waitUntil: 'networkidle' });
    const info = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const root = getComputedStyle(document.documentElement);
      return {
        bodyPosition: body.position,
        image: root.backgroundImage,
        attachment: root.backgroundAttachment,
        scroll: document.documentElement.scrollHeight,
        view: window.innerHeight,
      };
    });
    assert.equal(info.bodyPosition, 'static');
    assert.match(info.image, /svg/i);
    assert.equal(info.attachment, 'scroll');
    assert.ok(info.scroll > info.view + 200, `page should be taller than the viewport (${info.scroll})`);
    await page.close();
  });
});

test('Atomic checkbox is a rounded square and the spinner pulses under reduced motion', async () => {
  await withServer(async (port, browser) => {
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/mcm-atomic.html`, { waitUntil: 'networkidle' });
    const info = await page.evaluate(() => {
      const box = document.querySelector('.ew-checkbox__box');
      const style = getComputedStyle(box);
      const spin = document.querySelector('.ew-orbit--spin');
      const anim = getComputedStyle(spin);
      const list = document.querySelector('.ew-tabs [role="tablist"]');
      const rail = getComputedStyle(list, '::after');
      const listBox = list.getBoundingClientRect();
      const tabs = [...list.querySelectorAll('[role="tab"]')].map((el) => el.getBoundingClientRect());
      return {
        radius: style.borderRadius,
        shadow: style.boxShadow,
        width: Number.parseFloat(style.width),
        animationName: anim.animationName,
        animationDuration: anim.animationDuration,
        iteration: anim.animationIterationCount,
        railContent: rail.content,
        railPosition: rail.position,
        listWidth: listBox.width,
        tabsSpan: tabs.at(-1).right - tabs[0].left,
        listLeft: listBox.left,
        firstLeft: tabs[0].left,
        lastRight: tabs.at(-1).right,
        listRight: listBox.right,
      };
    });
    const radius = Number.parseFloat(info.radius);
    assert.ok(radius <= 6, `checkbox radius ${info.radius}`);
    assert.ok(info.width >= 18);
    assert.equal(info.shadow, 'none');
    assert.match(info.animationName, /ew-atomic-pulse/);
    assert.notEqual(info.animationDuration, '0s');
    assert.equal(info.iteration, 'infinite');
    assert.notEqual(info.railContent, 'none');
    assert.equal(info.railPosition, 'absolute');
    assert.ok(info.listWidth <= info.tabsSpan + 48, `rail box ${info.listWidth} vs tabs ${info.tabsSpan}`);
    assert.ok(info.firstLeft >= info.listLeft - 1);
    assert.ok(info.lastRight <= info.listRight + 1);
    await page.close();
  });
});

function lineCenters(png) {
  const x0 = Math.floor(png.width * 0.2);
  const x1 = Math.floor(png.width * 0.34);
  const y0 = Math.floor(png.height * 0.32);
  const y1 = png.height - 4;
  const scores = [];
  for (let y = y0; y < y1; y++) {
    let score = 0;
    const n = Math.max(1, x1 - x0);
    for (let x = x0; x < x1; x++) {
      const [r, g, b] = pixelAt(png, x, y);
      score += Math.max(g + b - r, r + b - g, 0);
    }
    scores.push(score / n);
  }
  const peaks = [];
  for (let i = 8; i < scores.length - 8; i++) {
    if (scores[i] < scores[i - 1] || scores[i] < scores[i + 1]) continue;
    let floor = Infinity;
    for (let k = i - 8; k <= i + 8; k++) floor = Math.min(floor, scores[k]);
    if (scores[i] - floor > 8 && scores[i] > floor * 1.15 && (!peaks.length || i - peaks[peaks.length - 1] > 3)) {
      peaks.push(i);
    }
  }
  return peaks;
}

test('Neon grid lines converge toward the horizon', async () => {
  await withServer(async (port, browser) => {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 1,
    });
    await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-mode', 'dark');
      document.documentElement.removeAttribute('data-fidelity-band');
    });
    await page.addStyleTag({
      content: '[data-era="neon"] .ew-hero__scanlines { display: none !important; }',
    });
    const stage = await page.locator('.ew-hero__stage').boundingBox();
    assert.ok(stage && stage.height > 80, 'stage missing');
    const png = decodePng(
      await page.screenshot({
        clip: { x: stage.x, y: stage.y, width: stage.width, height: stage.height },
      }),
    );
    const peaks = lineCenters(png);
    assert.ok(peaks.length >= 5, `expected several horizontal grid lines, saw ${peaks.length} at ${peaks.join(',')}`);
    const gaps = [];
    for (let i = 1; i < peaks.length; i++) gaps.push(peaks[i] - peaks[i - 1]);
    const third = Math.max(1, Math.floor(gaps.length / 3));
    const top = gaps.slice(0, third).reduce((s, n) => s + n, 0) / third;
    const bottom = gaps.slice(-third).reduce((s, n) => s + n, 0) / third;
    assert.ok(
      top < bottom,
      `grid should recede (top gap ${top.toFixed(1)} vs bottom ${bottom.toFixed(1)}; gaps ${gaps.join(',')})`,
    );
    await page.close();
  });
});

test('Neon floor starts at the horizon and meets the hero bottom', async () => {
  await withServer(async (port, browser) => {
    for (const [width, height] of [
      [1280, 900],
      [1440, 900],
      [390, 844],
      [1024, 800],
    ]) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.goto(`http://127.0.0.1:${port}/demos/showcase/neon.html`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-mode', 'dark');
        document.documentElement.removeAttribute('data-fidelity-band');
      });
      const box = await page.evaluate(() => {
        const grid = document.querySelector('.ew-hero__grid').getBoundingClientRect();
        const hero = document.querySelector('.ew-hero').getBoundingClientRect();
        const mountains = document.querySelector('.ew-hero__mountains').getBoundingClientRect();
        return {
          gridTop: grid.top,
          gridBottom: grid.bottom,
          gridHeight: grid.height,
          heroBottom: hero.bottom,
          heroHeight: hero.height,
          horizon: mountains.bottom,
        };
      });
      assert.ok(
        Math.abs(box.gridTop - box.horizon) <= 4,
        `${width} floor top ${box.gridTop.toFixed(1)} vs horizon ${box.horizon.toFixed(1)}`,
      );
      assert.ok(
        Math.abs(box.gridBottom - box.heroBottom) <= 1,
        `${width} floor bottom ${box.gridBottom.toFixed(1)} vs hero ${box.heroBottom.toFixed(1)}`,
      );
      assert.ok(
        box.gridHeight >= box.heroHeight * 0.4,
        `${width} floor height ${box.gridHeight.toFixed(1)} < 40% of hero ${box.heroHeight.toFixed(1)}`,
      );
      await page.close();
    }
  });
});
