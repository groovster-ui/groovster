import test from 'node:test';
import assert from 'node:assert/strict';
import {
  flattenTokens,
  resolveTokenRefs,
  collectTokenValues,
  resolveValueAgainst,
} from '../../tools/gen/src/tokens-to-css.js';

test('resolveTokenRefs rewrites DTCG aliases to CSS vars', () => {
  assert.equal(resolveTokenRefs('{color.ink}'), 'var(--ew-color-ink)');
  assert.equal(
    resolveTokenRefs('color-mix(in oklch, {color.gray.8} 45%, transparent)'),
    'color-mix(in oklch, var(--ew-color-gray-8) 45%, transparent)'
  );
});

test('flattenTokens emits referenced CSS custom properties', () => {
  const css = flattenTokens({
    color: {
      fg: { default: { $type: 'color', $value: '{color.ink}' } },
    },
  });
  assert.ok(css.some((l) => l.includes('--ew-color-fg-default: var(--ew-color-ink)')));
});

test('resolveValueAgainst follows tier-1 literals', () => {
  const map = collectTokenValues({
    color: { ink: { $type: 'color', $value: 'oklch(20% 0.02 80)' } },
  });
  assert.equal(resolveValueAgainst(map, '{color.ink}'), 'oklch(20% 0.02 80)');
});
