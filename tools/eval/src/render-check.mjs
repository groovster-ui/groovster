import { createServer } from 'node:http';
import fs from 'node:fs';
import { chromium } from '../../a11y/node_modules/playwright/index.mjs';
import { safePath } from '../../../tests/helpers/safe-path.mjs';

/**
 * Load markup with Groovster CSS in Playwright and confirm expected classes render.
 */
export async function renderCheck(repoRoot, html, expect = {}) {
  const pageHtml = `<!doctype html>
<html><head>
<link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
<script src="/packages/elements/dist/era-elements.js"></script>
</head><body>${html}</body></html>`;

  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(pageHtml);
      return;
    }
    const file = safePath(repoRoot, url.replace(/^\//, ''));
    if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('missing');
      return;
    }
    const ct = file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/plain';
    res.writeHead(200, { 'Content-Type': ct });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const issues = [];
  try {
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'domcontentloaded' });
    for (const cls of expect.classes || []) {
      const loc = page.locator(`.${cls}`).first();
      const count = await page.locator(`.${cls}`).count();
      if (count < 1) {
        issues.push(`render: missing .${cls}`);
        continue;
      }
      const box = await loc.boundingBox();
      if (!box || box.width < 1 || box.height < 1) {
        issues.push(`render: .${cls} has empty box`);
      }
    }
    if (expect.dataEra) {
      const ok = await page.locator(`[data-era="${expect.dataEra}"]`).count();
      if (!ok) issues.push(`render: missing data-era=${expect.dataEra}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  return { pass: issues.length === 0, issues };
}
