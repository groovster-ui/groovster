/**
 * Published/distributable outputs must import nothing (static or dynamic).
 */
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './paths.js';
import { listFiles } from './io.js';

const CSS_IMPORT_RE = /@import\b/i;
const JS_IMPORT_RE =
  /\bimport\s*(?:[\s\w*{,}$]*\s*from\s*)?['"][^'"]+['"]|\bexport\s+[\s\w*{,}$]*\s*from\s*['"][^'"]+['"]|\brequire\s*\(\s*['"][^'"]+['"]\s*\)|\bimport\s*\(/;

function walkPublishedCss() {
  const root = path.join(REPO_ROOT, 'packages/css/dist');
  if (!fs.existsSync(root)) return [];
  return listFiles(root, (f) => f.endsWith('.css'));
}

function walkPublishedJs() {
  const out = [];
  const dist = path.join(REPO_ROOT, 'packages/elements/dist');
  if (fs.existsSync(dist)) {
    out.push(...listFiles(dist, (p) => /\.(m?js|cjs)$/.test(p)));
  }
  const elementsRoot = path.join(REPO_ROOT, 'packages/elements');
  if (fs.existsSync(elementsRoot)) {
    for (const base of ['index.js', 'elements.js', 'ew-tabs.js']) {
      const f = path.join(elementsRoot, base);
      if (fs.existsSync(f)) out.push(f);
    }
  }
  return [...new Set(out)];
}

export function checkNoImports() {
  const violations = [];

  for (const file of walkPublishedCss()) {
    const text = fs.readFileSync(file, 'utf8');
    if (CSS_IMPORT_RE.test(text)) {
      const hits = text
        .split('\n')
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => CSS_IMPORT_RE.test(line))
        .map((h) => `L${h.n}: ${h.line.trim()}`);
      violations.push({
        file: path.relative(REPO_ROOT, file),
        kind: 'css-at-import',
        hits,
      });
    }
  }

  for (const file of walkPublishedJs()) {
    const text = fs.readFileSync(file, 'utf8');
    if (JS_IMPORT_RE.test(text)) {
      const hits = text
        .split('\n')
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => JS_IMPORT_RE.test(line))
        .map((h) => `L${h.n}: ${h.line.trim()}`);
      violations.push({
        file: path.relative(REPO_ROOT, file),
        kind: 'js-module-import',
        hits,
      });
    }
  }

  return violations;
}
