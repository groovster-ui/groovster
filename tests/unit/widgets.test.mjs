import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { expect } from '../../tools/a11y/node_modules/playwright/test.mjs';
import { safePath } from '../helpers/safe-path.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  return 'text/html';
}

const FIXTURE = `<!doctype html>
<html><body>
<link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
<script src="/packages/elements/dist/era-elements.js"></script>
<div data-era="neutral" data-mode="light" class="ew-root">
  <ew-tabs class="ew-tabs" id="tabs-a">
    <div role="tablist" aria-label="A">
      <button type="button" role="tab" aria-selected="true">One</button>
      <button type="button" role="tab" aria-selected="false" tabindex="-1">Two</button>
    </div>
    <div role="tabpanel">A1</div>
    <div role="tabpanel" hidden>A2</div>
  </ew-tabs>
  <ew-tabs class="ew-tabs" id="tabs-b">
    <div role="tablist" aria-label="B">
      <button type="button" role="tab" aria-selected="true">X</button>
      <button type="button" role="tab" aria-selected="false" tabindex="-1">Y</button>
    </div>
    <div role="tabpanel">B1</div>
    <div role="tabpanel" hidden>B2</div>
  </ew-tabs>
  <ew-select class="ew-select" id="sel">
    <label class="ew-select__label" for="c">Country</label>
    <select id="c" class="ew-select__control">
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="mx">Mexico</option>
    </select>
  </ew-select>
  <ew-menu class="ew-menu" id="menu">
    <button type="button" class="ew-button ew-menu__trigger" aria-haspopup="menu">Actions</button>
    <div class="ew-menu__panel" role="menu">
      <button type="button" class="ew-menu__item" role="menuitem">Edit</button>
      <button type="button" class="ew-menu__item" role="menuitem">Delete</button>
    </div>
  </ew-menu>
  <ew-popover class="ew-popover" id="pop">
    <button type="button" class="ew-button ew-popover__trigger" popovertarget="pop-p">Details</button>
    <div id="pop-p" class="ew-popover__panel" popover><p>Hi</p></div>
  </ew-popover>
  <ew-toast-region class="ew-toast-region" id="toast" aria-live="polite"></ew-toast-region>
</div>
</body></html>`;

async function withPage(fn) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(FIXTURE);
      return;
    }
    const file = safePath(REPO, url.replace(/^\//, ''));
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
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  try {
    await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

test('tabs generate unique ids across instances', async () => {
  await withPage(async (page) => {
    const ids = await page.evaluate(() => {
      const a = [...document.querySelectorAll('#tabs-a [role="tab"]')].map((t) => t.id);
      const b = [...document.querySelectorAll('#tabs-b [role="tab"]')].map((t) => t.id);
      return { a, b };
    });
    assert.equal(new Set([...ids.a, ...ids.b]).size, 4);
    assert.ok(ids.a.every(Boolean));
    assert.ok(ids.b.every(Boolean));
  });
});

test('select is combobox with aria-activedescendant and typeahead', async () => {
  await withPage(async (page) => {
    const trigger = page.locator('#sel .ew-select__trigger');
    await trigger.focus();
    assert.equal(await trigger.getAttribute('role'), 'combobox');
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('true');
    assert.ok(await trigger.getAttribute('aria-activedescendant'));
    await page.keyboard.type('c');
    await expect
      .poll(async () => {
        const active = await trigger.getAttribute('aria-activedescendant');
        if (!active) return '';
        return (await page.locator(`[id="${active}"]`).textContent()) || '';
      })
      .toMatch(/Canada/i);
    await page.keyboard.press('Enter');
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('false');
    assert.equal(await page.locator('#sel select').inputValue(), 'ca');
  });
});

test('select picks up native option mutations after setup', async () => {
  await withPage(async (page) => {
    const trigger = page.locator('#sel .ew-select__trigger');
    await expect.poll(async () => trigger.textContent()).toMatch(/United States/i);

    await page.evaluate(() => {
      const native = document.querySelector('#sel select');
      const us = native.querySelector('option[value="us"]');
      us.textContent = 'USA';
      const br = document.createElement('option');
      br.value = 'br';
      br.textContent = 'Brazil';
      native.appendChild(br);
      native.value = 'br';
      native.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await expect.poll(async () => trigger.textContent()).toMatch(/Brazil/i);
    await expect
      .poll(async () => page.locator('#sel [role="option"]').count())
      .toBe(4);
    await expect
      .poll(async () =>
        page.locator('#sel [role="option"][data-value="br"]').getAttribute('aria-selected')
      )
      .toBe('true');

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('true');
    const labels = await page.locator('#sel [role="option"]').allTextContents();
    assert.ok(labels.some((t) => /Brazil/i.test(t)));
    assert.ok(labels.some((t) => /USA/i.test(t)));
  });
});

test('select outside click does not restore focus to trigger', async () => {
  await withPage(async (page) => {
    const trigger = page.locator('#sel .ew-select__trigger');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('true');
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('false');
    const active = await page.evaluate(() => document.activeElement?.className || '');
    assert.ok(!String(active).includes('ew-select__trigger'));
  });
});

test('menu typeahead and outside click focus behavior', async () => {
  await withPage(async (page) => {
    const trigger = page.locator('#menu .ew-menu__trigger');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('true');
    await page.keyboard.type('d');
    await expect
      .poll(async () => page.evaluate(() => document.activeElement?.textContent?.trim()))
      .toBe('Delete');
    await page.locator('body').click({ position: { x: 1, y: 1 } });
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('false');
    const active = await page.evaluate(() => document.activeElement?.className || '');
    assert.ok(!String(active).includes('ew-menu__trigger'));
  });
});

test('popover toggle keeps aria-expanded in sync', async () => {
  await withPage(async (page) => {
    const trigger = page.locator('#pop .ew-popover__trigger');
    await trigger.click();
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('true');
    await page.keyboard.press('Escape');
    await expect.poll(async () => trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

test('toast uses status role and pauses timer on hover', async () => {
  await withPage(async (page) => {
    await page.evaluate(() => {
      document.getElementById('toast').show({ title: 'Saved', body: 'ok', timeout: 400 });
    });
    const toast = page.locator('#toast .ew-toast');
    await toast.waitFor({ state: 'attached' });
    const role = await toast.getAttribute('role');
    assert.equal(role, 'status');
    await toast.hover();
    // While hovered, toast must still be present after the original timeout would have fired.
    await expect
      .poll(async () => toast.count(), { timeout: 800 })
      .toBe(1);
    // Give the pause window time without flaking: assert still 1 after ~500ms via deadline poll.
    const stillThere = await page.waitForFunction(() => {
      const el = document.querySelector('#toast .ew-toast');
      if (!el) return false;
      const started = Number(el.dataset.hoverAssertAt || 0);
      if (!started) {
        el.dataset.hoverAssertAt = String(Date.now());
        return false;
      }
      return Date.now() - started >= 500;
    });
    assert.ok(stillThere);
    assert.equal(await toast.count(), 1);
    await page.mouse.move(0, 0);
    await expect.poll(async () => toast.count(), { timeout: 5000 }).toBe(0);
  });
});
