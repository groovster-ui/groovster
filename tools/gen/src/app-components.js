/** Dense-app components and the rules that keep era frames usable in real screens. */

const APP_IDS = new Set([
  'density',
  'list',
  'nav-rail',
  'badge',
  'chip',
  'toolbar',
  'search',
  'pagination',
  'table',
  'meter',
  'stat',
  'media-card',
  'shelf',
  'code',
  'empty-state',
  'skeleton',
  'segmented',
  'typing-indicator',
  'split',
  'sheet',
  'product-card',
  'price',
  'rating',
  'countdown',
  'filter-group',
]);

export function isAppComponent(id) {
  return APP_IDS.has(id);
}

export function appComponentCss(id, cls) {
  const fn = {
    density: densityCss,
    list: listCss,
    'nav-rail': navCss,
    badge: badgeCss,
    chip: chipCss,
    toolbar: toolbarCss,
    search: searchCss,
    pagination: pageCss,
    table: tableCss,
    meter: meterCss,
    stat: statCss,
    'media-card': mediaCss,
    shelf: shelfCss,
    code: codeCss,
    'empty-state': emptyCss,
    skeleton: skeletonCss,
    segmented: segmentedCss,
    'typing-indicator': typingCss,
    split: splitCss,
    sheet: sheetCss,
    'product-card': productCss,
    price: priceCss,
    rating: ratingCss,
    countdown: countdownCss,
    'filter-group': filterCss,
  }[id];
  return fn ? fn(cls) : '';
}

const CONTROL_FACE = ':is(.ew-button, .ew-icon-button, .ew-chip, .ew-badge, .ew-menu__item, .ew-nav-rail__item, .ew-pagination__page, .ew-segmented__item, .ew-search__control, .ew-text-field__label, .ew-select__label, .ew-textarea__label, .ew-tabs [role="tab"], ew-tabs [role="tab"])';
const APP_TITLES = ':is(.ew-dialog, .ew-card, .ew-shelf, .ew-media-card) :is(h1, h2, h3, h4)';
const QUIET_CARDS = [
  '[data-era] .ew-card--quiet',
  '[data-era][data-density="compact"] .ew-card:not(.ew-feature)',
  '[data-era] [data-density="compact"] .ew-card:not(.ew-feature)',
  '[data-era][data-fidelity-band="whisper"] .ew-card:not(.ew-feature)',
  '[data-era] [data-fidelity-band="whisper"] .ew-card:not(.ew-feature)',
];
const QUIET = QUIET_CARDS.join(',\n  ');
const QUIET_HEADER_BOX = QUIET_CARDS.map((sel) => `${sel} .ew-card__header`).join(',\n  ');
const QUIET_HEADER = QUIET_CARDS.map((sel) => `${sel} :is(.ew-card__header, .ew-card__title)::before,\n  ${sel} :is(.ew-card__header, .ew-card__title)::after`).join(',\n  ');

