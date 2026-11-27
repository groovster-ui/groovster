#!/usr/bin/env node
/**
 * Bundle packages/elements/src/*.js → dist/*.js and dist/era-elements.js
 * Published files must contain no import/require/export-from (CI no-imports).
 *
 * Optional out root (for gen:check temp trees):
 *   GROOVSTER_OUT_ROOT=/tmp/foo  or  --out-root=/tmp/foo
 * Src always reads from the real repo; dist writes under outRoot/packages/elements/dist.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function resolveOutRoot() {
  const arg = process.argv.find((a) => a.startsWith('--out-root='));
  if (arg) return path.resolve(arg.slice('--out-root='.length));
  if (process.env.GROOVSTER_OUT_ROOT) return path.resolve(process.env.GROOVSTER_OUT_ROOT);
  return repoRoot;
}

const outRoot = resolveOutRoot();
const srcDir = path.join(repoRoot, 'packages/elements/src');
const distDir = path.join(outRoot, 'packages/elements/dist');

const ORDER = [
  'ew-tabs.js',
  'ew-select.js',
  'ew-menu.js',
  'ew-popover.js',
  'ew-tooltip.js',
  'ew-toast.js',
  'ew-slider.js',
  'ew-search.js',
  'ew-segmented.js',
  'ew-chip.js',
  'ew-code.js',
  'ew-shelf.js',
  'ew-pagination.js',
];

const IMPORT_RE =
  /\bimport\s*(?:[\s\w*{,}$]*\s*from\s*)?['"][^'"]+['"]|\bexport\s+[\s\w*{,}$]*\s*from\s*['"][^'"]+['"]|\brequire\s*\(\s*['"][^'"]+['"]\s*\)/;

fs.mkdirSync(distDir, { recursive: true });

const banner = (name) =>
  `/* ${name} — Era Widgets light-DOM WC. Generated/copied by scripts/bundle-elements.mjs. Must import nothing. */\n`;

const parts = [];
for (const file of ORDER) {
  const src = path.join(srcDir, file);
  if (!fs.existsSync(src)) {
    console.error('missing', src);
    process.exit(1);
  }
  let code = fs.readFileSync(src, 'utf8');
  if (IMPORT_RE.test(code)) {
    console.error(`Source ${file} contains module imports — forbidden for publish path`);
    process.exit(1);
  }
  const out = banner(file) + code.trim() + '\n';
  fs.writeFileSync(path.join(distDir, file), out);
  parts.push(`\n/* ---- ${file} ---- */\n` + code.trim() + '\n');
  console.log('wrote dist/' + file);
}

const bundle =
  banner('era-elements.js') +
  '/* Bundle of Tabs, Select, Menu, Popover, Tooltip, Toast, Slider, Search, Segmented, Chip, Code, Shelf, Pagination. Zag.js not used. */\n' +
  parts.join('\n');
if (IMPORT_RE.test(bundle)) {
  console.error('Bundle unexpectedly contains imports');
  process.exit(1);
}
fs.writeFileSync(path.join(distDir, 'era-elements.js'), bundle);
console.log('wrote dist/era-elements.js', bundle.length, 'bytes');
