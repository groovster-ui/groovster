import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { expect } from 'playwright/test';
import { safePath } from '../../../tests/helpers/safe-path.mjs';
import { listEraIds } from '../../../tools/gen/src/era-catalog.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const FIXTURE = path.join(REPO, 'tests/a11y/fixtures/matrix.html');

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  return 'text/html';
}

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file =
    url === '/' || url === '/matrix.html'
      ? FIXTURE
      : safePath(REPO, url.replace(/^\//, ''));
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
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
const eras = listEraIds(REPO);
const modes = ['light', 'dark'];

function caseId(era, mode) {
  return `case-${era}-${mode}`;
}

function widgetSid(era, mode) {
  return era === 'mcm-atomic' ? `atomic-${mode}` : `${era}-${mode}`;
}

async function isPanelOpen(locator) {
  return locator.evaluate((el) => {
    if (typeof el.matches === 'function' && el.hasAttribute('popover')) {
      return el.matches(':popover-open');
    }
    return el.hidden === false;
  });
}

async function isTipVisible(locator) {
  return locator.evaluate((el) => {
    if (typeof el.matches === 'function' && el.matches(':popover-open')) return true;
    if (el.dataset?.ewOpen === 'true') return true;
    return !el.hasAttribute('hidden');
  });
}

async function isTipHidden(locator) {
  return locator.evaluate((el) => {
    if (typeof el.matches === 'function' && el.hasAttribute('popover')) {
      return !el.matches(':popover-open');
    }
    if (el.dataset?.ewOpen != null) return el.dataset.ewOpen !== 'true';
    return el.hasAttribute('hidden');
  });
}

for (const era of eras) {
  for (const mode of modes) {
    const label = `${era}/${mode}`;
    const root = page.locator(`[data-testid="${caseId(era, mode)}"]`);
    await root.scrollIntoViewIfNeeded();
    const sid = widgetSid(era, mode);

    // --- Tabs ---
    const tab1 = root.locator('[role="tab"]').nth(0);
    const tab2 = root.locator('[role="tab"]').nth(1);
    await tab1.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => tab2.getAttribute('aria-selected')).toBe('true');
    const selected = await tab2.getAttribute('aria-selected');
    const tabIndex = await tab2.getAttribute('tabindex');
    if (selected !== 'true' || tabIndex !== '0') {
      failures.push(
        `${label}: ArrowRight did not select second tab (selected=${selected}, tabindex=${tabIndex})`
      );
    }
    const hidden = await root
      .locator('[role="tabpanel"]')
      .nth(1)
      .evaluate((el) => el.hasAttribute('hidden'));
    if (hidden) failures.push(`${label}: second panel still hidden after ArrowRight`);

    await page.keyboard.press('Home');
    await expect.poll(async () => tab1.getAttribute('aria-selected')).toBe('true');
    const back = await tab1.getAttribute('aria-selected');
    if (back !== 'true') failures.push(`${label}: Home did not return to first tab`);

    await page.keyboard.press('End');
    await expect.poll(async () => tab2.getAttribute('aria-selected')).toBe('true');
    const endSel = await tab2.getAttribute('aria-selected');
    if (endSel !== 'true') failures.push(`${label}: End did not select last tab`);

    // --- Select ---
    const select = root.locator(`[data-testid="select-${sid}"]`);
    const selectTrigger = select.locator('.ew-select__trigger');
    const listbox = select.locator('[role="listbox"]');
    await selectTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => selectTrigger.getAttribute('aria-expanded')).toBe('true');
    await listbox.waitFor({ state: 'visible' });
    await expect
      .poll(async () => selectTrigger.getAttribute('aria-activedescendant'))
      .toBeTruthy();
    const expanded = await selectTrigger.getAttribute('aria-expanded');
    if (expanded !== 'true') failures.push(`${label}: select ArrowDown did not open listbox`);

    await page.keyboard.press('ArrowDown');
    await expect
      .poll(async () => {
        const id = await selectTrigger.getAttribute('aria-activedescendant');
        if (!id) return '';
        return (await select.locator(`[id="${id}"]`).getAttribute('data-value')) || '';
      })
      .toBe('ca');
    await page.keyboard.press('Enter');
    await expect.poll(async () => selectTrigger.getAttribute('aria-expanded')).toBe('false');
    const closed = await selectTrigger.getAttribute('aria-expanded');
    if (closed !== 'false') failures.push(`${label}: select Enter did not close`);
    const nativeVal = await select.locator('select').inputValue();
    if (nativeVal !== 'ca') {
      failures.push(`${label}: select native value expected 'ca', got '${nativeVal}'`);
    }

    // --- Menu ---
    const menu = root.locator(`[data-testid="menu-${sid}"]`);
    const menuTrigger = menu.locator('.ew-menu__trigger');
    await menuTrigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => menuTrigger.getAttribute('aria-expanded')).toBe('true');
    const menuOpen = await menuTrigger.getAttribute('aria-expanded');
    if (menuOpen !== 'true') failures.push(`${label}: menu ArrowDown did not open`);

    await expect
      .poll(async () =>
        page.evaluate(() => document.activeElement?.getAttribute('role') === 'menuitem')
      )
      .toBe(true);
    const firstFocused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (firstFocused !== 'Edit') {
      failures.push(`${label}: menu open did not focus first item (focused=${firstFocused})`);
    }

    // Wrap: last → ArrowDown → first
    await page.keyboard.press('End');
    await expect
      .poll(async () => page.evaluate(() => document.activeElement?.textContent?.trim()))
      .toBe('Delete');
    await page.keyboard.press('ArrowDown');
    await expect
      .poll(async () => page.evaluate(() => document.activeElement?.textContent?.trim()))
      .toBe('Edit');
    const wrappedDown = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (wrappedDown !== 'Edit') {
      failures.push(`${label}: menu ArrowDown from last did not wrap to first`);
    }

    // Wrap: first → ArrowUp → last
    await page.keyboard.press('ArrowUp');
    await expect
      .poll(async () => page.evaluate(() => document.activeElement?.textContent?.trim()))
      .toBe('Delete');
    const wrappedUp = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (wrappedUp !== 'Delete') {
      failures.push(`${label}: menu ArrowUp from first did not wrap to last`);
    }

    await page.keyboard.press('Escape');
    await expect.poll(async () => menuTrigger.getAttribute('aria-expanded')).toBe('false');
    const menuClosed = await menuTrigger.getAttribute('aria-expanded');
    if (menuClosed !== 'false') failures.push(`${label}: menu Escape did not close`);
    await expect
      .poll(async () =>
        page.evaluate(
          (sel) => document.activeElement?.closest(sel) != null,
          `[data-testid="menu-${sid}"] .ew-menu__trigger`
        )
      )
      .toBe(true);
    const focusBack = await page.evaluate(
      (sel) => document.activeElement?.closest(sel) != null,
      `[data-testid="menu-${sid}"] .ew-menu__trigger`
    );
    if (!focusBack) failures.push(`${label}: menu Escape did not restore focus to trigger`);

    // --- Popover ---
    const popover = root.locator(`[data-testid="popover-${sid}"]`);
    const popTrigger = popover.locator('.ew-popover__trigger');
    const panel = popover.locator('.ew-popover__panel');
    await popTrigger.focus();
    await page.keyboard.press('Enter');
    await expect.poll(async () => popTrigger.getAttribute('aria-expanded')).toBe('true');
    await expect.poll(async () => isPanelOpen(panel)).toBe(true);
    const popExpanded = await popTrigger.getAttribute('aria-expanded');
    const panelOpen = await isPanelOpen(panel);
    // Strict: BOTH must be true when open (no OR).
    if (popExpanded !== 'true' || !panelOpen) {
      failures.push(
        `${label}: popover Enter did not open (aria-expanded=${popExpanded}, open=${panelOpen})`
      );
    }
    await page.keyboard.press('Escape');
    await expect.poll(async () => popTrigger.getAttribute('aria-expanded')).toBe('false');
    await expect.poll(async () => isPanelOpen(panel)).toBe(false);
    const popClosed = await popTrigger.getAttribute('aria-expanded');
    const panelClosed = !(await isPanelOpen(panel));
    if (popClosed !== 'false' || !panelClosed) {
      failures.push(
        `${label}: popover Escape did not fully close (aria-expanded=${popClosed}, closed=${panelClosed})`
      );
    }

    // --- Tooltip ---
    const tooltip = root.locator(`[data-testid="tooltip-${sid}"]`);
    const tipBtn = tooltip.locator('button');
    const tip = tooltip.locator('[role="tooltip"]');
    await tipBtn.focus();
    await expect.poll(async () => isTipVisible(tip), { timeout: 5000 }).toBe(true);
    const tipVisible = await isTipVisible(tip);
    if (!tipVisible) failures.push(`${label}: tooltip did not show on focus`);
    await page.keyboard.press('Escape');
    await expect.poll(async () => isTipHidden(tip)).toBe(true);
    const tipHidden = await isTipHidden(tip);
    if (!tipHidden) failures.push(`${label}: tooltip Escape did not hide`);

    // --- Slider ---
    const slider = root.locator(`[data-testid="slider-${sid}"]`);
    const range = slider.locator('input[type="range"]');
    await range.focus();
    const before = await range.inputValue();
    await page.keyboard.press('ArrowRight');
    await expect.poll(async () => Number(await range.inputValue())).toBeGreaterThan(Number(before));
    const after = await range.inputValue();
    if (Number(after) <= Number(before)) {
      failures.push(`${label}: slider ArrowRight did not increase value`);
    }
    const ariaNow = await range.getAttribute('aria-valuenow');
    if (ariaNow !== after) {
      failures.push(`${label}: slider aria-valuenow out of sync (${ariaNow} vs ${after})`);
    }

    // --- Toast ---
    const toast = root.locator(`[data-testid="toast-${sid}"]`);
    await toast.evaluate((el) => el.show({ title: 'Saved', body: 'Keyboard check', timeout: 0 }));
    const status = toast.locator('[role="status"]');
    await status.first().waitFor({ state: 'attached' });
    if ((await status.count()) < 1) failures.push(`${label}: toast.show did not insert status`);
    await toast.locator('.ew-icon-button').click();
    await expect.poll(async () => status.count()).toBe(0);
    if ((await status.count()) !== 0) failures.push(`${label}: toast dismiss did not remove`);
  }
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
  `Keyboard APG OK for Tabs+Select+Menu+Popover+Tooltip+Slider+Toast across ${eras.join(', ')} × ${modes.join(', ')}.`
);