/** Wins over era decorator frames. Emitted after the components layer. */
export function densityDecoratorCss() {
  return `@layer decorators {
  [data-era][data-density="compact"] ${CONTROL_FACE},
  [data-era] [data-density="compact"] ${CONTROL_FACE},
  [data-era].ew-app ${CONTROL_FACE},
  [data-era] .ew-app ${CONTROL_FACE} {
    font-family: var(--ew-font-body, system-ui, sans-serif);
    text-transform: none;
    letter-spacing: normal;
  }
  .ew-caps {
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  [data-era][data-density="compact"] ${APP_TITLES},
  [data-era] [data-density="compact"] ${APP_TITLES},
  [data-era].ew-app ${APP_TITLES},
  [data-era] .ew-app ${APP_TITLES} {
    font-size: 1.05rem;
    line-height: 1.3;
    letter-spacing: normal;
    text-transform: none;
  }
  [data-era] .ew-title--page { font-size: clamp(1.5rem, 2.2vw, 2rem); line-height: 1.15; }
  [data-era] .ew-title--section { font-size: clamp(1.15rem, 1.5vw, 1.4rem); line-height: 1.2; }
  [data-era] .ew-title--panel { font-size: 1rem; line-height: 1.3; font-family: var(--ew-font-body, system-ui, sans-serif); }
  [data-era] .ew-button[data-variant="ghost"]:not(.ew-button--framed):not(:hover):not(:focus-visible),
  [data-era] .ew-icon-button:not(.ew-button--framed):not(:hover):not(:focus-visible) {
    border-color: transparent;
    box-shadow: none;
    background: transparent;
    background-image: none;
    clip-path: none;
  }
  [data-era] .ew-card--quiet,
  [data-era][data-density="compact"] .ew-card:not(.ew-feature),
  [data-era] [data-density="compact"] .ew-card:not(.ew-feature),
  [data-era][data-fidelity-band="whisper"] .ew-card:not(.ew-feature),
  [data-era] [data-fidelity-band="whisper"] .ew-card:not(.ew-feature) {
    clip-path: none;
    box-shadow: none;
    background-image: none;
    filter: none;
    border: 1px solid var(--ew-color-border-subtle);
    border-radius: var(--ew-structure-surface-radius, 8px);
  }
  [data-era] .ew-card--quiet::before,
  [data-era] .ew-card--quiet::after,
  [data-era][data-density="compact"] .ew-card:not(.ew-feature)::before,
  [data-era][data-density="compact"] .ew-card:not(.ew-feature)::after,
  [data-era] [data-density="compact"] .ew-card:not(.ew-feature)::before,
  [data-era] [data-density="compact"] .ew-card:not(.ew-feature)::after,
  [data-era][data-fidelity-band="whisper"] .ew-card:not(.ew-feature)::before,
  [data-era][data-fidelity-band="whisper"] .ew-card:not(.ew-feature)::after,
  [data-era] [data-fidelity-band="whisper"] .ew-card:not(.ew-feature)::before,
  [data-era] [data-fidelity-band="whisper"] .ew-card:not(.ew-feature)::after {
    content: none;
    display: none;
  }
  ${QUIET_HEADER} {
    content: none;
    display: none;
    background: none;
    box-shadow: none;
  }
  ${QUIET_HEADER_BOX} {
    background: transparent;
    color: inherit;
    border-radius: 0;
    margin: 0;
    padding-block: 0 4px;
    border-bottom: 1px solid var(--ew-color-border-subtle);
    box-shadow: none;
  }
  [data-density="compact"] .ew-card,
  [data-era][data-density="compact"] .ew-card {
    padding: var(--ew-card-pad, 10px);
  }
  [data-density="compact"] :is(.ew-card__header, .ew-card__body, .ew-card__footer) {
    padding: var(--ew-card-pad, 10px);
  }
  [data-era] .ew-card[data-variant="flat"]:not(.ew-feature) {
    border-color: transparent;
    box-shadow: none;
    background-image: none;
    clip-path: none;
    background: transparent;
  }
  [data-era] .ew-card[data-variant="outline"]:not(.ew-feature) {
    box-shadow: none;
    background-image: none;
    clip-path: none;
    background: transparent;
    border: 2px solid var(--ew-color-border-strong);
  }
  [data-era] .ew-card[data-variant="inset"]:not(.ew-feature) {
    background-image: none;
    clip-path: none;
    box-shadow: inset 0 0 0 2px var(--ew-color-border-subtle);
    background: color-mix(in oklch, var(--ew-color-bg-page) 86%, var(--ew-color-fg-default));
  }
}`;
}

