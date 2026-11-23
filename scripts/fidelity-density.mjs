import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { safePath } from '../tests/helpers/safe-path.mjs';

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), '../tools/a11y/package.json'));
const { chromium } = require('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shotDir = path.join(root, 'generated/eval/shots');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};
const SITES = {
  editorial: { era: 'swiss', mode: 'light', band: 'costume' },
  event: { era: 'neon', mode: 'dark', band: 'costume' },
  commerce: { era: 'groovy', mode: 'light', band: 'standard' },
  hospitality: { era: 'deco', mode: 'light', band: 'costume' },
  dashboard: { era: 'neutral', mode: 'light', band: 'whisper' },
};
const SHOTS = [
  ['event', 'neon', 'whisper'],
  ['event', 'neon', 'costume'],
  ['hospitality', 'deco', 'whisper'],
  ['hospitality', 'deco', 'costume'],
  ['dashboard', 'neutral', 'whisper'],
  ['dashboard', 'neutral', 'costume'],
  ['editorial', 'swiss', 'costume'],
  ['commerce', 'groovy', 'standard'],
];

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

async function measure(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('.ew-hero');
    const cell = document.querySelector('td');
    const card = document.querySelector('.ew-card');
    const body = getComputedStyle(document.body);
    const rays = document.querySelector('.ew-hero__rays, .ew-hero');
    const width = document.documentElement.clientWidth;
    let covered = 0;
    for (const node of document.querySelectorAll('td')) {
      const box = node.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) continue;
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + Math.min(8, box.height / 2));
      if (top && top !== node && !node.contains(top)) covered += 1;
    }
    const overflow = [...document.querySelectorAll('.site-wrap, .site-table-wrap, h1, .ew-card')].some((el) => {
      const box = el.getBoundingClientRect();
      return box.width > 0 && (box.right > width + 1 || box.left < -1);
    });
    return {
      heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : 0,
      cellPad: cell ? getComputedStyle(cell).padding : '',
      cardHeight: card ? Math.round(card.getBoundingClientRect().height) : 0,
      fontSize: body.fontSize,
      motion: rays ? getComputedStyle(rays).animationDuration : '',
      coveredCells: covered,
      overflow,
    };
  });
}

const server = await serve();
const { port } = server.address();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
fs.mkdirSync(shotDir, { recursive: true });
const samples = [];
try {
  for (const id of Object.keys(SITES)) {
    for (const era of ['neutral', 'deco', 'neon']) {
      for (const band of ['whisper', 'standard', 'costume']) {
        const mode = SITES[id].mode;
        await page.goto(
          `http://127.0.0.1:${port}/demos/recipes/${id}/index.html?embed=1&era=${era}&mode=${mode}&band=${band}`,
          { waitUntil: 'networkidle' },
        );
        const metrics = await measure(page);
        samples.push({ id, era, mode, band, viewport: '1280', ...metrics });
        if (SHOTS.some(([site, shotEra, shotBand]) => site === id && shotEra === era && shotBand === band)) {
          await page.screenshot({ path: path.join(shotDir, `${id}-${era}-${band}.png`), fullPage: false });
        }
      }
    }
    const defaults = SITES[id];
    if (defaults.era !== 'neutral' && defaults.era !== 'deco' && defaults.era !== 'neon') {
      await page.goto(
        `http://127.0.0.1:${port}/demos/recipes/${id}/index.html?embed=1&era=${defaults.era}&mode=${defaults.mode}&band=${defaults.band}`,
        { waitUntil: 'networkidle' },
      );
      await page.screenshot({ path: path.join(shotDir, `${id}-${defaults.era}-${defaults.band}.png`), fullPage: false });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(
      `http://127.0.0.1:${port}/demos/recipes/${id}/index.html?embed=1&era=deco&mode=light&band=costume`,
      { waitUntil: 'networkidle' },
    );
    const reduced = await measure(page);
    samples.push({ id, era: 'deco', mode: 'light', band: 'costume', viewport: '1280', reducedMotion: true, ...reduced });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(
      `http://127.0.0.1:${port}/demos/recipes/${id}/index.html?embed=1&era=${defaults.era}&mode=${defaults.mode}&band=${defaults.band}`,
      { waitUntil: 'networkidle' },
    );
    const mobile = await measure(page);
    samples.push({ id, ...defaults, viewport: '390', ...mobile });
    await page.setViewportSize({ width: 1280, height: 800 });
  }
} finally {
  await browser.close();
  server.close();
}

const report = {
  hypothesis: 'Fidelity differences are an input to inspect, not a result. A global density token was not added.',
  densitySystem: 'not-added',
  reason: 'Table cells were measured for occlusion. Page CSS already compacts the dashboard.',
  samples,
};
const out = path.join(root, 'generated/eval/fidelity-density.json');
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
const covered = samples.filter((sample) => sample.coveredCells > 0);
const overflow = samples.filter((sample) => sample.overflow);
console.log(`wrote ${samples.length} samples; covered ${covered.length}; overflow ${overflow.length}`);
