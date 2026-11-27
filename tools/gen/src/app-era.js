/** Era character for dense-app components. Calm inside data-density=compact. */

export function appEraCss(eraId) {
  const e = `[data-era="${eraId}"]`;
  const open = `${e}:not([data-density="compact"])`;
  const shared = `
  ${e} :is(.ew-badge, .ew-chip, .ew-nav-rail__item, .ew-pagination__page, .ew-segmented__item, .ew-search, .ew-table, .ew-list-item, .ew-toolbar, .ew-stat, .ew-meter, .ew-empty-state, .ew-code, .ew-media-card, .ew-split, .ew-sheet) {
    font-family: var(--ew-font-body, system-ui, sans-serif);
  }
  ${e} .ew-table { border-collapse: collapse; }
  ${e} .ew-list-item + .ew-list-item { border-top: 1px solid var(--ew-color-border-subtle); }
  ${e} .ew-stat { background: var(--ew-color-bg-surface); padding: var(--ew-card-pad, 12px); }`;
  const look = {
    deco: `
  ${open} .ew-chip, ${open} .ew-badge { border-radius: 0; border-color: var(--ew-color-gold, var(--ew-color-border-strong)); }
  ${e} .ew-stat__value { color: var(--ew-color-gold, var(--ew-color-action-bg)); font-variant-numeric: tabular-nums; }
  ${open} .ew-table th { letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.75rem; }`,
    groovy: `
  ${e} .ew-chip, ${e} .ew-segmented { border-radius: 999px; }
  ${open} .ew-stat__value { font-family: var(--ew-font-display, inherit); }
  ${e} .ew-list-item { border-radius: 16px; }`,
    'mcm-atomic': `
  ${e} .ew-badge { border-radius: 4px 14px 4px 14px; }
  ${e} .ew-stat__value { color: var(--ew-color-coral, var(--ew-color-action-bg)); }
  ${open} .ew-chip { border-radius: 14px 4px; }
  ${e}[data-mode="dark"] :is(.ew-link, .ew-card__title a, .ew-card h2 a, .ew-card h3 a) { color: #FFB4A8; }`,
    neon: `
  ${e} .ew-chip, ${e} .ew-segmented { box-shadow: 0 0 0 1px var(--ew-color-magenta, var(--ew-color-action-bg)); }
  ${e} .ew-stat__value { color: var(--ew-color-magenta, var(--ew-color-action-bg)); }
  ${e}[data-mode="light"] .ew-link { text-decoration: underline; text-decoration-color: #E2186A; text-decoration-thickness: 2px; text-underline-offset: 0.18em; }
  ${open} .ew-media-card:hover { box-shadow: 0 0 0 1px var(--ew-color-cyan, var(--ew-color-action-bg)); }`,
    memphis: `
  ${e} .ew-badge, ${e} .ew-chip { border-radius: 0; background: var(--ew-color-yellow, var(--ew-color-bg-surface)); color: var(--ew-color-ink, var(--ew-color-fg-default)); box-shadow: 3px 3px 0 0 var(--ew-color-ink, var(--ew-color-fg-default)); }
  ${e} .ew-stat { box-shadow: 6px 6px 0 0 var(--ew-color-blue, var(--ew-color-action-bg)); }
  ${e} .ew-section-heading::before { content: ""; display: inline-block; width: 12px; height: 12px; margin-inline-end: 8px; background: var(--ew-color-pink, var(--ew-color-action-bg)); box-shadow: 4px 4px 0 var(--ew-color-yellow, var(--ew-color-action-bg)); vertical-align: 0.1em; }`,
    'art-nouveau': `
  ${e} .ew-chip { border-radius: 999px 4px; border-color: var(--ew-color-brass, var(--ew-color-border-strong)); }
  ${e} .ew-stat__value { color: var(--ew-color-leaf, var(--ew-color-action-bg)); }
  ${open} .ew-media-card { border-radius: 48% 48% 8px 8px; overflow: hidden; }`,
    bauhaus: `
  ${e} .ew-badge, ${e} .ew-chip, ${e} .ew-segmented { border-radius: 0; }
  ${e} .ew-stat__value { font-weight: 800; }
  ${e} .ew-table th { border-bottom: 3px solid var(--ew-color-fg-default); }`,
    swiss: `
  ${e} .ew-chip, ${e} .ew-badge, ${e} .ew-segmented { border-radius: 0; }
  ${e} .ew-table th { border-bottom: 2px solid var(--ew-color-fg-default); }
  ${e} .ew-stat__value { color: var(--ew-color-action-bg); }`,
    neutral: `
  ${e} .ew-hero { min-height: min(42vh, 420px); display: grid; align-items: start; padding: clamp(28px, 5vw, 64px); background: radial-gradient(circle at 90% 10%, color-mix(in oklch, var(--ew-color-action-bg) 22%, transparent), transparent 46%), linear-gradient(180deg, var(--ew-color-bg-surface), var(--ew-color-bg-page)); border-bottom: 1px solid var(--ew-color-border-subtle); }
  ${e} .ew-hero__title { font-size: clamp(2.5rem, 5vw, 4.25rem); letter-spacing: -0.04em; line-height: 0.95; max-width: 14ch; }
  ${e} .ew-chip, ${e} .ew-media-card, ${e} .ew-stat { box-shadow: 0 1px 2px color-mix(in oklch, black 14%, transparent); }
  ${e} .ew-stat__value { letter-spacing: -0.03em; }`,
  };
  return `${shared}\n${look[eraId] || ''}`;
}
