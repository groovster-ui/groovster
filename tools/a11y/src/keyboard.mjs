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
  const sid =
    era === 'mcm-atomic' ? 'atomic-light' : `${era}-light`;

  // --- Tabs ---
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

  // --- Select ---
  const select = root.locator(`[data-testid="select-${sid}"]`);
  const selectTrigger = select.locator('.ew-select__trigger');
  await selectTrigger.focus();
  await page.keyboard.press('ArrowDown');
  const expanded = await selectTrigger.getAttribute('aria-expanded');
  if (expanded !== 'true') failures.push(`${era}: select ArrowDown did not open listbox`);
  const opts = select.locator('[role="option"]');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  const closed = await selectTrigger.getAttribute('aria-expanded');
  if (closed !== 'false') failures.push(`${era}: select Enter did not close`);
  const nativeVal = await select.locator('select').inputValue();
  if (!nativeVal) failures.push(`${era}: select did not sync native value`);

  // --- Menu ---
  const menu = root.locator(`[data-testid="menu-${sid}"]`);
  const menuTrigger = menu.locator('.ew-menu__trigger');
  await menuTrigger.focus();
  await page.keyboard.press('ArrowDown');
  const menuOpen = await menuTrigger.getAttribute('aria-expanded');
  if (menuOpen !== 'true') failures.push(`${era}: menu ArrowDown did not open`);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  const menuClosed = await menuTrigger.getAttribute('aria-expanded');
  if (menuClosed !== 'false') failures.push(`${era}: menu Escape did not close`);

  // --- Popover ---
  const popover = root.locator(`[data-testid="popover-${sid}"]`);
  const popTrigger = popover.locator('.ew-popover__trigger');
  await popTrigger.focus();
  await page.keyboard.press('Enter');
  // Allow popover API / fallback to settle
  await page.waitForTimeout(50);
  const popExpanded = await popTrigger.getAttribute('aria-expanded');
  const panel = popover.locator('.ew-popover__panel');
  const panelOpen = await panel.evaluate((el) => {
    if (typeof el.matches === 'function' && el.matches(':popover-open')) return true;
    return el.hidden === false;
  });
  if (popExpanded !== 'true' && !panelOpen) {
    failures.push(`${era}: popover Enter did not open (aria-expanded=${popExpanded}, open=${panelOpen})`);
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(50);
  const popClosed = await popTrigger.getAttribute('aria-expanded');
  if (popClosed !== 'false') failures.push(`${era}: popover Escape did not set aria-expanded=false`);

  // --- Tooltip ---
  const tooltip = root.locator(`[data-testid="tooltip-${sid}"]`);
  const tipBtn = tooltip.locator('button');
  const tip = tooltip.locator('[role="tooltip"]');
  await tipBtn.focus();
  await page.waitForTimeout(350);
  const tipVisible = await tip.evaluate((el) => {
    if (typeof el.matches === 'function' && el.matches(':popover-open')) return true;
    return !el.hasAttribute('hidden');
  });
  if (!tipVisible) failures.push(`${era}: tooltip did not show on focus`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(50);
  const tipHidden = await tip.evaluate((el) => {
    if (typeof el.matches === 'function' && el.hasAttribute('popover')) {
      return !el.matches(':popover-open');
    }
    return el.hasAttribute('hidden');
  });
  if (!tipHidden) failures.push(`${era}: tooltip Escape did not hide`);

  // --- Slider ---
  const slider = root.locator(`[data-testid="slider-${sid}"]`);
  const range = slider.locator('input[type="range"]');
  await range.focus();
  const before = await range.inputValue();
  await page.keyboard.press('ArrowRight');
  const after = await range.inputValue();
  if (Number(after) <= Number(before)) failures.push(`${era}: slider ArrowRight did not increase value`);
  const ariaNow = await range.getAttribute('aria-valuenow');
  if (ariaNow !== after) failures.push(`${era}: slider aria-valuenow out of sync (${ariaNow} vs ${after})`);

  // --- Toast ---
  const toast = root.locator(`[data-testid="toast-${sid}"]`);
  await toast.evaluate((el) => el.show({ title: 'Saved', body: 'Keyboard check', timeout: 0 }));
  const status = toast.locator('[role="status"]');
  if ((await status.count()) < 1) failures.push(`${era}: toast.show did not insert status`);
  await toast.locator('.ew-icon-button').click();
  if ((await status.count()) !== 0) failures.push(`${era}: toast dismiss did not remove`);
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
console.log(
  `Keyboard APG OK for Tabs+Select+Menu+Popover+Tooltip+Slider+Toast across ${eras.join(', ')} (light).`
);
