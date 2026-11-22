import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from './a11y/node_modules/playwright/index.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(repo, 'demos/reference/shots/after');
fs.mkdirSync(outDir, { recursive: true });

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js')) return 'text/javascript';
  if (file.endsWith('.woff2')) return 'font/woff2';
  if (file.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}

const shots = [
  ['demos/showcase/deco.html', 1440, 'dark', 'costume', '', 'showcase-1440-dark-costume'],
  ['demos/showcase/deco.html', 1440, 'light', 'costume', '', 'showcase-1440-light-costume'],
  ['demos/showcase/deco.html', 1440, 'dark', 'standard', '', 'showcase-1440-dark-standard'],
  ['demos/showcase/deco.html', 1440, 'light', 'whisper', '', 'showcase-1440-light-whisper'],
  ['demos/showcase/deco.html', 375, 'dark', 'costume', '', 'showcase-375-dark-costume'],
  ['demos/showcase/deco.html', 320, 'light', 'costume', '', 'showcase-320-light-costume'],
  ['demos/reference/grand-meridian/index.html', 1440, 'light', 'costume', '', 'meridian-1440-light-costume'],
  ['demos/reference/grand-meridian/index.html', 1440, 'dark', 'costume', '', 'meridian-1440-dark-costume'],
  ['demos/reference/grand-meridian/index.html', 1440, 'light', 'standard', '', 'meridian-1440-light-standard'],
  ['demos/reference/grand-meridian/index.html', 1440, 'dark', 'whisper', '', 'meridian-1440-dark-whisper'],
  ['demos/reference/grand-meridian/index.html', 1024, 'light', 'costume', '', 'meridian-1024-light-costume'],
  ['demos/reference/grand-meridian/index.html', 768, 'dark', 'costume', '', 'meridian-768-dark-costume'],
  ['demos/reference/grand-meridian/index.html', 375, 'light', 'costume', '', 'meridian-375-light-costume'],
  ['demos/reference/grand-meridian/index.html', 320, 'dark', 'costume', '', 'meridian-320-dark-costume'],
  ['demos/reference/metropolitan/index.html', 1440, 'dark', 'costume', 'streamline', 'metro-1440-dark-costume-stream'],
  ['demos/reference/metropolitan/index.html', 1440, 'light', 'costume', 'streamline', 'metro-1440-light-costume-stream'],
  ['demos/reference/metropolitan/index.html', 1440, 'dark', 'costume', '', 'metro-1440-dark-costume-classic'],
  ['demos/reference/metropolitan/index.html', 1440, 'dark', 'standard', 'streamline', 'metro-1440-dark-standard-stream'],
  ['demos/reference/metropolitan/index.html', 1440, 'light', 'whisper', 'streamline', 'metro-1440-light-whisper-stream'],
  ['demos/reference/metropolitan/index.html', 768, 'dark', 'costume', 'streamline', 'metro-768-dark-costume-stream'],
  ['demos/reference/metropolitan/index.html', 375, 'dark', 'costume', 'streamline', 'metro-375-dark-costume-stream'],
  ['demos/reference/metropolitan/index.html', 320, 'light', 'costume', 'streamline', 'metro-320-light-costume-stream'],
  ['demos/reference/metropolitan/index.html', 1024, 'dark', 'costume', 'streamline', 'metro-1024-dark-costume-stream'],
];

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(repo, url.replace(/^\//, ''));
  if (!file.startsWith(repo) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
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
const page = await browser.newPage({ deviceScaleFactor: 1 });
const problems = [];

for (const [file, width, mode, band, dialect, name] of shots) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`http://127.0.0.1:${port}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(({ mode, band, dialect }) => {
    const root = document.documentElement;
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-fidelity-band', band);
    if (dialect) root.setAttribute('data-dialect', dialect);
    else root.removeAttribute('data-dialect');
  }, { mode, band, dialect });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  if (overflow > 2) problems.push(`${name} overflow ${overflow}px`);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  console.log(name, overflow > 2 ? `OVERFLOW ${overflow}` : 'ok');
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`http://127.0.0.1:${port}/demos/reference/grand-meridian/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ colorScheme: 'light' });
await page.addStyleTag({ content: 'html { filter: grayscale(1); }' });
await page.screenshot({ path: path.join(outDir, 'meridian-1440-light-costume-gray.png'), fullPage: true });
await page.goto(`http://127.0.0.1:${port}/demos/reference/metropolitan/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.documentElement.setAttribute('data-mode', 'dark');
  document.documentElement.setAttribute('data-fidelity-band', 'costume');
  document.documentElement.setAttribute('data-dialect', 'streamline');
  return document.fonts.ready;
});
await page.addStyleTag({ content: 'html { filter: grayscale(1); }' });
await page.screenshot({ path: path.join(outDir, 'metro-1440-dark-costume-gray.png'), fullPage: true });

await page.goto(`http://127.0.0.1:${port}/demos/reference/grand-meridian/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.locator('[data-room="The Avenue Suite"]').click();
await page.screenshot({ path: path.join(outDir, 'meridian-dialog.png') });
await page.locator('#room-dialog [type="submit"]').click();
await page.locator('#guest').fill('Ada Laurent');
await page.locator('#email').fill('ada@studio.test');
await page.locator('#arrive-on').fill('1926-05-12');
await page.locator('#depart').fill('1926-05-16');
await page.locator('.ew-checkbox__control').check();
await page.locator('#reserve-form [type="submit"]').click();
const status = await page.locator('#reserve-status').textContent();
if (!status || !status.includes('Request noted')) problems.push('reserve status missing');

await page.goto(`http://127.0.0.1:${port}/demos/reference/metropolitan/index.html`, { waitUntil: 'networkidle' });
await page.locator('[data-seat="Balcony"]').click();
await page.locator('#qty').fill('3');
await page.locator('#hold').click();
const hold = await page.locator('#hold-copy').textContent();
if (!hold || !hold.includes('Balcony') || !hold.includes('66')) problems.push(`hold copy unexpected: ${hold}`);
await page.screenshot({ path: path.join(outDir, 'metro-hold-dialog.png') });

await browser.close();
server.close();
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('review shots ok');
