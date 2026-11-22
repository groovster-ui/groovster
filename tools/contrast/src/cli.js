#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  collectTokenValues,
  resolveValueAgainst,
} from '../../gen/src/tokens-to-css.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const ERAS = ['neutral', 'deco', 'mcm-atomic', 'neon', 'memphis', 'groovy', 'earth'];
const MODES = ['light', 'dark'];

/** Parse `oklch(L% C H[/A])` → { L 0–1, C, H, A }. */
function parseOklch(str) {
  const m = String(str).match(
    /oklch\(\s*([\d.]+)\s*%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i
  );
  if (!m) return null;
  let L = Number(m[1]);
  if (L > 1) L = L / 100; // percent form
  const C = Number(m[2]);
  const H = Number(m[3]);
  let A = 1;
  if (m[4] != null) {
    A = String(m[4]).endsWith('%') ? Number(m[4]) / 100 : Number(m[4]);
  }
  return { L, C, H, A };
}

function oklchToLinearSrgb({ L, C, H }) {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return {
    r: +4.0767416621 * l - 3.3077126679 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function parseHex(str) {
  const m = String(str).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function srgbChannelToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance from an OKLCH or hex color string. */
function relativeLuminance(colorStr) {
  const hex = parseHex(colorStr);
  if (hex) {
    const r = srgbChannelToLinear(hex.r);
    const g = srgbChannelToLinear(hex.g);
    const b = srgbChannelToLinear(hex.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const parsed = parseOklch(colorStr);
  if (!parsed) return null;
  // OKLab matrix yields linear sRGB; clamp and apply WCAG Y coefficients.
  const { r, g, b } = oklchToLinearSrgb(parsed);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  return 0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(b);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function colorValue(node) {
  return node?.$value ?? null;
}

const COLOR_TOKEN = String.raw`(?:oklch\([^)]+\)|#[0-9a-fA-F]{3,8})`;

/** Resolve a semantic color that may be a `{ref}` or color-mix of refs. */
function resolveSemanticColor(map, raw) {
  if (raw == null) return null;
  const resolved = resolveValueAgainst(map, raw);
  if (typeof resolved !== 'string') return null;
  const trimmed = resolved.trim();
  // Pure OKLCH or hex after alias resolve
  if (/^oklch\(/i.test(trimmed) || parseHex(trimmed)) return trimmed;
  // color-mix(in oklch, COLOR p%, transparent|COLOR [q%]) — COLOR may be oklch or hex
  const mix = trimmed.match(
    new RegExp(
      String.raw`color-mix\(\s*in\s+oklch\s*,\s*(${COLOR_TOKEN})\s+([\d.]+)%\s*,\s*(transparent|${COLOR_TOKEN})(?:\s+([\d.]+)%)?\s*\)`,
      'i'
    )
  );
  if (mix) {
    const pct = Number(mix[2]) / 100;
    const otherPct = mix[4] != null ? Number(mix[4]) / 100 : 1 - pct;
    const w1 = pct;
    const w2 = otherPct;
    const baseHex = parseHex(mix[1]);
    if (baseHex && mix[3] === 'transparent') {
      return mix[1];
    }
    const otherHex = mix[3] === 'transparent' ? null : parseHex(mix[3]);
    if (baseHex && otherHex) {
      const lerp = (a, b) => Math.round((a * w1 + b * w2) * 255);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(lerp(baseHex.r, otherHex.r))}${toHex(lerp(baseHex.g, otherHex.g))}${toHex(lerp(baseHex.b, otherHex.b))}`;
    }
    const base = parseOklch(mix[1]);
    if (!base) return null;
    if (mix[3] === 'transparent') {
      return `oklch(${(base.L * 100).toFixed(4)}% ${base.C} ${base.H})`;
    }
    const other = parseOklch(mix[3]);
    if (!other) return null;
    const L = base.L * w1 + other.L * w2;
    const C = base.C * w1 + other.C * w2;
    const H = base.H;
    return `oklch(${(L * 100).toFixed(4)}% ${C.toFixed(4)} ${H.toFixed(4)})`;
  }
  return null;
}

function checkEraMode(era, mode) {
  const t1 = JSON.parse(
    fs.readFileSync(path.join(REPO, 'spec/tokens/tier1', `${era}.${mode}.tokens.json`), 'utf8')
  );
  const t2 = JSON.parse(
    fs.readFileSync(path.join(REPO, 'spec/tokens/tier2', `${era}.${mode}.tokens.json`), 'utf8')
  );
  // Resolve semantic refs against tier-1 primitives only (tier-2 must not overwrite).
  const map = collectTokenValues(t1);

  const c = t2.color;
  // Text pairs (AA) + non-text UI pairs (≥3:1 borders/thumbs/tracks against fills).
  const pairs = [
    ['fg/default on bg/page', colorValue(c.fg.default), colorValue(c.bg.page), 4.5],
    ['fg/default on bg/surface', colorValue(c.fg.default), colorValue(c.bg.surface), 4.5],
    ['fg/default on bg/elevated', colorValue(c.fg.default), colorValue(c.bg.elevated), 4.5],
    ['action/fg on action/bg', colorValue(c.action.fg), colorValue(c.action.bg), 4.5],
    ['danger/fg on danger/bg', colorValue(c.danger.fg), colorValue(c.danger.bg), 4.5],
    ['fg/muted on bg/page', colorValue(c.fg.muted), colorValue(c.bg.page), 3],
    // Non-text controls (WCAG 1.4.11)
    ['border/strong on bg/surface', colorValue(c.border.strong), colorValue(c.bg.surface), 3],
    ['field/border on field/bg', colorValue(c.field.border), colorValue(c.field.bg), 3],
    ['fg/default (thumb) on track/off', colorValue(c.fg.default), colorValue(c.track.off), 3],
    ['action/fg (thumb) on track/on', colorValue(c.action.fg), colorValue(c.track.on), 3],
    // Off-state switch against the card (knob + track edge), not only token thumb/track pairs
    ['off-knob (fg/default) on card (bg/surface)', colorValue(c.fg.default), colorValue(c.bg.surface), 3],
    ['off-track-edge (border/strong) on card (bg/surface)', colorValue(c.border.strong), colorValue(c.bg.surface), 3],
  ];
  // Deco light paints the off knob/track edge with goldBorder (≥3:1); gold alone fails on ivory.
  if (era === 'deco' && mode === 'light') {
    const goldBorder = map.get('color.goldBorder');
    if (goldBorder) {
      pairs.push(
        ['deco off-knob (goldBorder) on card (bg/surface)', goldBorder, colorValue(c.bg.surface), 3],
        ['deco off-track-edge (goldBorder) on card (bg/surface)', goldBorder, colorValue(c.bg.surface), 3]
      );
    }
  }
  const issues = [];
  for (const [label, fgRaw, bgRaw, need] of pairs) {
    const fg = resolveSemanticColor(map, fgRaw);
    const bg = resolveSemanticColor(map, bgRaw);
    if (!fg || !bg) {
      issues.push({ label, error: `unresolvable fg=${fgRaw} bg=${bgRaw} → ${fg}/${bg}` });
      continue;
    }
    const lf = relativeLuminance(fg);
    const lb = relativeLuminance(bg);
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

const report = {
  eras: {},
  pass: true,
  note: 'Glow ignored; flat fills only. Text AA + non-text controls ≥3:1 (borders, field, switch thumb/track). Both modes.',
};
for (const era of ERAS) {
  report.eras[era] = { modes: {}, pass: true };
  for (const mode of MODES) {
    const issues = checkEraMode(era, mode);
    report.eras[era].modes[mode] = { pass: issues.length === 0, issues };
    if (issues.length) {
      report.eras[era].pass = false;
      report.pass = false;
    }
  }
}
const outDir = path.join(REPO, 'generated/contrast');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
if (!report.pass) {
  console.error('Contrast CI failed (AA without glow):');
  for (const [era, r] of Object.entries(report.eras)) {
    if (!r.pass) {
      console.error(`  ${era}:`);
      for (const [mode, m] of Object.entries(r.modes)) {
        if (!m.pass) {
          for (const i of m.issues) {
            console.error(`    [${mode}] ${i.label}: ${i.ratio ?? i.error} (need ${i.need})`);
          }
        }
      }
    }
  }
  process.exit(1);
}
console.log(`Contrast CI OK for ${ERAS.join(', ')} × ${MODES.join('/')} (AA, glow ignored).`);
