/** Era character for dense-app components. Calm inside data-density=compact. */

export function appEraCss(eraId) {
  const e = `[data-era="${eraId}"]`;
  const open = `${e}:not([data-density="compact"])`;
  const shared = `
  ${e} :is(.ew-badge, .ew-chip, .ew-nav-rail__item, .ew-pagination__page, .ew-segmented__item, .ew-search, .ew-table, .ew-list-item, .ew-toolbar, .ew-stat, .ew-meter, .ew-empty-state, .ew-code, .ew-media-card, .ew-split, .ew-sheet, .ew-shelf) {
    font-family: var(--ew-font-body, system-ui, sans-serif);
  }
  ${e} .ew-table { border-collapse: collapse; }
  ${e} .ew-table tbody tr:nth-child(even) { background: color-mix(in oklch, var(--ew-color-fg-default) 5%, transparent); }
  ${e} .ew-list-item + .ew-list-item { border-top: 1px solid var(--ew-color-border-subtle); }
  ${e} .ew-nav-rail__item[aria-current="page"], ${e} .ew-list-item[aria-current="true"] { font-weight: 700; box-shadow: inset 3px 0 0 var(--ew-color-action-bg); }
  ${e} .ew-pagination__page[aria-current="page"] { font-weight: 700; box-shadow: inset 0 -2px 0 var(--ew-color-action-bg); }
  ${e} .ew-stat { background: var(--ew-color-bg-surface); padding: var(--ew-card-pad, 12px); }
  ${e} .ew-code, ${e} .ew-code code { font-family: var(--ew-font-mono, ui-monospace, monospace); }
  ${e} .ew-skeleton { background: color-mix(in oklch, var(--ew-color-fg-muted) 18%, var(--ew-color-bg-surface)); }
  ${e} .ew-empty-state { border: 1px dashed var(--ew-color-border-subtle); }
  ${e} .ew-meter__bar { border-radius: 999px; }`;
  const look = {
    deco: `
  ${e} :is(.ew-chip, .ew-badge, .ew-segmented, .ew-search, .ew-code) { border-radius: 0; }
  ${open} :is(.ew-toolbar, .ew-search, .ew-code) { box-shadow: inset 0 -1px 0 var(--ew-color-gold, currentColor), inset 0 -4px 0 color-mix(in srgb, var(--ew-color-gold, currentColor) 35%, transparent); }
  ${e} :is(.ew-stat__value, .ew-price) { color: var(--ew-color-brassDeep, #5C4510); font-variant-numeric: tabular-nums; }
  ${e}[data-mode="dark"] :is(.ew-stat__value, .ew-price) { color: var(--ew-color-gold, #E6C56A); }
  ${open} .ew-table th { letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.75rem; }`,
    groovy: `
  ${e} :is(.ew-chip, .ew-segmented, .ew-search, .ew-code, .ew-toolbar) { border-radius: 999px; }
  ${open} .ew-stat__value, ${e} .ew-price { font-family: var(--ew-font-display, inherit); }
  ${e} .ew-list-item, ${e} .ew-empty-state { border-radius: 16px; }
  ${open} .ew-shelf__row > * { border-radius: 20px; }`,
    'mcm-atomic': `
  ${e} .ew-badge { border-radius: 4px 14px 4px 14px; }
  ${e} :is(.ew-stat__value, .ew-price) { color: var(--ew-color-coral, var(--ew-color-action-bg)); }
  ${e}[data-mode="dark"] :is(.ew-stat__value, .ew-price) { color: #FFB4A8; }
  ${open} .ew-chip { border-radius: 14px 4px; }
  ${e}[data-mode="dark"] :is(.ew-link, a.ew-card__title, .ew-card__title a, .ew-card :is(h2, h3, h4) a) { color: #FFB4A8; }`,
    neon: `
  ${e} :is(.ew-chip, .ew-segmented, .ew-search, .ew-code) { box-shadow: 0 0 0 1px var(--ew-color-magenta, var(--ew-color-action-bg)); }
  ${e} :is(.ew-stat__value, .ew-price) { color: var(--ew-color-magenta, var(--ew-color-action-bg)); }
  ${e}[data-mode="light"] .ew-link { color: #8E1248; text-decoration: underline; text-decoration-color: #E2186A; text-decoration-thickness: 2px; text-underline-offset: 0.18em; }
  ${open} :is(.ew-media-card:hover, .ew-search:focus-within) { box-shadow: 0 0 0 1px var(--ew-color-cyan, var(--ew-color-action-bg)), 0 0 12px color-mix(in oklch, var(--ew-color-cyan, var(--ew-color-action-bg)) 45%, transparent); }`,
    memphis: `
  ${e} .ew-badge, ${e} .ew-chip { border-radius: 0; background: var(--ew-color-yellow, #EACC56); color: #1A1408; box-shadow: 3px 3px 0 0 #1A1408; }
  ${open} .ew-stat { box-shadow: 6px 6px 0 0 var(--ew-color-blue, var(--ew-color-action-bg)); }
  ${open} .ew-table { box-shadow: 4px 4px 0 0 var(--ew-color-pink, var(--ew-color-action-bg)); }
  ${e} .ew-section-heading::before { content: ""; display: inline-block; width: 12px; height: 12px; margin-inline-end: 8px; background: var(--ew-color-pink, var(--ew-color-action-bg)); box-shadow: 4px 4px 0 var(--ew-color-yellow, var(--ew-color-action-bg)); vertical-align: 0.1em; }`,
    'art-nouveau': `
  ${e} .ew-chip, ${e} .ew-search { border-radius: 999px 4px; border-color: var(--ew-color-brass, var(--ew-color-border-strong)); }
  ${e} :is(.ew-stat__value, .ew-price) { color: var(--ew-color-leaf, var(--ew-color-action-bg)); }
  ${open} .ew-media-card, ${open} .ew-shelf { border-radius: 48% 48% 8px 8px; overflow: hidden; }`,
    bauhaus: `
  ${e} .ew-badge, ${e} .ew-chip, ${e} .ew-segmented, ${e} .ew-toolbar, ${e} .ew-search { border-radius: 0; }
  ${e} .ew-badge { box-shadow: inset 4px 0 0 var(--ew-color-action-bg); }
  ${e} .ew-price { color: #9E1018; font-weight: 800; }
  ${e}[data-mode="dark"] .ew-price { color: #FF9B94; }
  ${e} .ew-stat__value { font-weight: 800; }
  ${e} .ew-table th { border-bottom: 3px solid var(--ew-color-fg-default); }`,
    swiss: `
  ${e} :is(.ew-chip, .ew-badge, .ew-segmented, .ew-search, .ew-toolbar, .ew-code, .ew-table) { border-radius: 0; }
  ${e} .ew-table th { border-bottom: 2px solid var(--ew-color-fg-default); }
  ${e} :is(.ew-stat__value, .ew-price, .ew-pagination__page[aria-current="page"]) { color: var(--ew-color-action-bg); }`,
    neutral: `
  ${e} .ew-hero { min-height: min(42vh, 420px); display: grid; align-items: start; padding: clamp(28px, 5vw, 64px); background: radial-gradient(circle at 90% 10%, color-mix(in oklch, var(--ew-color-action-bg) 22%, transparent), transparent 46%), linear-gradient(180deg, var(--ew-color-bg-surface), var(--ew-color-bg-page)); border-bottom: 1px solid var(--ew-color-border-subtle); }
  ${e} .ew-hero__content { display: grid; gap: clamp(12px, 2vw, 20px); justify-items: start; }
  ${e} .ew-hero__title { font-size: clamp(2.5rem, 5vw, 4.25rem); letter-spacing: -0.04em; line-height: 0.95; max-width: 14ch; }
  ${e} .ew-hero__subtitle { max-width: 36ch; font-size: 1.125rem; margin: 0; }
  ${e} :is(.ew-chip, .ew-media-card, .ew-stat, .ew-search, .ew-code) { box-shadow: 0 1px 2px color-mix(in oklch, black 14%, transparent); }
  ${e} .ew-stat__value { letter-spacing: -0.03em; }`,
  };
  return `${shared}\n${look[eraId] || ''}`;
}
