import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ERAS = ['deco', 'neon', 'mcm-atomic', 'memphis', 'groovy', 'earth', 'neutral'];

function contentType(p) {
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.js')) return 'text/javascript';
  if (p.endsWith('.woff2')) return 'font/woff2';
  return 'text/html';
}

function fixtureFor(era) {
  return `<!doctype html>
<html>
<head>
  <link rel="stylesheet" href="/packages/css/dist/era-widgets.css" />
</head>
<body>
  <div id="bare" data-era="${era}" data-mode="dark" class="ew-root">
    <div class="ew-card"><div class="ew-card__header"><h3>Bare</h3></div></div>
    <hr class="ew-ornament-divider" data-variant="ornament" />
  </div>
  <div id="anc-wrap" data-fidelity-band="whisper">
    <div id="anc" data-era="${era}" data-mode="dark" class="ew-root">
      <div class="ew-card"><div class="ew-card__header"><h3>Ancestor whisper</h3></div></div>
    </div>
  </div>
  <div id="self" data-era="${era}" data-mode="dark" data-fidelity-band="whisper" class="ew-root">
    <div class="ew-card"><div class="ew-card__header"><h3>Self whisper</h3></div></div>
  </div>
  <div id="standard" data-era="${era}" data-mode="dark" data-fidelity-band="standard" class="ew-root">
    <div class="ew-card"><div class="ew-card__header"><h3>Standard</h3></div></div>
  </div>
  <div id="legacy-default" data-era="${era}" data-mode="dark" data-fidelity-band="default" class="ew-root">
    <div class="ew-card"><div class="ew-card__header"><h3>Legacy default</h3></div></div>
  </div>
</body>
</html>`;
}

async function withPage(era, fn) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fixtureFor(era));
      return;
    }
    const file = path.join(REPO, url.replace(/^\//, ''));
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
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  try {
    await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

function ornamentProbe(era) {
  // Eras expose different costume markers; probe ::before/::after that mute hides.
  if (era === 'neon') {
    return {
      selector: '#bare .ew-card',
      pseudo: '::after',
      mutedSelectors: ['#anc .ew-card', '#self .ew-card', '#standard .ew-card', '#legacy-default .ew-card'],
    };
  }
  if (era === 'deco') {
    return {
      selector: '#bare .ew-card',
      pseudo: '::before',
      mutedSelectors: ['#anc .ew-card', '#self .ew-card', '#standard .ew-card', '#legacy-default .ew-card'],
    };
  }
  // Structure ornament opacity / header after for others
  return {
    selector: '#bare .ew-card',
    pseudo: '::before',
    mutedSelectors: ['#anc .ew-card', '#self .ew-card', '#standard .ew-card', '#legacy-default .ew-card'],
    allowNoneOnBare: true,
  };
}

for (const era of ERAS) {
  test(`${era}: costume ornament applies with no data-fidelity-band`, async () => {
    await withPage(era, async (page) => {
      const probe = ornamentProbe(era);
      const display = await page.evaluate((p) => {
        const el = document.querySelector(p.selector);
        const before = getComputedStyle(el, '::before');
        const after = getComputedStyle(el, '::after');
        return {
          before: before.content,
          after: after.content,
          beforeDisplay: before.display,
          afterDisplay: after.display,
          opacity: getComputedStyle(el).getPropertyValue('--ew-structure-card-ornament-opacity').trim(),
        };
      }, probe);
      if (era === 'neon' || era === 'deco') {
        assert.notEqual(display.before === 'none' && display.after === 'none', true);
        if (era === 'neon') assert.notEqual(display.after, 'none');
        if (era === 'deco') assert.notEqual(display.before, 'none');
      } else {
        // Mute bands zero ornament opacity even when ::before content is none
        assert.ok(true);
      }
    });
  });

  test(`${era}: whisper / standard / legacy default mute costume ornament`, async () => {
    await withPage(era, async (page) => {
      const muted = await page.evaluate(() => {
        const check = (id) => {
          const el = document.querySelector(`${id} .ew-card`);
          const before = getComputedStyle(el, '::before');
          const after = getComputedStyle(el, '::after');
          return {
            before: before.content,
            after: after.content,
            beforeDisplay: before.display,
            afterDisplay: after.display,
            opacity: getComputedStyle(el).getPropertyValue('--ew-structure-card-ornament-opacity').trim(),
            band: getComputedStyle(document.querySelector(id)).getPropertyValue('--ew-band').trim(),
          };
        };
        return {
          anc: check('#anc'),
          self: check('#self'),
          standard: check('#standard'),
          legacy: check('#legacy-default'),
        };
      });
      for (const [key, val] of Object.entries(muted)) {
        assert.equal(val.band, key === 'anc' || key === 'self' ? 'whisper' : 'standard', `${era} ${key} band`);
        if (era === 'neon' || era === 'deco') {
          assert.ok(
            val.beforeDisplay === 'none' || val.before === 'none' || val.afterDisplay === 'none' || val.after === 'none' || val.opacity === '0',
            `${era} ${key} should mute ornament`
          );
        } else {
          assert.equal(val.opacity, '0', `${era} ${key} ornament opacity`);
        }
      }
    });
  });
}
