import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const css = fs.readFileSync(new URL('../../packages/css/dist/eras/swiss.css', import.meta.url), 'utf8');

test('swiss section size is not applied to every h2', () => {
  assert.match(css, /\[data-era="swiss"] \.ew-section-heading\{[^}]*clamp\(2\.8rem/);
  assert.doesNotMatch(css, /\[data-era="swiss"] h2,/);
  assert.doesNotMatch(css, /\[data-era="swiss"] h2\{/);
});
