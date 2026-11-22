#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const ERAS = ['neutral', 'deco', 'mcm-atomic', 'neon', 'memphis', 'groovy', 'earth'];

function parseOklch(str) {
  const m = String(str).match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*[\d.]+)?\)/i);
  if (!m) return null;
  return {
    l: Number(m[1]) / (m[1].includes('%') ? 1 : 100),
    c: Number(m[2]),
    h: Number(m[3])
  };
}

function oklchToLinearRgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;
  
  const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  
  return { r, g, b: b_ };
}

function linearToSrgb(val) {
  if (val <= 0.0031308) {
    return 12.92 * val;
  }
  return 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
}

function srgbToRelativeLuminance(r, g, b) {
  const toLinear = (val) => {
    if (val <= 0.04045) {
      return val / 12.92;
    }
    return Math.pow((val + 0.055) / 1.055, 2.4);
  };
  
  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);
  
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function oklchToLuminance(l, c, h) {
  const { r, g, b } = oklchToLinearRgb(l, c, h);
  const sR = Math.max(0, Math.min(1, linearToSrgb(r)));
  const sG = Math.max(0, Math.min(1, linearToSrgb(g)));
  const sB = Math.max(0, Math.min(1, linearToSrgb(b)));
  return srgbToRelativeLuminance(sR, sG, sB);
}

function contrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function colorValue(node) {
  return node?.$value ?? null;
}

function resolveTokens(obj, resolved = {}, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$schema' || key === 'meta' || key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && '$value' in value) {
      resolved[path] = value.$value;
    } else if (value && typeof value === 'object') {
      resolveTokens(value, resolved, path);
    }
  }
  return resolved;
}

function resolveReferences(value, tokens) {
  if (typeof value !== 'string') return value;
  
  const refMatch = value.match(/^\{([^}]+)\}$/);
  if (refMatch) {
    const refPath = refMatch[1];
    return tokens[refPath] || value;
  }
  
  let resolved = value;
  const refRegex = /\{([^}]+)\}/g;
  resolved = resolved.replace(refRegex, (match, refPath) => {
    return tokens[refPath] || match;
  });
  
  return resolved;
}

function mixOklch(color1, color2, percentage) {
  const c1 = parseOklch(color1);
  const c2 = parseOklch(color2);
  if (!c1 || !c2) return null;
  
  const p = percentage / 100;
  return {
    l: c1.l * p + c2.l * (1 - p),
    c: c1.c * p + c2.c * (1 - p),
    h: c1.h * p + c2.h * (1 - p)
  };
}

function evaluateColorMix(value, tokens) {
  if (typeof value !== 'string') return value;
  
  const colorMixMatch = value.match(/color-mix\s*\(\s*in\s+oklch\s*,\s*(.+?)\s+([\d.]+)%\s*,\s*(.+?)\s+([\d.]+)%\s*\)/);
  if (!colorMixMatch) {
    return value;
  }
  
  const color1 = resolveReferences(colorMixMatch[1].trim(), tokens);
  const p1 = Number(colorMixMatch[2]);
  const color2 = resolveReferences(colorMixMatch[3].trim(), tokens);
  
  const mixed = mixOklch(color1, color2, p1);
  if (!mixed) return value;
  
  return `oklch(${(mixed.l * 100).toFixed(1)}% ${mixed.c.toFixed(3)} ${mixed.h.toFixed(1)})`;
}

function checkEra(era) {
  const modes = ['light', 'dark'];
  const allIssues = { light: [], dark: [] };
  
  for (const mode of modes) {
    const t1 = JSON.parse(
      fs.readFileSync(path.join(REPO, 'spec/tokens/tier1', `${era}.${mode}.tokens.json`), 'utf8')
    );
    const t2 = JSON.parse(
      fs.readFileSync(path.join(REPO, 'spec/tokens/tier2', `${era}.shared.tokens.json`), 'utf8')
    );
    
    const tier1Tokens = resolveTokens(t1);
    const tier2Tokens = resolveTokens(t2);
    
    const resolvedT2 = {};
    for (const [key, val] of Object.entries(tier2Tokens)) {
      let resolved = resolveReferences(val, tier1Tokens);
      const allTokens = { ...tier1Tokens, ...resolvedT2 };
      resolved = evaluateColorMix(resolved, allTokens);
      resolvedT2[key] = resolved;
    }
    
    const c = t2.color;
    const pairs = [
      ['fg/default on bg/page', resolvedT2['color.fg.default'], resolvedT2['color.bg.page'], 4.5],
      ['fg/default on bg/surface', resolvedT2['color.fg.default'], resolvedT2['color.bg.surface'], 4.5],
      ['fg/default on bg/elevated', resolvedT2['color.fg.default'], resolvedT2['color.bg.elevated'], 4.5],
      ['action/fg on action/bg', resolvedT2['color.action.fg'], resolvedT2['color.action.bg'], 4.5],
      ['danger/fg on danger/bg', resolvedT2['color.danger.fg'], resolvedT2['color.danger.bg'], 4.5],
      ['fg/muted on bg/page', resolvedT2['color.fg.muted'], resolvedT2['color.bg.page'], 3],
    ];
    
    for (const [label, fg, bg, need] of pairs) {
      const fgParsed = parseOklch(fg);
      const bgParsed = parseOklch(bg);
      if (!fgParsed || !bgParsed) {
        allIssues[mode].push({ label, error: `unparseable fg=${fg} bg=${bg}` });
        continue;
      }
      const lumFg = oklchToLuminance(fgParsed.l, fgParsed.c, fgParsed.h);
      const lumBg = oklchToLuminance(bgParsed.l, bgParsed.c, bgParsed.h);
      const ratio = contrastRatio(lumFg, lumBg);
      if (ratio < need) {
        allIssues[mode].push({ label, ratio: Number(ratio.toFixed(2)), need, fg, bg });
      }
    }
  }
  
  return allIssues;
}

const report = { eras: {}, pass: true, note: 'Glow ignored; flat OKLCH fills only. Proper OKLCH→sRGB→WCAG luminance.' };
for (const era of ERAS) {
  const issuesByMode = checkEra(era);
  const lightIssues = issuesByMode.light;
  const darkIssues = issuesByMode.dark;
  const hasIssues = lightIssues.length > 0 || darkIssues.length > 0;
  report.eras[era] = { 
    pass: !hasIssues, 
    light: { pass: lightIssues.length === 0, issues: lightIssues },
    dark: { pass: darkIssues.length === 0, issues: darkIssues }
  };
  if (hasIssues) report.pass = false;
}
const outDir = path.join(REPO, 'generated/contrast');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2) + '\n');
if (!report.pass) {
  console.error('Contrast CI failed (AA without glow):');
  for (const [era, r] of Object.entries(report.eras)) {
    if (!r.pass) {
      console.error(`  ${era}:`);
      if (!r.light.pass) {
        console.error(`    light mode:`);
        for (const i of r.light.issues) console.error(`      - ${i.label}: ${i.ratio ?? i.error} (need ${i.need})`);
      }
      if (!r.dark.pass) {
        console.error(`    dark mode:`);
        for (const i of r.dark.issues) console.error(`      - ${i.label}: ${i.ratio ?? i.error} (need ${i.need})`);
      }
    }
  }
  process.exit(1);
}
console.log(`Contrast CI OK for ${ERAS.join(', ')} in light and dark modes (AA, glow ignored).`);
