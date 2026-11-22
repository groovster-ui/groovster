import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { safePath } from '../tests/helpers/safe-path.mjs';
import { installSkill } from './install-skill.mjs';

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), '../tools/a11y/package.json'));
const { chromium } = require('playwright');

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
};

function serve(rootDir) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const requested = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const file = safePath(rootDir, requested);
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'groovster-skill-'));
const browserPromise = chromium.launch();
try {
  const installed = installSkill(tmp, ['cursor', 'claude', 'codex']);
  if (installed.some((item) => item.skipped)) throw new Error('clean install should copy, not skip');
  for (const item of installed) {
    const skill = fs.readFileSync(path.join(item.dest, 'SKILL.md'), 'utf8');
    if (!skill.startsWith('---\nname: groovster\n')) throw new Error(`${item.platform} skill frontmatter`);
    for (const id of ['editorial', 'event', 'commerce', 'hospitality', 'dashboard']) {
      const ref = path.join(item.dest, 'references', `${id}.md`);
      if (!fs.existsSync(ref)) throw new Error(`missing ${item.platform} reference ${id}`);
    }
  }
  const vendor = path.join(tmp, 'vendor/groovster');
  fs.mkdirSync(vendor, { recursive: true });
  fs.copyFileSync(path.join(repo, 'packages/css/dist/era-widgets.css'), path.join(vendor, 'era-widgets.css'));
  fs.cpSync(path.join(repo, 'packages/css/dist/fonts'), path.join(vendor, 'fonts'), { recursive: true });
  fs.copyFileSync(path.join(repo, 'packages/elements/dist/era-elements.js'), path.join(vendor, 'era-elements.js'));
  fs.writeFileSync(
    path.join(tmp, 'index.html'),
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="vendor/groovster/era-widgets.css"></head>
<body><div class="ew-root" data-era="deco" data-mode="light" data-fidelity-band="costume"><button type="button" class="ew-button">Save</button></div></body></html>`,
  );
  const server = await serve(tmp);
  const { port } = server.address();
  const browser = await browserPromise;
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.goto(`http://127.0.0.1:${port}/`);
  const era = await page.locator('.ew-root').getAttribute('data-era');
  const label = await page.locator('.ew-button').evaluate((el) => el.textContent.trim());
  await browser.close();
  server.close();
  if (era !== 'deco' || label.trim() !== 'Save' || errors.length) {
    throw new Error(`external page failed era=${era} label=${label} errors=${errors.join(';')}`);
  }
  console.log(`skill install verified in ${tmp}`);
} finally {
  const browser = await browserPromise.catch(() => null);
  await browser?.close().catch(() => {});
  fs.rmSync(tmp, { recursive: true, force: true });
}
