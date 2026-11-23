import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMarkup } from '../../packages/mcp/src/validate.js';
import { loadEras } from '../../packages/mcp/src/load-spec.js';

test('unknown era — exact fix message', () => {
  const out = validateMarkup('<div/>', 'nope', { detail: 'full' });
  assert.equal(out.pass, false);
  const change = `change era to one of: ${loadEras().map((era) => era.id).join(', ')}`;
  assert.ok(out.fixes.includes(change), `fixes missing: ${change}`);
  assert.ok(out.issues.some((i) => i.change === change));
});

test('missing data-era — exact fix message', () => {
  const out = validateMarkup('<div><button type="button" class="ew-button">x</button></div>', 'deco', {
    detail: 'full',
  });
  assert.equal(out.pass, false);
  const change = 'change wrapping element to include data-era="deco" (keep ew-* classes unchanged)';
  assert.ok(out.fixes.includes(change), `fixes missing: ${change}`);
  assert.ok(out.issues.some((i) => i.change === change));
});

test('div role=button — exact fix message', () => {
  const out = validateMarkup(
    '<div data-era="neutral"><div role="button" class="ew-button">Go</div></div>',
    'neutral',
    { detail: 'full' }
  );
  assert.equal(out.pass, false);
  const change = 'change element to <button type="button" class="ew-button">';
  assert.ok(out.fixes.includes(change), `fixes missing: ${change}`);
  assert.ok(out.issues.some((i) => i.change === change));
});

test('dialog not on <dialog> — exact fix message', () => {
  const out = validateMarkup('<div data-era="neutral" class="ew-dialog">Hi</div>', 'neutral', {
    detail: 'full',
  });
  assert.equal(out.pass, false);
  const change = 'change root to <dialog class="ew-dialog">';
  assert.ok(out.fixes.includes(change), `fixes missing: ${change}`);
  assert.ok(out.issues.some((i) => i.change === change));
});

test('unknown ew-* classes — exact fix message', () => {
  const out = validateMarkup('<div data-era="neutral" class="ew-foobar">x</div>', 'neutral', {
    detail: 'full',
  });
  assert.equal(out.pass, false);
  const prefix = 'change ew-foobar to one of:';
  const match = out.fixes.find((f) => f.startsWith(prefix));
  assert.ok(match, `expected fix starting with ${prefix}`);
  assert.match(match, /ew-button/);
  assert.ok(out.issues.some((i) => i.change === match));
});

test('unlabeled text field — exact fix message', () => {
  const out = validateMarkup(
    '<div data-era="neutral" class="ew-text-field"><input class="ew-text-field__control" /></div>',
    'neutral',
    { detail: 'full' }
  );
  assert.equal(out.pass, false);
  const change = 'change markup to include <label class="ew-text-field__label" for="…">';
  assert.ok(out.fixes.includes(change), `fixes missing: ${change}`);
  assert.ok(out.issues.some((i) => i.change === change));
});

test('valid markup returns no issues', () => {
  const out = validateMarkup(
    '<div data-era="deco"><button type="button" class="ew-button">Save</button></div>',
    'deco',
    { detail: 'full' }
  );
  assert.equal(out.pass, true);
  assert.deepEqual(out.fixes, []);
  assert.equal(out.issues?.length ?? 0, 0);
});