function densityCss(cls) {
  return `  .${cls} { display: contents; }
  .ew-title--page { font-family: var(--ew-font-display, inherit); font-size: clamp(1.5rem, 2.2vw, 2rem); line-height: 1.15; margin: 0; overflow-wrap: anywhere; }
  .ew-title--section { font-family: var(--ew-font-display, inherit); font-size: clamp(1.15rem, 1.5vw, 1.4rem); line-height: 1.2; margin: 0; overflow-wrap: anywhere; }
  .ew-title--panel { font-family: var(--ew-font-body, system-ui, sans-serif); font-size: 1rem; font-weight: 700; line-height: 1.3; margin: 0; overflow-wrap: anywhere; }
  [data-density="comfortable"] { --ew-row-min: 48px; --ew-card-padding: 16px; --ew-card-pad: 16px; }
  [data-density="compact"] { --ew-row-min: 36px; --ew-card-padding: 10px; --ew-card-pad: 10px; --ew-card-gap: 6px; --ew-structure-card-ornament-opacity: 0; }
  [data-density="compact"] :is(.ew-title--page, h1.ew-title) { font-size: 1.25rem; }
  [data-density="compact"] .ew-title--section { font-size: 1rem; }
  .ew-list-item[aria-selected="true"], .ew-list-item.is-selected,
  .ew-card[aria-selected="true"], .ew-card.is-selected,
  .ew-table tr[aria-selected="true"], .ew-table tr.is-selected,
  .ew-media-card[aria-selected="true"], .ew-media-card.is-selected {
    font-weight: 700;
    box-shadow: inset 3px 0 0 var(--ew-color-action-bg);
    background: color-mix(in oklch, var(--ew-color-action-bg) 16%, var(--ew-color-bg-surface));
  }
  :is(.ew-nav-rail__item, .ew-pagination__page)[aria-current="page"],
  :is(.ew-nav-rail__item, .ew-pagination__page)[aria-current="true"] {
    font-weight: 700;
    box-shadow: inset 3px 0 0 var(--ew-color-action-bg);
  }
  .ew-list-item.is-unread { font-weight: 700; }
  .ew-list-item.is-unread::before {
    content: "";
    width: 8px; height: 8px; flex: 0 0 auto; border-radius: 999px;
    background: var(--ew-color-action-bg);
  }
  :is(.ew-list-item, .ew-nav-rail__item, .ew-table tbody tr, .ew-media-card):hover {
    background: color-mix(in oklch, var(--ew-color-action-bg) 10%, var(--ew-color-bg-surface));
  }
  :is(.ew-list-item, .ew-nav-rail__item, .ew-pagination__page, .ew-chip, .ew-media-card):focus-visible {
    outline: 2px solid var(--ew-color-field-focus);
    outline-offset: 2px;
  }
  :is(.ew-button, .ew-text-field, .ew-list, .ew-card)[aria-busy="true"] { cursor: progress; }
  :is(.ew-button, .ew-text-field__control, .ew-list-item, .ew-card)[aria-disabled="true"],
  :is(.ew-button, .ew-text-field__control):disabled { opacity: 0.55; cursor: not-allowed; }
  .is-empty { color: var(--ew-color-fg-muted); }`;
}

function listCss(cls) {
  return `  .${cls} { display: flex; flex-direction: column; min-width: 0; margin: 0; padding: 0; list-style: none; }
  .${cls}-item, .ew-list-item {
    display: flex; align-items: center; gap: 8px; min-width: 0; width: 100%;
    min-height: var(--ew-row-min, 44px); padding: 6px 10px; margin: 0;
    border: 0; background: transparent; color: inherit; font: inherit; text-align: start;
    text-decoration: none; box-sizing: border-box;
  }
  .ew-list-item__lead, .ew-list-item__meta { flex: 0 0 auto; }
  .ew-list-item__main { min-width: 0; flex: 1 1 auto; display: grid; }
  .ew-list-item__primary, .ew-list-item__secondary {
    min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ew-list-item__secondary { color: var(--ew-color-fg-muted); font-size: 0.85em; font-weight: 400; }
  .ew-list-item.is-selected .ew-list-item__secondary,
  .ew-list-item[aria-selected="true"] .ew-list-item__secondary,
  .ew-list-item.is-selected .ew-list-item__meta,
  .ew-list-item[aria-selected="true"] .ew-list-item__meta { color: var(--ew-color-fg-default); }
  .ew-list-item__meta { color: var(--ew-color-fg-muted); font-size: 0.8em; font-variant-numeric: tabular-nums; }
  [data-density="compact"] .ew-list-item { min-height: 36px; padding-block: 4px; }`;
}

