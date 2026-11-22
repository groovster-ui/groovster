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

test('select and slider survive updates and remounts without duplicate events', async () => {
  const server = await serve();
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/tests/elements/fixtures/lifecycle.html`);
    await page.waitForFunction(() => customElements.get('ew-select') && customElements.get('ew-slider'));

    const selectProbe = await page.evaluate(async () => {
      const host = document.querySelector('#select-host');
      const widget = host.querySelector('ew-select');
      let changes = 0;
      widget.addEventListener('change', () => {
        changes += 1;
      });
      widget.querySelector('select').value = 'ca';
      const afterValue = widget.querySelector('.ew-select__value')?.textContent;
      const option = document.createElement('option');
      option.value = 'mx';
      option.textContent = 'Mexico';
      widget.querySelector('select').append(option);
      await new Promise((resolve) => setTimeout(resolve, 20));
      const optionCount = widget.querySelectorAll('[role="option"]').length;
      const parent = widget.parentElement;
      const next = widget.nextSibling;
      widget.remove();
      parent.insertBefore(widget, next);
      widget.querySelector('.ew-select__trigger').click();
      widget.querySelector('[data-value="us"]')?.click();
      return { afterValue, optionCount, changes, open: widget.querySelector('.ew-select__trigger')?.getAttribute('aria-expanded') };
    });
    assert.equal(selectProbe.afterValue, 'Canada');
    assert.equal(selectProbe.optionCount, 3);
    assert.equal(selectProbe.changes, 1);
    assert.equal(selectProbe.open, 'false');

    const sliderProbe = await page.evaluate(() => {
      const widget = document.querySelector('ew-slider');
      const input = widget.querySelector('input');
      let events = 0;
      input.addEventListener('input', () => {
        events += 1;
      });
      input.value = '70';
      const after = widget.querySelector('output')?.textContent;
      input.max = '80';
      const max = input.getAttribute('aria-valuemax');
      const parent = widget.parentElement;
      widget.remove();
      parent.append(widget);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return { after, max, events, listeners: events };
    });
    assert.equal(sliderProbe.after, '70');
    assert.equal(sliderProbe.max, '80');
    assert.equal(sliderProbe.events, 2);
  } finally {
    await browser.close();
    server.close();
  }
});

test('tabs, menu, popover, and tooltip reconnect without stacking listeners', async () => {
  const server = await serve();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const { port } = server.address();
    await page.goto(`http://127.0.0.1:${port}/tests/elements/fixtures/lifecycle.html`);
    const result = await page.evaluate(() => {
      function remount(selector) {
        const el = document.querySelector(selector);
        const parent = el.parentElement;
        const next = el.nextSibling;
        el.remove();
        parent.insertBefore(el, next);
        return el;
      }
      const tabs = remount('ew-tabs');
      let tabChanges = 0;
      tabs.addEventListener('ew-tabs-change', () => {
        tabChanges += 1;
      });
      tabs.querySelector('[role="tab"]:last-child').click();
      const menu = remount('ew-menu');
      menu.querySelector('.ew-menu__trigger').click();
      const menuOpen = menu.querySelector('.ew-menu__trigger').getAttribute('aria-expanded');
      const pop = remount('ew-popover');
      pop.querySelector('.ew-popover__trigger').click();
      const tip = remount('ew-tooltip');
      return {
        tabChanges,
        selected: tabs.querySelector('[aria-selected="true"]').textContent,
        menuOpen,
        popExpanded: pop.querySelector('.ew-popover__trigger').getAttribute('aria-expanded'),
        tipDescribed: tip.querySelector('button').getAttribute('aria-describedby')?.includes('tip-1'),
      };
    });
    assert.equal(result.selected, 'Pro');
    assert.equal(result.tabChanges, 1);
    assert.equal(result.menuOpen, 'true');
    assert.equal(result.popExpanded, 'true');
    assert.equal(result.tipDescribed, true);
  } finally {
    await browser.close();
    server.close();
  }
});
