import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { safePath } from '../../../tests/helpers/safe-path.mjs';
import { listEraIds } from '../../../tests/helpers/eras.mjs';
import { isMatrixUrl, matrixDocument } from '../../../tests/a11y/matrix-html.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const MATRIX = matrixDocument(REPO);
const SHOTS = path.join(REPO, 'tests/a11y/screenshots');
const widths = [320, 375, 768, 1024, 1440];

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js')) return 'text/javascript';
  if (file.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (isMatrixUrl(url)) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(MATRIX);
    return;
  }
  const file = safePath(REPO, url.replace(/^\//, ''));
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(file) });
  fs.createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];
fs.mkdirSync(SHOTS, { recursive: true });

try {
  await page.goto(`http://127.0.0.1:${port}/tests/a11y/fixtures/matrix.html`, { waitUntil: 'networkidle' });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    const report = await page.evaluate(() => {
      const cases = [...document.querySelectorAll('[data-testid^="case-"]')];
      const overflow = cases
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.getAttribute('data-testid'));
      const small = [...document.querySelectorAll('.ew-button, .ew-text-field__label, .ew-checkbox__label, .ew-alert__body, .ew-switch__label')]
        .filter((el) => Number.parseFloat(getComputedStyle(el).fontSize) < 12)
        .map((el) => `${el.className}:${getComputedStyle(el).fontSize}`);
      return { overflow, small, cases: cases.length };
    });
    if (!report.cases) failures.push(`${width}: no cases`);
    if (report.overflow.length) failures.push(`${width} overflow: ${report.overflow.slice(0, 6).join(', ')}`);
    if (report.small.length) failures.push(`${width} small text: ${report.small.slice(0, 6).join(', ')}`);
  }

  await page.setViewportSize({ width: 375, height: 800 });
  const eras = listEraIds(REPO);
  for (const era of eras) {
    const locator = page.locator(`[data-testid="case-${era}-light"]`);
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: path.join(SHOTS, `${era}-costume-375.png`) });
  }

  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.locator('.ew-button').first().focus();
  const focus = await page.locator('.ew-button').first().evaluate((el) => {
    const style = getComputedStyle(el);
    return { outline: style.outlineStyle, width: style.outlineWidth };
  });
  if (focus.outline === 'none' || focus.width === '0px') {
    failures.push(`forced-colors focus outline missing (${focus.outline} ${focus.width})`);
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Responsive checks passed at ${widths.join(', ')}px. Screenshots in tests/a11y/screenshots.`);