function navCss(cls) {
  return `  .${cls} { display: flex; flex-direction: column; gap: 2px; min-width: 0; margin: 0; padding: 8px; list-style: none; }
  .${cls}__item {
    display: flex; align-items: center; gap: 8px; min-width: 0; min-height: var(--ew-row-min, 40px);
    padding: 6px 8px; border-radius: var(--ew-structure-control-radius, 8px);
    color: inherit; text-decoration: none; font: inherit;
  }
  .${cls}__icon { flex: 0 0 auto; width: 1.25rem; height: 1.25rem; display: inline-grid; place-items: center; }
  .${cls}__label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1 1 auto; }
  .${cls}__group { margin: 8px 0 0; padding: 0; border: 0; min-width: 0; }
  .${cls}__group summary { cursor: pointer; font-weight: 700; padding: 6px 8px; }
  .${cls}[data-collapsed="true"] { width: 56px; }
  .${cls}[data-collapsed="true"] .${cls}__item { position: relative; justify-content: center; }
  .${cls}[data-collapsed="true"] .${cls}__label,
  .${cls}[data-collapsed="true"] .${cls}__group summary,
  .${cls}[data-collapsed="true"] .ew-badge { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .${cls}[data-collapsed="true"] .${cls}__item:is(:hover, :focus-visible)::after {
    content: attr(data-label);
    position: absolute; left: calc(100% + 8px); top: 50%; transform: translateY(-50%); z-index: 6;
    padding: 4px 8px; border-radius: 4px; white-space: nowrap;
    background: var(--ew-color-fg-default); color: var(--ew-color-bg-page);
    font: 600 0.75rem/1.2 var(--ew-font-body, system-ui, sans-serif);
  }`;
}

function badgeCss(cls) {
  return `  .${cls} {
    display: inline-flex; align-items: center; justify-content: center; min-width: 1.25rem; height: 1.25rem;
    padding: 0 6px; border-radius: 999px; font: 700 0.75rem/1 var(--ew-font-body, system-ui, sans-serif);
    background: var(--ew-color-action-bg); color: var(--ew-color-action-fg, #fff); vertical-align: middle;
  }
  .${cls}[data-variant="dot"] { width: 8px; height: 8px; min-width: 8px; padding: 0; border-radius: 999px; }
  .${cls}[data-variant="neutral"] { background: var(--ew-color-bg-surface); color: var(--ew-color-fg-default); box-shadow: inset 0 0 0 1px var(--ew-color-border-strong); }`;
}

function chipCss(cls) {
  return `  .${cls} {
    display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-width: 0;
    min-height: 32px; padding: 4px 10px; border-radius: 999px;
    border: 1px solid var(--ew-color-border-strong); background: var(--ew-color-bg-surface);
    color: var(--ew-color-fg-default); font: inherit; cursor: pointer;
  }
  .${cls}[aria-pressed="true"] { font-weight: 700; box-shadow: inset 0 -2px 0 var(--ew-color-action-bg); }
  .${cls}__remove { border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; padding: 0 2px; }
  .${cls}:disabled, .${cls}[aria-disabled="true"] { opacity: 0.55; cursor: not-allowed; }`;
}

function toolbarCss(cls) {
  return `  .${cls} {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; max-width: 100%;
    padding: 8px 12px; box-sizing: border-box;
  }
  .${cls}__start, .${cls}__end { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1 1 auto; }
  .${cls}__end { justify-content: flex-end; flex-wrap: wrap; }
  .${cls}__center { display: flex; justify-content: center; min-width: 0; flex: 0 1 auto; }
  .${cls}[data-sticky="true"] { position: sticky; top: 0; z-index: 5; background: var(--ew-color-bg-page); }
  .${cls}__overflow { margin-inline-start: auto; }`;
}

function searchCss(cls) {
  return `  .${cls} { display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1 1 12rem; max-width: 100%; position: relative; }
  .${cls}__icon { flex: 0 0 auto; width: 1rem; height: 1rem; color: var(--ew-color-fg-muted); }
  .${cls}:not(:has(.${cls}__icon))::before {
    content: ""; flex: 0 0 auto; width: 0.7rem; height: 0.7rem; border: 2px solid currentColor; border-radius: 999px;
    box-shadow: 0.35rem 0.35rem 0 -0.28rem currentColor; color: var(--ew-color-fg-muted);
  }
  .${cls}__control { min-width: 0; flex: 1 1 8rem; width: 100%; }
  .${cls}__clear, .${cls}__scope { flex: 0 0 auto; }
  .${cls}__clear[hidden] { display: none; }`;
}

