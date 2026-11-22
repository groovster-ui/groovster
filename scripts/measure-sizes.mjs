#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baselinePath = path.join(root, 'spec/budgets/size-baseline.json');
const check = process.argv.includes('--check');

function bytesOf(file) {
  const buf = fs.readFileSync(file);
  return {
    bytes: buf.length,
    gzip: zlib.gzipSync(buf).length,
    brotli: zlib.brotliCompressSync(buf).length,
  };
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

const files = [
  'packages/css/dist/era-widgets.css',
  'packages/css/dist/base.css',
  'packages/css/dist/button.css',
  'packages/css/dist/eras/deco.css',
  'packages/css/dist/eras/neutral.css',
  'packages/elements/dist/era-elements.js',
  'packages/elements/dist/ew-select.js',
];
const reactDist = path.join(root, 'packages/react/dist');
if (fs.existsSync(reactDist)) {
  for (const name of fs.readdirSync(reactDist)) {
    if (name.endsWith('.js')) files.push(rel(path.join(reactDist, name)));
  }
}
const fontDir = path.join(root, 'packages/css/dist/fonts');
if (fs.existsSync(fontDir)) {
  for (const name of fs.readdirSync(fontDir)) {
    if (name.endsWith('.woff2')) files.push(rel(path.join(fontDir, name)));
  }
}

const measured = {};
for (const file of files) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) continue;
  measured[file] = bytesOf(abs);
}

if (!fs.existsSync(baselinePath)) {
  fs.writeFileSync(baselinePath, JSON.stringify({ bundle: measured['packages/css/dist/era-widgets.css'] }, null, 2) + '\n');
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const current = measured['packages/css/dist/era-widgets.css'];
const limit = Math.ceil((baseline.bundle?.gzip || current.gzip) * 1.2);
const grew = current.gzip > limit;
console.log(JSON.stringify({ current, baseline: baseline.bundle, gzipLimit: limit, measured }, null, 2));
if (check && grew) {
  console.error(`era-widgets.css gzip ${current.gzip} exceeds 20% over baseline ${baseline.bundle.gzip}`);
  process.exit(1);
}
