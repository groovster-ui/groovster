import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const density = fs.readFileSync(path.join(root, 'packages/css/dist/density.css'), 'utf8');
const base = fs.readFileSync(path.join(root, 'packages/css/dist/base.css'), 'utf8');
const deco = fs.readFileSync(path.join(root, 'packages/css/dist/eras/deco.css'), 'utf8');

test('truncate utilities live in the overrides layer', () => {
  const overrides = base.slice(base.indexOf('@layer overrides'));
  assert.match(overrides, /\.ew-truncate/);
  assert.match(overrides, /\.ew-clamp-2/);
  assert.match(overrides, /\.ew-clamp-3/);
  assert.match(overrides, /\.ew-card__title--truncate/);
});

test('control face and card titles are scoped to compact and app contexts', () => {
  assert.match(density, /\[data-density="compact"\] :is\(\.ew-button/);
  assert.match(density, /\.ew-app :is\(\.ew-button/);
  assert.equal(density.includes('[data-era] :is(.ew-button, .ew-icon-button'), false);
  assert.match(density, /\[data-density="compact"\] :is\(\.ew-dialog, \.ew-card/);
});

test('marketing deco buttons keep a display face outside compact density', () => {
  assert.match(deco, /\[data-era="deco"\] \.ew-button[\s\S]*font-family:\s*var\(--ew-font-display\)/);
});

test('compact card padding is a token', () => {
  assert.match(density, /--ew-card-pad:\s*10px/);
  assert.match(deco, /padding:\s*var\(--ew-card-pad, 22px\)/);
});
