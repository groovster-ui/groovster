import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(root, 'tests/react/.tmp');
const bundle = path.join(outDir, 'app.js');

test('react controls submit, toggle, and forward focus to native inputs', async () => {
  fs.mkdirSync(outDir, { recursive: true });
  await esbuild.build({
    entryPoints: [path.join(root, 'tests/react/browser-entry.js')],
    bundle: true,
    format: 'iife',
    outfile: bundle,
    define: { 'process.env.NODE_ENV': '"development"' },
    jsx: 'automatic',
  });
  const server = http.createServer((req, res) => {
    if (req.url === '/app.js') {
      res.writeHead(200, { 'content-type': 'text/javascript' });
      fs.createReadStream(bundle).pipe(res);
      return;
    }
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<!doctype html><div id="root"></div><script src="/app.js"></script><script>window.__render()</script>');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/`);
    const checkbox = page.locator('input.ew-checkbox__control').first();
    await checkbox.waitFor();
    const refTag = await page.evaluate(() => window.__refs.checkbox?.tagName);
    assert.equal(refTag, 'INPUT');
    await checkbox.focus();
    await page.keyboard.press(' ');
    assert.equal(await checkbox.isChecked(), true);
    const controlled = page.locator('input[name="controlled"]');
    await controlled.focus();
    await page.keyboard.press(' ');
    assert.equal(await page.locator('#state').textContent(), 'on');
    const sw = page.locator('input.ew-switch__control');
    await sw.focus();
    await page.keyboard.press(' ');
    assert.equal(await sw.getAttribute('aria-checked'), 'true');
    await page.locator('input[name="email"]').fill('');
    const submitted = await page.evaluate(() => {
      const form = document.getElementById('demo');
      const data = new FormData(form);
      return {
        agree: data.get('agree'),
        notes: data.get('notes'),
        plan: data.get('plan'),
        email: data.get('email'),
        bio: data.get('bio'),
        country: data.get('country'),
        vol: data.get('vol'),
        checkboxTag: document.querySelector('input.ew-checkbox__control').tagName,
      };
    });
    assert.equal(submitted.checkboxTag, 'INPUT');
    assert.equal(submitted.agree, 'yes');
    assert.equal(submitted.notes, 'on');
    assert.equal(submitted.plan, 'pro');
    assert.equal(submitted.bio, 'Hello');
    assert.equal(submitted.country, 'ca');
    assert.equal(submitted.vol, '40');
    assert.equal(submitted.email, '');
    const required = await page.locator('input[name="email"]').evaluate((el) => el.required);
    assert.equal(required, true);
    const disabled = page.locator('input[name="controlled"]');
    await disabled.evaluate((el) => {
      el.disabled = true;
    });
    assert.equal(await disabled.isDisabled(), true);
    assert.equal(await page.locator('#state').textContent(), 'on');
  } finally {
    await browser.close();
    server.close();
  }
});
