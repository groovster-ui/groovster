
/**
 * Spec validate with exact "change X to Y" fixes.
 */
import { getComponent, getEra, loadComponents } from './load-spec.js';

function countClass(html, cls) {
  const re = new RegExp(`class=["'][^"']*\\b${cls}\\b`, 'g');
  return [...(html || '').matchAll(re)].length;
}

export function validateMarkup(markup, eraName, opts = {}) {
  const html = markup || '';
  const detail = opts.detail === 'full';
  const era = eraName ? getEra(eraName) : null;
  const issues = [];

  const push = (problem, change) => issues.push({ problem, change });

  if (eraName && !era) {
    push(`Unknown era "${eraName}"`, `change era to one of: neutral, deco, mcm-atomic, neon`);
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
      // Heuristic neverDo hits
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
  }

  // Component presence / native preferences
  if (/role=["']button["']/i.test(html) && !/<button\b/i.test(html)) {
    push('div/span used as button', 'change element to <button type="button" class="ew-button">');
  }
  if (/class=["'][^"']*\bew-dialog\b/.test(html) && !/<dialog\b/i.test(html)) {
    push('ew-dialog not on <dialog>', 'change root to <dialog class="ew-dialog">');
  }
  if (/class=["'][^"']*\bew-text-field\b/.test(html)) {
    if (!/<label\b/i.test(html)) {
      push('TextField missing label', 'change markup to include <label class="ew-text-field__label" for="…">');
    }
    if (!/<input\b/i.test(html)) {
      push('TextField missing input', 'change to include <input class="ew-text-field__control">');
    }
  }
  if (/class=["'][^"']*\bew-switch\b/.test(html)) {
    if (!/type=["']checkbox["']/i.test(html)) {
      push('Switch not native checkbox', 'change control to <input type="checkbox" class="ew-switch__control" role="switch">');
    }
    if (/role=["']switch["']/.test(html) && !/aria-checked=/.test(html)) {
      push('role=switch missing aria-checked', 'change input to include aria-checked="true|false" synced with checked');
    }
  }
  if (/role=["']tablist["']/.test(html)) {
    if (!/role=["']tab["']/.test(html)) {
      push('tablist without tabs', 'change to add <button role="tab" aria-selected="…"> children');
    }
    if (!/role=["']tabpanel["']/.test(html)) {
      push('tabs without tabpanel', 'change to add <div role="tabpanel" aria-labelledby="…">');
    }
  }

  // Unknown ew- classes
  const known = new Set(loadComponents().map((c) => c.className));
  for (const m of html.matchAll(/class=["']([^"']+)["']/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls.startsWith('ew-') && !cls.includes('__') && !known.has(cls) && cls !== 'ew-root') {
        push(`Unknown class ${cls}`, `change ${cls} to one of: ${[...known].join(', ')}`);
      }
    }
  }

  // Suggest canonical component if empty-ish request context
  if (opts.expectComponent) {
    const comp = getComponent(opts.expectComponent);
    if (comp && countClass(html, comp.className) < 1) {
      push(`Missing ${comp.className}`, `change markup to include canonical: ${comp.canonicalHtml.split('\n')[0]}`);
    }
  }

  const pass = issues.length === 0;
  const compact = {
    version: '0.1.0-alpha.0',
    pass,
    era: era?.id || eraName || null,
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
