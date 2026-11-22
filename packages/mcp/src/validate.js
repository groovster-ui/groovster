/**
 * Spec validate with exact "change X to Y" fixes.
 * Covers all components + optional contrast gate when era is set.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getComponent, getEra, loadComponents, loadEras } from './load-spec.js';
import {
  collectTokenValues,
  resolveValueAgainst,
} from '../../../tools/gen/src/tokens-to-css.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

function countClass(html, cls) {
  const re = new RegExp(`class=["'][^"']*\\b${cls}\\b`, 'g');
  return [...(html || '').matchAll(re)].length;
}

function parseOklch(str) {
  const m = String(str).match(
    /oklch\(\s*([\d.]+)\s*%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/i
  );
  if (!m) return null;
  let L = Number(m[1]);
  if (L > 1) L = L / 100;
  return { L, C: Number(m[2]), H: Number(m[3]) };
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
  const { L, C, H } = parsed;
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r = Math.max(0, Math.min(1, +4.0767416621 * l - 3.3077126679 * m + 0.2309699292 * s));
  const g = Math.max(0, Math.min(1, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
  const bl = Math.max(0, Math.min(1, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s));
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

const COLOR_TOKEN = String.raw`(?:oklch\([^)]+\)|#[0-9a-fA-F]{3,8})`;

function resolveSemantic(map, raw) {
  if (raw == null) return null;
  const resolved = resolveValueAgainst(map, raw);
  if (typeof resolved !== 'string') return null;
  const trimmed = resolved.trim();
  if (/^oklch\(/i.test(trimmed) || parseHex(trimmed)) return trimmed;
  const mix = trimmed.match(
    new RegExp(
      String.raw`color-mix\(\s*in\s+oklch\s*,\s*(${COLOR_TOKEN})\s+([\d.]+)%\s*,\s*(transparent|${COLOR_TOKEN})\s*\)`,
      'i'
    )
  );
  if (mix) {
    const baseHex = parseHex(mix[1]);
    const pct = Number(mix[2]) / 100;
    if (baseHex && mix[3] === 'transparent') return mix[1];
    const otherHex = mix[3] === 'transparent' ? null : parseHex(mix[3]);
    if (baseHex && otherHex) {
      const lerp = (a, b) => Math.round((a * pct + b * (1 - pct)) * 255);
      const toHex = (n) => n.toString(16).padStart(2, '0');
      return `#${toHex(lerp(baseHex.r, otherHex.r))}${toHex(lerp(baseHex.g, otherHex.g))}${toHex(lerp(baseHex.b, otherHex.b))}`;
    }
    const base = parseOklch(mix[1]);
    if (!base) return null;
    if (mix[3] === 'transparent') return `oklch(${(base.L * 100).toFixed(4)}% ${base.C} ${base.H})`;
    const other = parseOklch(mix[3]);
    if (!other) return null;
    const L = base.L * pct + other.L * (1 - pct);
    const C = base.C * pct + other.C * (1 - pct);
    return `oklch(${(L * 100).toFixed(4)}% ${C.toFixed(4)} ${base.H.toFixed(4)})`;
  }
  return null;
}

function contrastCheck(eraId, mode = 'light') {
  try {
    const t1 = JSON.parse(
      fs.readFileSync(path.join(REPO, 'spec/tokens/tier1', `${eraId}.${mode}.tokens.json`), 'utf8')
    );
    const t2 = JSON.parse(
      fs.readFileSync(path.join(REPO, 'spec/tokens/tier2', `${eraId}.${mode}.tokens.json`), 'utf8')
    );
    const map = collectTokenValues(t1);
    const fg = resolveSemantic(map, t2.color.fg.default.$value);
    const bg = resolveSemantic(map, t2.color.bg.page.$value);
    const lf = relativeLuminance(fg);
    const lb = relativeLuminance(bg);
    if (lf == null || lb == null) return { ok: false, error: 'unresolvable colors' };
    const ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
    return { ok: ratio >= 4.5, ratio: Number(ratio.toFixed(2)), need: 4.5, mode };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function componentRules(html, push) {
  const comps = loadComponents();
  for (const comp of comps) {
    if (countClass(html, comp.className) < 1) continue;
    // Shared native preferences
    if (comp.nativeElement === 'button' && /role=["']button["']/i.test(html) && !/<button\b/i.test(html)) {
      push(`${comp.name}: non-native button`, `change element to <button type="button" class="${comp.className}">`);
    }
    if (comp.id === 'dialog' && !/<dialog\b/i.test(html)) {
      push('ew-dialog not on <dialog>', 'change root to <dialog class="ew-dialog">');
    }
    if (comp.id === 'text-field') {
      if (!/<label\b/i.test(html)) {
        push('TextField missing label', 'change markup to include <label class="ew-text-field__label" for="…">');
      }
      if (!/<input\b/i.test(html)) {
        push('TextField missing input', 'change to include <input class="ew-text-field__control">');
      }
    }
    if (comp.id === 'textarea' && !/<textarea\b/i.test(html)) {
      push('Textarea missing control', 'change to include <textarea class="ew-textarea__control">');
    }
    if (comp.id === 'switch') {
      if (!/type=["']checkbox["']/i.test(html)) {
        push('Switch not native checkbox', 'change control to <input type="checkbox" class="ew-switch__control" role="switch">');
      }
      if (/role=["']switch["']/.test(html) && !/aria-checked=/.test(html)) {
        push('role=switch missing aria-checked', 'change input to include aria-checked="true|false" synced with checked');
      }
    }
    if (comp.id === 'checkbox' && !/type=["']checkbox["']/i.test(html)) {
      push('Checkbox missing input', 'change to include <input type="checkbox" class="ew-checkbox__control">');
    }
    if (comp.id === 'radio' && !/type=["']radio["']/i.test(html)) {
      push('Radio missing input', 'change to include <input type="radio" class="ew-radio__control">');
    }
    if (comp.id === 'tabs') {
      if (!/role=["']tablist["']/.test(html)) push('Tabs missing tablist', 'change to include role="tablist"');
      if (!/role=["']tab["']/.test(html)) push('Tabs missing tab', 'change to add role="tab" buttons');
      if (!/role=["']tabpanel["']/.test(html)) push('Tabs missing tabpanel', 'change to add role="tabpanel"');
    }
    if (comp.id === 'select' && !/<select\b/i.test(html) && !/role=["']combobox["']/.test(html)) {
      push('Select missing native or combobox', 'change to include <select class="ew-select__control"> (enhanced by ew-select)');
    }
    if (comp.id === 'menu' && !/role=["']menu["']/.test(html)) {
      push('Menu missing role=menu', 'change panel to role="menu" with role="menuitem" children');
    }
    if (comp.id === 'slider' && !/type=["']range["']/i.test(html)) {
      push('Slider missing range input', 'change to include <input type="range" class="ew-slider__control">');
    }
    if (comp.id === 'link' && !/<a\b/i.test(html)) {
      push('Link not on <a>', 'change to <a class="ew-link" href="…">');
    }
    if (comp.id === 'breadcrumb' && !/<nav\b/i.test(html) && !/aria-label/.test(html)) {
      push('Breadcrumb should be in nav', 'change wrapper to <nav class="ew-breadcrumb" aria-label="Breadcrumb">');
    }
    if (comp.aria?.role && comp.behavior === 'web-component') {
      // soft check: custom element tag present for hard widgets
      const tag = comp.id === 'toast' ? 'ew-toast-region' : `ew-${comp.id}`;
      if (!new RegExp(`<${tag}\\b`, 'i').test(html) && countClass(html, comp.className) > 0) {
        // progressive enhancement allows class-only; no hard fail
      }
    }
  }
}

export function validateMarkup(markup, eraName, opts = {}) {
  const html = markup || '';
  const detail = opts.detail === 'full';
  const era = eraName ? getEra(eraName) : null;
  const issues = [];
  const push = (problem, change) => issues.push({ problem, change });

  if (eraName && !era) {
    push(
      `Unknown era "${eraName}"`,
      `change era to one of: ${loadEras().map((e) => e.id).join(', ')}`
    );
  }

  if (era) {
    const eraRe = new RegExp(`data-era=["']${era.id}["']`);
    if (!eraRe.test(html)) {
      push(
        `Missing data-era="${era.id}"`,
        `change wrapping element to include data-era="${era.id}" (keep ew-* classes unchanged)`
      );
    }
    for (const rule of era.neverDo || []) {
      const lower = rule.toLowerCase();
      if (lower.includes('orbitron') && /font-family\s*:\s*['"]?orbitron/i.test(html) && /ew-button|ew-text-field|ew-switch/.test(html)) {
        push('neverDo: Orbitron on controls', 'change button/field/switch font-family to inherit (remove Orbitron from controls)');
      }
      if (lower.includes('cinzel') && /font-family\s*:\s*['"]?cinzel/i.test(html) && /ew-button|ew-text-field|ew-switch/.test(html)) {
        push('neverDo: Cinzel/display on controls', 'change control font-family to inherit / body face; keep Cinzel on titles only');
      }
      if (lower.includes('glow') && /text-shadow:[^;]*0 0/i.test(html) && /<(p|span|label|button)/i.test(html)) {
        push('neverDo: glow used as contrast', 'change text color/background for AA contrast; remove glow as the sole separator');
      }
    }
    // Contrast gate (light + dark semantic fg/bg)
    for (const mode of era.modes || ['light', 'dark']) {
      const c = contrastCheck(era.id, mode);
      if (!c.ok) {
        push(
          `Contrast fail ${era.id}/${mode}` + (c.ratio != null ? ` (${c.ratio}:1)` : ` (${c.error})`),
          `change ${era.id} ${mode} tier-1/2 colors so fg/default on bg/page is ≥ 4.5:1`
        );
      }
    }
  }

  if (/role=["']button["']/i.test(html) && !/<button\b/i.test(html)) {
    push('div/span used as button', 'change element to <button type="button" class="ew-button">');
  }

  componentRules(html, push);

  const known = new Set(loadComponents().map((c) => c.className));
  for (const m of html.matchAll(/class=["']([^"']+)["']/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls.startsWith('ew-') && !cls.includes('__') && !known.has(cls) && cls !== 'ew-root' && cls !== 'ew-toast-region') {
        push(`Unknown class ${cls}`, `change ${cls} to one of: ${[...known].join(', ')}`);
      }
    }
  }

  if (opts.expectComponent) {
    const comp = getComponent(opts.expectComponent);
    if (comp && countClass(html, comp.className) < 1) {
      push(`Missing ${comp.className}`, `change markup to include canonical: ${comp.canonicalHtml.split('\n')[0]}`);
    }
  }

  // Ensure validator knows all 21 components exist in the catalog
  const catalog = loadComponents();
  if (catalog.length < 21) {
    push(`Component catalog incomplete (${catalog.length})`, 'change specs so all 21 components are present under spec/components');
  }

  const pass = issues.length === 0;
  const compact = {
    version: '0.1.0-alpha.0',
    pass,
    era: era?.id || eraName || null,
    componentsCovered: catalog.length,
    fixes: issues.map((i) => i.change),
  };
  if (!pass && issues.length) {
    compact.firstFix = issues[0].change;
  }
  if (detail) {
    return { ...compact, issues };
  }
  return compact;
}
