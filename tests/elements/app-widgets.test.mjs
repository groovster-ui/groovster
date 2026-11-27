import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(root, url.replace(/^\//, ''));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end('missing');
      return;
    }
    const type = file.endsWith('.js') ? 'text/javascript' : 'text/html';
    res.writeHead(200, { 'content-type': type });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

test('search, segmented, chip, code, shelf, and pagination behave', async () => {
  const server = await serve();
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/tests/elements/fixtures/app-widgets.html`);
    await page.waitForFunction(() => customElements.get('ew-search') && customElements.get('ew-pagination'));

    const search = await page.evaluate(() => {
      const host = document.querySelector('ew-search');
      const input = host.querySelector('input');
      const clear = host.querySelector('.ew-search__clear');
      let inputs = 0;
      input.addEventListener('input', () => { inputs += 1; });
      const hiddenWhenEmpty = clear.hidden;
      input.value = 'lamp';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const shown = clear.hidden === false;
      clear.click();
      return {
        hiddenWhenEmpty,
        shown,
        value: input.value,
        inputs,
        focused: document.activeElement === input,
        hiddenAgain: clear.hidden,
      };
    });
    assert.equal(search.hiddenWhenEmpty, true);
    assert.equal(search.shown, true);
    assert.equal(search.value, '');
    assert.equal(search.inputs, 2);
    assert.equal(search.focused, true);
    assert.equal(search.hiddenAgain, true);

    const segmented = await page.evaluate(() => {
      const host = document.querySelector('ew-segmented');
      const items = [...host.querySelectorAll('[role="radio"]')];
      items[0].focus();
      host.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      const checked = items.map((item) => item.getAttribute('aria-checked'));
      const tabs = items.map((item) => item.tabIndex);
      return { checked, tabs, role: host.getAttribute('role') };
    });
    assert.equal(segmented.role, 'radiogroup');
    assert.deepEqual(segmented.checked, ['false', 'true', 'false']);
    assert.deepEqual(segmented.tabs, [-1, 0, -1]);

    const chip = await page.evaluate(() => {
      const host = document.querySelector('ew-chip');
      let removed = 0;
      host.addEventListener('ew-chip-remove', () => { removed += 1; });
      host.click();
      const pressed = host.getAttribute('aria-pressed');
      host.querySelector('.ew-chip__remove').click();
      return { pressed, removed, gone: document.querySelector('ew-chip') === null };
    });
    assert.equal(chip.pressed, 'true');
    assert.equal(chip.removed, 1);
    assert.equal(chip.gone, true);

    const code = await page.evaluate(async () => {
      let copied = '';
      navigator.clipboard.writeText = async (text) => { copied = text; };
      const host = document.querySelector('ew-code');
      host.querySelector('.ew-code__copy').click();
      await new Promise((resolve) => setTimeout(resolve, 20));
      return { copied, flag: host.querySelector('.ew-code__copy').dataset.copied };
    });
    assert.equal(code.copied, 'print(1)');
    assert.equal(code.flag, 'true');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    const shelf = await page.evaluate(() => {
      const host = document.querySelector('ew-shelf');
      const row = host.querySelector('.ew-shelf__row');
      const before = row.scrollLeft;
      host.querySelector('[data-shelf="next"]').click();
      return new Promise((resolve) => {
        requestAnimationFrame(() => resolve({ before, after: row.scrollLeft }));
      });
    });
    assert.ok(shelf.after > shelf.before);

    const pages = await page.evaluate(() => {
      const host = document.querySelector('ew-pagination');
      let changes = 0;
      host.addEventListener('change', () => { changes += 1; });
      host.querySelectorAll('.ew-pagination__page')[2].click();
      const current = [...host.querySelectorAll('.ew-pagination__page')].map((item) => item.getAttribute('aria-current'));
      host.querySelector('.ew-pagination__next').click();
      const afterNext = [...host.querySelectorAll('.ew-pagination__page')].map((item) => item.getAttribute('aria-current'));
      return { changes, current, afterNext, role: host.getAttribute('role') };
    });
    assert.equal(pages.role, 'navigation');
    assert.equal(pages.changes, 1);
    assert.deepEqual(pages.current, [null, null, 'page', null]);
    assert.deepEqual(pages.afterNext, [null, null, 'page', null]);
  } finally {
    await browser.close();
    server.close();
  }
});
