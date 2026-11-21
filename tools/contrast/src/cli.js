#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const ERAS = ['neutral', 'deco', 'mcm-atomic', 'neon'];

function lightness(str) {
  const m = String(str).match(/oklch\(\s*([\d.]+)\s*%/i);
  if (!m) return null;
  return Number(m[1]) / 100;
}

function contrastRatio(l1, l2) {
  const toY = (l) => Math.pow(Math.max(0, Math.min(1, l)), 2.2);
  const a = toY(l1);
  const b = toY(l2);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function colorValue(node) {
  return node?.$value ?? null;
}

function checkEra(era) {
  const t2 = JSON.parse(
    fs.readFileSync(path.join(REPO, 'spec/tokens/tier2', `${era}.shared.tokens.json`), 'utf8')
  );
  const c = t2.color;
  const pairs = [
    ['fg/default on bg/page', colorValue(c.fg.default), colorValue(c.bg.page), 4.5],
    ['fg/default on bg/surface', colorValue(c.fg.default), colorValue(c.bg.surface), 4.5],
    ['fg/default on bg/elevated', colorValue(c.fg.default), colorValue(c.bg.elevated), 4.5],
    ['action/fg on action/bg', colorValue(c.action.fg), colorValue(c.action.bg), 4.5],
    ['danger/fg on danger/bg', colorValue(c.danger.fg), colorValue(c.danger.bg), 4.5],
    ['fg/muted on bg/page', colorValue(c.fg.muted), colorValue(c.bg.page), 3],
  ];
  const issues = [];
  for (const [label, fg, bg, need] of pairs) {
    const lf = lightness(fg);
    const lb = lightness(bg);
    if (lf == null || lb == null) {
      issues.push({ label, error: `unparseable fg=${fg} bg=${bg}` });
      continue;
    }
    const ratio = contrastRatio(lf, lb);
    if (ratio < need) {
      issues.push({ label, ratio: Number(ratio.toFixed(2)), need, fg, bg });
    }
  }
  return issues;
}

const report = { eras: {}, pass: true, note: 'Glow ignored; flat OKLCH fills only.' };
for (const era of ERAS) {
  const issues = checkEra(era);
  report.eras[era] = { pass: issues.length === 0, issues };
  if (issues.length) report.pass = false;
}
const outDir = path.join(REPO, 'generated/contrast');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
if (!report.pass) {
  console.error('Contrast CI failed (AA without glow):');
  for (const [era, r] of Object.entries(report.eras)) {
    if (!r.pass) {
      console.error(`  ${era}:`);
      for (const i of r.issues) console.error(`    - ${i.label}: ${i.ratio ?? i.error} (need ${i.need})`);
    }
  }
  process.exit(1);
}
console.log(`Contrast CI OK for ${ERAS.join(', ')} (AA, glow ignored).`);