function pageCss(cls) {
  return `  .${cls} { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-width: 0; margin: 0; padding: 0; list-style: none; }
  .${cls}__page, .${cls}__prev, .${cls}__next {
    display: inline-flex; align-items: center; justify-content: center; min-width: 32px; min-height: 32px;
    padding: 4px 8px; border: 0; background: transparent; color: inherit; font: inherit; text-decoration: none; cursor: pointer;
  }
  .${cls}[data-compact="true"] .${cls}__page:not([aria-current="page"]) { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }`;
}

function tableCss(cls) {
  return `  .${cls} { width: 100%; max-width: 100%; border-collapse: collapse; font: inherit; }
  .${cls} caption { text-align: start; font-weight: 700; padding: 8px 0; }
  .${cls} th, .${cls} td { min-width: 0; padding: 8px; text-align: start; border-bottom: 1px solid var(--ew-color-border-subtle); overflow-wrap: anywhere; }
  .${cls} th { font-weight: 700; }
  .${cls} th[aria-sort] { cursor: pointer; }
  .${cls} th[aria-sort="ascending"]::after { content: " \\2191"; }
  .${cls} th[aria-sort="descending"]::after { content: " \\2193"; }
  .${cls}[data-zebra="true"] tbody tr:nth-child(even) { background: color-mix(in oklch, var(--ew-color-fg-default) 5%, transparent); }
  .${cls}-scroll { max-width: 100%; overflow-x: auto; }
  @media (max-width: 600px) {
    .${cls}[data-responsive="stack"] thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
    .${cls}[data-responsive="stack"] tr { display: grid; border-bottom: 1px solid var(--ew-color-border-subtle); }
    .${cls}[data-responsive="stack"] td { display: grid; grid-template-columns: minmax(0, 8rem) minmax(0, 1fr); border: 0; }
    .${cls}[data-responsive="stack"] td::before { content: attr(data-label); font-weight: 700; }
  }`;
}

function meterCss(cls) {
  return `  .${cls}, .ew-progress { display: grid; gap: 4px; min-width: 0; }
  .${cls}__label, .ew-progress__label { font: 600 0.85rem/1.3 var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__bar, progress.ew-progress__bar {
    appearance: none; width: 100%; height: 8px; border: 0; border-radius: 999px;
    background: var(--ew-color-border-subtle); color: var(--ew-color-action-bg);
  }
  .${cls}__bar::-webkit-meter-bar { background: var(--ew-color-border-subtle); border-radius: 999px; }
  .${cls}__bar::-webkit-meter-optimum-value { background: var(--ew-color-action-bg); }
  progress.ew-progress__bar::-webkit-progress-bar { background: var(--ew-color-border-subtle); border-radius: 999px; }
  progress.ew-progress__bar::-webkit-progress-value { background: var(--ew-color-action-bg); border-radius: 999px; }
  progress.ew-progress__bar::-moz-progress-bar { background: var(--ew-color-action-bg); }
  .${cls}__radial {
    width: 36px; height: 36px; border-radius: 50%;
    background: conic-gradient(var(--ew-color-action-bg) calc(var(--ew-meter-value, 40) * 1%), var(--ew-color-border-subtle) 0);
  }`;
}

function statCss(cls) {
  return `  .${cls} { display: grid; gap: 4px; min-width: 0; }
  .${cls}__value { font: 700 clamp(1.4rem, 2vw, 2rem)/1.1 var(--ew-font-body, system-ui, sans-serif); margin: 0; font-variant-numeric: tabular-nums; }
  .${cls}__label { color: var(--ew-color-fg-muted); margin: 0; }
  .${cls}__delta { font-weight: 700; }
  .${cls}__delta[data-dir="up"]::before { content: "\\25B2\\00a0"; }
  .${cls}__delta[data-dir="down"]::before { content: "\\25BC\\00a0"; }
  .${cls}__spark { min-width: 0; height: 28px; }`;
}

