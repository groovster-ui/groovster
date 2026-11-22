import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { safePath } from '../../../tests/helpers/safe-path.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const FIXTURE = path.join(REPO, 'tests/a11y/fixtures/matrix.html');

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  if (p.endsWith('.html')) return 'text/html';
  return 'application/octet-stream';
}

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file =
    url === '/' || url === '/matrix.html'
      ? FIXTURE
      : safePath(REPO, url.replace(/^\//, ''));
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(file) });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(`http://127.0.0.1:${port}/tests/a11y/fixtures/matrix.html`, { waitUntil: 'networkidle' });

const cases = await page.locator('[data-testid^="case-"]').all();
const report = { pass: true, cases: [] };

for (const loc of cases) {
  const testid = await loc.getAttribute('data-testid');
  const results = await new AxeBuilder({ page })
    .include(`[data-testid="${testid}"]`)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const violations = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.length,
    nodeDetails: v.nodes.map(n => ({
      html: n.html,
      failureSummary: n.failureSummary,
      target: n.target,
    })),
  }));
  const ok = violations.length === 0;
  if (!ok) report.pass = false;
  report.cases.push({ id: testid, pass: ok, violations });
}

await context.close();
await browser.close();
server.close();

const outDir = path.join(REPO, 'generated/a11y');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'axe-report.json'), JSON.stringify(report, null, 2) + '\n');

if (!report.pass) {
  console.error('axe failed:');
  for (const c of report.cases.filter((x) => !x.pass)) {
    console.error(`  ${c.id}:`, c.violations.map((v) => v.id).join(', '));
  }
  process.exit(1);
}
console.log(`axe OK: ${report.cases.length} cases (heroes × eras × modes).`);
