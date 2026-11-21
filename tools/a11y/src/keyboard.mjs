import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const FIXTURE = path.join(REPO, 'tests/a11y/fixtures/matrix.html');

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  return 'text/html';
}

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(REPO, url.replace(/^\//, ''));
  if (url === '/' || url === '/matrix.html') file = FIXTURE;
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
await page.goto(`http://127.0.0.1:${port}/tests/a11y/fixtures/matrix.html`, {
  waitUntil: 'networkidle',
});

const failures = [];
const eras = ['neutral', 'deco', 'mcm-atomic', 'neon'];

for (const era of eras) {
  const root = page.locator(`[data-testid="case-${era}-light"]`);
  const tab1 = root.locator('[role="tab"]').nth(0);
  const tab2 = root.locator('[role="tab"]').nth(1);
  await tab1.focus();
  await page.keyboard.press('ArrowRight');
  const selected = await tab2.getAttribute('aria-selected');
  const tabIndex = await tab2.getAttribute('tabindex');
  if (selected !== 'true' || tabIndex !== '0') {
    failures.push(`${era}: ArrowRight did not select second tab (selected=${selected}, tabindex=${tabIndex})`);
  }
  const hidden = await root.locator('[role="tabpanel"]').nth(1).evaluate((el) => el.hasAttribute('hidden'));
  if (hidden) failures.push(`${era}: second panel still hidden after ArrowRight`);

  await page.keyboard.press('Home');
  const back = await tab1.getAttribute('aria-selected');
  if (back !== 'true') failures.push(`${era}: Home did not return to first tab`);

  await page.keyboard.press('End');
  const endSel = await tab2.getAttribute('aria-selected');
  if (endSel !== 'true') failures.push(`${era}: End did not select last tab`);
}

await browser.close();
server.close();

const outDir = path.join(REPO, 'generated/a11y');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'keyboard-report.json'),
  JSON.stringify({ pass: failures.length === 0, failures }, null, 2) + '\n'
);

if (failures.length) {
  console.error('Keyboard APG checks failed:');
  for (const f of failures) console.error(' -', f);
  process.exit(1);
}
console.log(`Keyboard APG OK for Tabs across ${eras.join(', ')} (light).`);