function mediaCss(cls) {
  return `  .${cls} {
    display: grid; min-width: 0; position: relative; overflow: hidden; padding: 0;
    background: var(--ew-color-bg-surface); color: inherit; text-decoration: none;
  }
  .${cls}[data-ratio="poster"] { aspect-ratio: 2 / 3; }
  .${cls}[data-ratio="wide"] { aspect-ratio: 16 / 9; }
  .${cls}__media { width: 100%; height: 100%; object-fit: cover; }
  .${cls}__title {
    position: absolute; inset: auto 0 0 0; margin: 0; padding: 28px 10px 10px;
    background: linear-gradient(transparent, color-mix(in oklch, var(--ew-color-bg-page) 88%, transparent));
    font: 700 0.95rem/1.2 var(--ew-font-body, system-ui, sans-serif);
  }
  .${cls}__progress { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: var(--ew-color-action-bg); transform-origin: left; }
  .${cls}:hover, .${cls}:focus-visible { transform: translateY(-2px); }
  @media (prefers-reduced-motion: reduce) {
    .${cls}:hover, .${cls}:focus-visible { transform: none; }
  }`;
}

function shelfCss(cls) {
  return `  .${cls} { min-width: 0; }
  .${cls}__title { margin: 0 0 8px; }
  .${cls}__row {
    display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory;
    padding-bottom: 8px; max-width: 100%;
  }
  .${cls}__row > * { flex: 0 0 auto; scroll-snap-align: start; width: min(180px, 70vw); }`;
}

function codeCss(cls) {
  return `  .${cls}, code.${cls} {
    font-family: var(--ew-font-mono, ui-monospace, monospace); font-size: 0.9em;
    background: var(--ew-color-bg-surface); padding: 0.1em 0.35em; border-radius: 4px;
  }
  pre.${cls}, ew-code.${cls} { display: grid; gap: 8px; margin: 0; padding: 12px; overflow-x: auto; max-width: 100%; white-space: pre; }
  .${cls}__copy { justify-self: end; }`;
}

function emptyCss(cls) {
  return `  .${cls} { display: grid; justify-items: start; gap: 8px; min-width: 0; padding: 24px 8px; color: var(--ew-color-fg-muted); }
  .${cls}__title { margin: 0; color: var(--ew-color-fg-default); font: 700 1rem/1.3 var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__body { margin: 0; max-width: 42ch; }`;
}

function skeletonCss(cls) {
  return `  .${cls} {
    display: block; min-width: 0; height: 1em; border-radius: 6px;
    background: linear-gradient(90deg, var(--ew-color-border-subtle), var(--ew-color-bg-surface), var(--ew-color-border-subtle));
    background-size: 200% 100%;
    animation: ew-skeleton 1.2s ease-in-out infinite;
  }
  .${cls}[data-variant="block"] { height: 96px; }
  @keyframes ew-skeleton { from { background-position: 100% 0; } to { background-position: -100% 0; } }
  @media (prefers-reduced-motion: reduce) { .${cls} { animation: none; } }`;
}

function segmentedCss(cls) {
  return `  .${cls} { display: inline-flex; flex-wrap: nowrap; overflow-x: auto; min-width: 0; max-width: 100%; padding: 2px; gap: 2px; border: 1px solid var(--ew-color-border-subtle); border-radius: var(--ew-structure-control-radius, 8px); }
  .${cls}__item {
    flex: 0 0 auto; white-space: nowrap; min-height: 32px; padding: 4px 10px; border: 0; background: transparent; color: inherit; font: inherit; cursor: pointer;
  }
  .${cls}__item[aria-checked="true"], .${cls} :checked + .${cls}__item {
    font-weight: 700; background: var(--ew-color-bg-surface); box-shadow: inset 0 -2px 0 var(--ew-color-action-bg);
  }`;
}

function productCss(cls) {
  return `  .${cls} {
    display: grid; grid-template-rows: auto minmax(2.6em, auto) auto auto; align-content: start;
    min-width: 0; height: 100%; position: relative; overflow: hidden;
    background: var(--ew-color-bg-surface); color: inherit;
    border: 1px solid var(--ew-color-border-subtle); padding: 0;
  }
  .${cls}__media { aspect-ratio: 1; background: color-mix(in oklch, var(--ew-color-action-bg) 18%, var(--ew-color-bg-page)); position: relative; }
  .${cls}[data-ratio="wide"] .${cls}__media { aspect-ratio: 4 / 3; }
  .${cls}__media img { width: 100%; height: 100%; object-fit: cover; }
  .${cls}__watch { position: absolute; top: 8px; inset-inline-end: 8px; }
  .${cls}__title {
    margin: 8px 10px 0; min-width: 0; min-height: 2.6em; max-height: 2.6em;
    font: 600 0.95rem/1.3 var(--ew-font-body, system-ui, sans-serif);
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2;
    overflow: hidden; text-transform: none; letter-spacing: normal;
  }
  .${cls}__price { margin: 6px 10px 0; }
  .${cls}__meta { margin: 2px 10px 10px; color: var(--ew-color-fg-muted); font-size: 0.8rem; }
  .${cls}.is-selected { box-shadow: inset 0 0 0 2px var(--ew-color-action-bg); }
  .${cls}:hover, .${cls}:focus-within { transform: translateY(-2px); }
  @media (prefers-reduced-motion: reduce) { .${cls}:hover, .${cls}:focus-within { transform: none; } }`;
}

function priceCss(cls) {
  return `  .${cls} { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; margin: 0; font-variant-numeric: tabular-nums; font-weight: 800; color: var(--ew-color-action-bg); font-family: var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__was { color: var(--ew-color-fg-muted); font-weight: 500; text-decoration: line-through; }
  .${cls}__note { color: var(--ew-color-fg-muted); font-size: 0.75rem; font-weight: 600; }`;
}

function ratingCss(cls) {
  return `  .${cls} { display: inline-flex; align-items: center; gap: 4px; font: 600 0.8rem/1 var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__stars { letter-spacing: 0.08em; }
  .${cls}__stars::before { content: "\\2605\\2605\\2605\\2605\\2606"; }
  .${cls}__count { color: var(--ew-color-fg-muted); }`;
}

function countdownCss(cls) {
  return `  .${cls} { font-variant-numeric: tabular-nums; font-weight: 700; }
  .${cls}[data-urgent="true"] { font-weight: 800; }
  .${cls}[data-urgent="true"]::before { content: "\\25B6\\00a0"; }`;
}

function filterCss(cls) {
  return `  .${cls} { margin: 0 0 8px; min-width: 0; border-bottom: 1px solid var(--ew-color-border-subtle); }
  .${cls} summary { cursor: pointer; font-weight: 700; padding: 8px 0; }
  .${cls}__row { display: flex; justify-content: space-between; gap: 8px; min-width: 0; padding: 4px 0; }
  .${cls}__more { background: none; border: 0; color: inherit; font: inherit; text-decoration: underline; cursor: pointer; }`;
}

function splitCss(cls) {
  return `  .${cls} { display: grid; grid-template-columns: var(--ew-split-track, minmax(0, 1.15fr) minmax(280px, 0.9fr)); gap: 12px; align-items: start; min-width: 0; max-width: 100%; }
  .${cls}__side, .${cls}__main { min-width: 0; max-width: 100%; }
  @media (max-width: 800px) { .${cls} { grid-template-columns: minmax(0, 1fr); } }`;
}

function sheetCss(cls) {
  return `  .${cls} { min-width: 0; max-width: 100%; background: var(--ew-color-bg-surface); color: inherit; border: 1px solid var(--ew-color-border-subtle); }
  .${cls}__head { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-width: 0; padding: var(--ew-card-pad, 12px); border-bottom: 1px solid var(--ew-color-border-subtle); }
  .${cls}__body { min-width: 0; padding: var(--ew-card-pad, 12px); }
  @media (max-width: 600px) {
    .${cls}[data-variant="mobile"] { position: fixed; inset: auto 0 0 0; z-index: 20; max-height: 85vh; overflow: auto; border-radius: 12px 12px 0 0; }
  }`;
}

function typingCss(cls) {
  return `  .${cls} { display: inline-flex; gap: 4px; align-items: center; min-height: 24px; }
  .${cls} i {
    width: 6px; height: 6px; border-radius: 999px; background: var(--ew-color-fg-muted);
    animation: ew-typing 1s ease-in-out infinite;
  }
  .${cls} i:nth-child(2) { animation-delay: 0.15s; }
  .${cls} i:nth-child(3) { animation-delay: 0.3s; }
  @keyframes ew-typing { 50% { transform: translateY(-3px); } }
  @media (prefers-reduced-motion: reduce) {
    .${cls} i { animation: none; opacity: 0.8; }
  }`;
}
