const HEADER = '/* GENERATED FILE — do not edit. Source: spec/. Run: pnpm gen */\n';

/** Emit variant/size hooks from the component spec so CSS stays spec-driven. */
function specDrivenHooks(comp) {
  const cls = comp.className;
  const lines = [];
  for (const [key, def] of Object.entries(comp.variants || {})) {
    const attr = def.attribute || `data-${key}`;
    for (const value of def.values || []) {
      lines.push(`  /* spec variant ${key}=${value} */`);
      lines.push(`  .${cls}[${attr}="${value}"] { --ew-spec-variant-${key}: ${value}; }`);
    }
    if (def.default) {
      lines.push(`  .${cls}:not([${attr}]) { --ew-spec-variant-${key}: ${def.default}; }`);
    }
  }
  if (comp.sizes?.values) {
    const attr = comp.sizes.attribute || 'data-size';
    for (const value of comp.sizes.values) {
      lines.push(`  .${cls}[${attr}="${value}"] { --ew-spec-size: ${value}; }`);
    }
    if (comp.sizes.default) {
      lines.push(`  .${cls}:not([${attr}]) { --ew-spec-size: ${comp.sizes.default}; }`);
    }
  }
  return lines.join('\n');
}

function reducedMotionBlock(cls) {
  return `  @media (prefers-reduced-motion: reduce) {
    .${cls}, .${cls} *, .${cls} *::before, .${cls} *::after {
      transition: none !important;
      animation: none !important;
    }
  }`;
}

export function genComponentCss(comp) {
  const cls = comp.className;
  const lines = [
    HEADER,
    `@layer components {`,
    `  .${cls} {`,
    `    /* anatomy: ${comp.anatomy.map((a) => a.part).join(', ')} */`,
    `  }`,
  ];

  const body = {
    button: buttonCss,
    'text-field': textFieldCss,
    card: cardCss,
    dialog: dialogCss,
    tabs: tabsCss,
    switch: switchCss,
    checkbox: checkboxCss,
    radio: radioCss,
    textarea: textareaCss,
    select: selectCss,
    slider: sliderCss,
    menu: menuCss,
    popover: popoverCss,
    tooltip: tooltipCss,
    toast: toastCss,
    alert: alertCss,
    'icon-button': iconButtonCss,
    link: linkCss,
    avatar: avatarCss,
    breadcrumb: breadcrumbCss,
    'ornament-divider': ornamentDividerCss,
  }[comp.id];

  if (body) lines.push(body(cls));
  else lines.push(`  /* stub styles for ${comp.id} */`);

  const hooks = specDrivenHooks(comp);
  if (hooks) lines.push(hooks);
  lines.push(reducedMotionBlock(cls));

  lines.push(`}`);
  return lines.join('\n') + '\n';
}

function buttonCss(cls) {
  return `  .${cls} {
    --_btn-radius: var(--ew-structure-control-radius, var(--ew-button-radius, 8px));
    --_btn-border-w: var(--ew-structure-button-border-width, 1px);
    --_btn-border-style: var(--ew-structure-button-border-style, solid);
    --_btn-shadow: var(--ew-structure-button-shadow, none);
    --_btn-clip: var(--ew-structure-button-clip, none);
    --_btn-bevel: var(--ew-structure-button-bevel, none);
    display: inline-flex;
    align-items: center;
    align-self: center;
    justify-content: center;
    flex: 0 0 auto;
    height: auto;
    max-height: none;
    gap: var(--ew-button-gap, 8px);
    padding: var(--ew-structure-button-padding-y, var(--ew-button-padding-y, 8px)) var(--ew-structure-button-padding-x, var(--ew-button-padding-x, 16px));
    border: var(--_btn-border-w) var(--_btn-border-style) var(--ew-color-border-strong, currentColor);
    border-radius: var(--_btn-radius);
    clip-path: var(--_btn-clip);
    background: var(--ew-color-action-bg, #334);
    color: var(--ew-color-action-fg, #fff);
    font-size: var(--ew-button-font-size, 14px);
    font-family: var(--ew-font-body, system-ui, sans-serif);
    font-weight: var(--ew-structure-button-font-weight, 600);
    letter-spacing: var(--ew-structure-button-letter-spacing, 0);
    text-transform: var(--ew-structure-button-text-transform, none);
    text-decoration: none;
    box-shadow: var(--_btn-bevel), var(--_btn-shadow);
    cursor: pointer;
    transition: background 120ms ease, box-shadow 120ms ease, transform 120ms ease;
  }
  .${cls}:hover { background: var(--ew-color-action-hover, #223); }
  .${cls}:active { transform: translateY(1px); }
  .${cls}:focus-visible { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 2px; }
  .${cls}:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .${cls}[data-variant="secondary"] {
    background: transparent;
    color: var(--ew-color-fg-default, inherit);
    border-color: var(--ew-color-border-strong, currentColor);
  }
  .${cls}[data-variant="ghost"] {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    color: var(--ew-color-fg-default, inherit);
  }
  .${cls}[data-variant="danger"] {
    background: var(--ew-color-danger-bg, #a33);
    color: var(--ew-color-danger-fg, #fff);
    border-color: var(--ew-color-danger-bg, #a33);
  }
  .${cls}[data-size="sm"] { padding: 6px 12px; font-size: 14px; min-height: 24px; }
  .${cls}[data-size="lg"] { padding: 12px 22px; font-size: 16px; }
  @media (prefers-reduced-motion: reduce) { .${cls} { transition: none; } }`;
}

function textFieldCss(cls) {
  return `  .${cls} {
    display: grid;
    gap: 6px;
    min-width: 0;
    max-width: 100%;
    flex: 1 1 12rem;
    font-family: var(--ew-font-body, system-ui, sans-serif);
  }
  .${cls}__label { color: var(--ew-color-fg-default, inherit); font-size: 14px; font-weight: 600; }
  .${cls}__control {
    padding: var(--ew-field-padding-y, 8px) var(--ew-field-padding-x, 12px);
    border: var(--ew-structure-field-border-width, 1px) var(--ew-structure-field-border-style, solid) var(--ew-color-field-border, #888);
    border-radius: var(--ew-structure-field-radius, var(--ew-radius-md, 8px));
    background: var(--ew-color-field-bg, #fff);
    color: var(--ew-color-fg-default, inherit);
    font: inherit;
    box-shadow: var(--ew-structure-field-shadow, none);
    min-width: 0;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  .${cls}[data-variant="filled"] .${cls}__control {
    background: color-mix(in oklch, var(--ew-color-bg-surface) 80%, var(--ew-color-fg-default));
    border-color: transparent;
  }
  .${cls}[data-variant="underline"] .${cls}__control,
  .${cls}:where([data-underline="true"]) .${cls}__control {
    border-radius: 0;
    border-width: 0 0 var(--ew-structure-field-border-width, 2px) 0;
    background: transparent;
  }
  .${cls}__control:focus-visible { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 1px; }
  .${cls}__description, .${cls}__error { font-size: 14px; color: var(--ew-color-fg-muted, #666); }
  .${cls}[data-invalid="true"] .${cls}__error, .${cls}__error { color: var(--ew-color-danger-bg, #a33); }
  .${cls}[data-size="sm"] .${cls}__control { padding: 6px 8px; font-size: 14px; }
  .${cls}[data-size="lg"] .${cls}__control { padding: 12px 14px; font-size: 16px; }`;
}

function cardCss(cls) {
  return `  .${cls} {
    --_card-radius: var(--ew-structure-surface-radius, var(--ew-card-radius, 12px));
    --_card-border-w: var(--ew-structure-card-border-width, 1px);
    --_card-border-style: var(--ew-structure-card-border-style, solid);
    --_card-shadow: var(--ew-structure-card-shadow, var(--ew-elevation-1, none));
    --_card-clip: var(--ew-structure-card-clip, none);
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
    align-content: start;
    align-items: start;
    min-width: 0;
    max-width: 100%;
    gap: var(--ew-card-gap, 12px);
    padding: var(--ew-structure-card-padding, var(--ew-card-padding, 16px));
    border: var(--_card-border-w) var(--_card-border-style) var(--ew-color-border-subtle, #ccc);
    border-radius: var(--_card-radius);
    clip-path: var(--_card-clip);
    background: var(--ew-color-bg-surface, #f6f6f6);
    color: var(--ew-color-fg-default, inherit);
    box-shadow: var(--_card-shadow);
    font-family: var(--ew-font-body, system-ui, sans-serif);
    overflow: clip;
  }
  .${cls}[data-variant="raised"] {
    box-shadow: var(--ew-structure-card-raised-shadow, var(--ew-elevation-2, none));
    background: var(--ew-color-bg-elevated, #fff);
  }
  .${cls}[data-variant="outline"] { box-shadow: none; }
  .${cls}[data-variant="flat"] { border-color: transparent; box-shadow: none; }
  .${cls}[data-variant="inset"] { box-shadow: inset 0 1px 2px color-mix(in oklch, black 12%, transparent); }
  .${cls} > * { min-width: 0; max-width: 100%; }
  .${cls}__header { display: grid; gap: 8px; min-width: 0; }
  .${cls}__header :is(h1, h2, h3, h4), .${cls}__title {
    margin: 0;
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
    font-family: var(--ew-font-display, inherit);
    letter-spacing: var(--ew-structure-card-title-tracking, 0);
  }
  .${cls}__title--truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: normal;
  }
  .${cls}[data-header-rule="true"] .${cls}__header::after {
    content: "";
    display: var(--ew-structure-card-header-rule-display, none);
    height: 2px;
    width: 100%;
    background: var(--ew-structure-card-header-rule, var(--ew-color-border-strong));
  }
  .${cls}__body { margin: 0; }
  .${cls}__footer { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; align-self: start; }
  .${cls}__footer .ew-button, .${cls} .ew-button { align-self: center; height: auto; flex: 0 0 auto; }
  .${cls}::before {
    content: var(--ew-structure-card-ornament-content, none);
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: var(--ew-structure-card-ornament-opacity, 0);
    background: var(--ew-structure-card-ornament-bg, none);
    background-size: var(--ew-structure-card-ornament-size, auto);
    mix-blend-mode: var(--ew-structure-card-ornament-blend, normal);
  }
  .${cls} > * { position: relative; z-index: 1; }`;
}

function dialogCss(cls) {
  return `  .${cls} {
    border: var(--ew-structure-dialog-border-width, 1px) var(--ew-structure-dialog-border-style, solid) var(--ew-color-border-strong, #888);
    border-radius: var(--ew-structure-dialog-radius, var(--ew-dialog-radius, 12px));
    clip-path: var(--ew-structure-dialog-clip, none);
    padding: var(--ew-dialog-padding, 24px);
    max-width: var(--ew-dialog-max-width, 420px);
    width: calc(100% - 32px);
    background: var(--ew-color-bg-elevated, #fff);
    color: var(--ew-color-fg-default, inherit);
    box-shadow: var(--ew-structure-dialog-shadow, var(--ew-elevation-dialog, none));
    font-family: var(--ew-font-body, system-ui, sans-serif);
  }
  .${cls}::backdrop { background: var(--ew-color-overlay, rgb(0 0 0 / 0.45)); }
  .${cls}__header h2 {
    margin: 0 0 12px;
    font-family: var(--ew-font-display, inherit);
    letter-spacing: var(--ew-structure-card-title-tracking, 0);
  }
  .${cls}__body { margin: 0; }
  .${cls}__footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; flex-wrap: wrap; }
  .${cls}__close {
    position: absolute;
    top: 12px;
    inset-inline-end: 12px;
  }
  .${cls}--sm, .${cls}[data-size="sm"] { max-width: min(320px, calc(100vw - 32px)); }
  .${cls}--md, .${cls}[data-size="md"] { max-width: min(420px, calc(100vw - 32px)); }
  .${cls}--lg, .${cls}[data-size="lg"] { max-width: min(720px, calc(100vw - 32px)); }
  @media (max-width: 600px) {
    .${cls}--fullscreen-mobile, .${cls}[data-size="fullscreen-mobile"] {
      width: 100%;
      max-width: 100%;
      max-height: min(92vh, 100%);
      margin: auto 0 0;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .${cls}, .${cls}::backdrop { transition: none; }
  }`;
}

function tabsCss(cls) {
  return `  .${cls}, ${cls.includes('ew-tabs') ? 'ew-tabs' : 'ew-tabs'} {
    display: grid;
    gap: 12px;
    font-family: var(--ew-font-body, system-ui, sans-serif);
    color: var(--ew-color-fg-default, inherit);
  }
  .${cls} [role="tablist"], ew-tabs [role="tablist"] {
    display: flex;
    gap: var(--ew-tabs-gap, 8px);
    border-bottom: 1px solid var(--ew-color-border-subtle, #ccc);
    position: relative;
  }
  .${cls}[data-variant="enclosed"] [role="tablist"],
  ew-tabs[data-variant="enclosed"] [role="tablist"] {
    border: var(--ew-structure-button-border-width, 1px) solid var(--ew-color-border-subtle);
    border-radius: var(--ew-structure-tabs-radius, 0);
    padding: 4px;
    border-bottom-width: 1px;
  }
  .${cls}[data-variant="pills"] [role="tablist"],
  ew-tabs[data-variant="pills"] [role="tablist"] {
    border-bottom: 0;
    gap: 6px;
  }
  .${cls}[data-orientation="vertical"],
  ew-tabs[data-orientation="vertical"] {
    grid-template-columns: max-content 1fr;
    align-items: start;
  }
  .${cls}[data-orientation="vertical"] [role="tablist"],
  ew-tabs[data-orientation="vertical"] [role="tablist"] {
    flex-direction: column;
    border-bottom: 0;
    border-inline-end: 1px solid var(--ew-color-border-subtle, #ccc);
  }
  .${cls} [role="tab"], ew-tabs [role="tab"] {
    appearance: none;
    background: transparent;
    border: 0;
    border-bottom: var(--ew-structure-tabs-indicator-height, 2px) var(--ew-structure-tabs-indicator-style, solid) transparent;
    border-radius: var(--ew-structure-tabs-radius, 0);
    padding: 8px 12px;
    color: var(--ew-color-fg-muted, #666);
    font: inherit;
    font-weight: 600;
    letter-spacing: var(--ew-structure-button-letter-spacing, 0);
    text-transform: var(--ew-structure-button-text-transform, none);
    cursor: pointer;
  }
  .${cls}[data-variant="pills"] [role="tab"],
  ew-tabs[data-variant="pills"] [role="tab"] {
    border-bottom: 0;
    background: transparent;
  }
  .${cls} [role="tab"][aria-selected="true"],
  ew-tabs [role="tab"][aria-selected="true"] {
    color: var(--ew-color-fg-default, inherit);
    border-bottom-color: var(--ew-color-action-bg, currentColor);
  }
  .${cls}[data-variant="pills"] [role="tab"][aria-selected="true"],
  ew-tabs[data-variant="pills"] [role="tab"][aria-selected="true"] {
    background: var(--ew-color-action-bg);
    color: var(--ew-color-action-fg);
  }
  .${cls} [role="tab"]:focus-visible,
  ew-tabs [role="tab"]:focus-visible {
    outline: 2px solid var(--ew-color-field-focus, Highlight);
    outline-offset: 2px;
  }
  .${cls} [role="tabpanel"], ew-tabs [role="tabpanel"] {
    color: var(--ew-color-fg-default, inherit);
  }
  .${cls} [data-slot="indicator"], ew-tabs [data-slot="indicator"] {
    display: var(--ew-structure-tabs-indicator-display, none);
  }`;
}

function switchCss(cls) {
  return `  .${cls} {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--ew-font-body, system-ui, sans-serif);
    cursor: pointer;
    position: relative;
  }
  .${cls}__control {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }
  .${cls}__track {
    width: var(--ew-switch-track-width, 44px);
    height: var(--ew-switch-track-height, 24px);
    border-radius: var(--ew-structure-switch-track-radius, var(--ew-radius-pill, 999px));
    background: var(--ew-color-track-off, #ccc);
    display: inline-flex;
    align-items: center;
    padding: 3px;
    box-shadow: var(--ew-structure-switch-shadow, none);
    border: var(--ew-structure-button-border-width, 0) solid var(--ew-color-border-subtle);
    transition: background var(--ew-motion-switch, 160ms) ease;
  }
  .${cls}__thumb {
    width: var(--ew-switch-thumb-size, 18px);
    height: var(--ew-switch-thumb-size, 18px);
    border-radius: var(--ew-structure-switch-thumb-radius, 50%);
    background: var(--ew-color-bg-elevated, #fff);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.25);
    transition: transform var(--ew-motion-switch, 160ms) ease;
  }
  .${cls}__control:checked + .${cls}__track { background: var(--ew-color-track-on, #334); }
  .${cls}__control:checked + .${cls}__track .${cls}__thumb { transform: translateX(20px); }
  .${cls}__control:focus-visible + .${cls}__track { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 2px; }
  .${cls}__control:disabled + .${cls}__track { opacity: 0.5; }
  .${cls}__label { color: var(--ew-color-fg-default, inherit); }
  .${cls}[data-size="sm"] .${cls}__track { width: 36px; height: 20px; }
  .${cls}[data-size="sm"] .${cls}__thumb { width: 14px; height: 14px; }
  .${cls}[data-size="sm"] .${cls}__control:checked + .${cls}__track .${cls}__thumb { transform: translateX(16px); }
  @media (prefers-reduced-motion: reduce) {
    .${cls}__track, .${cls}__thumb { transition: none; }
  }`;
}


function checkboxCss(cls) {
  return `  .${cls} { display: inline-flex; align-items: center; gap: 10px; font-family: var(--ew-font-body, system-ui, sans-serif); cursor: pointer; position: relative; }
  .${cls}__control { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .${cls}__box {
    width: 18px; height: 18px; flex: none;
    border: var(--ew-structure-field-border-width, 1px) var(--ew-structure-field-border-style, solid) var(--ew-color-border-strong);
    border-radius: var(--ew-structure-control-radius, 4px);
    background: var(--ew-color-field-bg, #fff);
    display: inline-grid; place-items: center;
    box-shadow: var(--ew-structure-button-shadow, none);
  }
  .${cls}__box::after {
    content: ""; width: 10px; height: 6px; border: solid var(--ew-color-action-fg, #fff);
    border-width: 0 0 2px 2px; transform: rotate(-45deg) scale(0); transition: transform 120ms ease;
  }
  .${cls}__control:checked + .${cls}__box { background: var(--ew-color-action-bg); border-color: var(--ew-color-action-bg); }
  .${cls}__control:checked + .${cls}__box::after { transform: rotate(-45deg) scale(1); }
  .${cls}__control:focus-visible + .${cls}__box { outline: 2px solid var(--ew-color-field-focus); outline-offset: 2px; }
  .${cls}__label { color: var(--ew-color-fg-default); }
  @media (prefers-reduced-motion: reduce) { .${cls}__box::after { transition: none; } }`;
}

function radioCss(cls) {
  return `  .ew-radio-group { border: 0; margin: 0; padding: 0; display: grid; gap: 8px; }
  .ew-radio-group legend { font-weight: 600; margin-bottom: 4px; color: var(--ew-color-fg-default); }
  .${cls} { display: inline-flex; align-items: center; gap: 10px; font-family: var(--ew-font-body, system-ui, sans-serif); cursor: pointer; position: relative; }
  .${cls}__control { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .${cls}__disc {
    width: 18px; height: 18px; border-radius: 999px; flex: none;
    border: var(--ew-structure-field-border-width, 1px) solid var(--ew-color-border-strong);
    background: var(--ew-color-field-bg, #fff);
    display: inline-grid; place-items: center;
  }
  .${cls}__disc::after {
    content: ""; width: 8px; height: 8px; border-radius: 999px;
    background: var(--ew-color-action-bg); transform: scale(0); transition: transform 120ms ease;
  }
  .${cls}__control:checked + .${cls}__disc::after { transform: scale(1); }
  .${cls}__control:focus-visible + .${cls}__disc { outline: 2px solid var(--ew-color-field-focus); outline-offset: 2px; }
  .${cls}__label { color: var(--ew-color-fg-default); }`;
}

function textareaCss(cls) {
  return `  .${cls} { display: grid; gap: 6px; font-family: var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__label { font-size: 14px; font-weight: 600; color: var(--ew-color-fg-default); }
  .${cls}__control {
    padding: var(--ew-field-padding-y, 8px) var(--ew-field-padding-x, 12px);
    border: var(--ew-structure-field-border-width, 1px) var(--ew-structure-field-border-style, solid) var(--ew-color-field-border);
    border-radius: var(--ew-structure-field-radius, 8px);
    background: var(--ew-color-field-bg); color: var(--ew-color-fg-default); font: inherit; min-height: 96px;
  }
  .${cls}__control:focus-visible { outline: 2px solid var(--ew-color-field-focus); outline-offset: 1px; }
  .${cls}__description { font-size: 14px; color: var(--ew-color-fg-muted); }`;
}

function selectCss(cls) {
  return `  .${cls}, ew-select.${cls}, ew-select {
    display: grid; gap: 6px; font-family: var(--ew-font-body, system-ui, sans-serif); position: relative;
    min-width: 0; max-width: 100%; flex: 1 1 12rem;
  }
  .${cls}__label { font-size: 14px; font-weight: 600; color: var(--ew-color-fg-default); }
  .${cls}__control {
    appearance: none;
    padding: var(--ew-field-padding-y, 8px) 36px var(--ew-field-padding-y, 8px) var(--ew-field-padding-x, 12px);
    border: var(--ew-structure-field-border-width, 1px) var(--ew-structure-field-border-style, solid) var(--ew-color-field-border);
    border-radius: var(--ew-structure-field-radius, 8px);
    background: var(--ew-color-field-bg);
    color: var(--ew-color-fg-default); font: inherit;
    min-width: 0; max-width: 100%; width: 100%; box-sizing: border-box;
  }
  .${cls}__trigger {
    appearance: none; text-align: start; cursor: pointer; font: inherit;
    padding: var(--ew-field-padding-y, 8px) 36px var(--ew-field-padding-y, 8px) var(--ew-field-padding-x, 12px);
    border: var(--ew-structure-field-border-width, 1px) var(--ew-structure-field-border-style, solid) var(--ew-color-field-border);
    border-radius: var(--ew-structure-field-radius, 8px);
    background: var(--ew-color-field-bg); color: var(--ew-color-fg-default);
    min-width: 0; max-width: 100%; width: 100%; box-sizing: border-box;
    anchor-name: --ew-select-trigger;
  }
  .${cls}__trigger:focus-visible, .${cls}__control:focus-visible {
    outline: 2px solid var(--ew-color-field-focus); outline-offset: 1px;
  }
  .${cls}__list {
    list-style: none; margin: 0; padding: 6px;
    box-sizing: border-box;
    position: fixed;
    inset: unset;
    position-anchor: --ew-select-trigger;
    position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
    min-width: anchor-size(width);
    width: max(anchor-size(width), 12rem);
    border: var(--ew-structure-card-border-width, 1px) solid var(--ew-color-border-subtle);
    border-radius: var(--ew-structure-surface-radius, 8px);
    background: var(--ew-color-bg-elevated); color: var(--ew-color-fg-default);
    box-shadow: var(--ew-structure-card-raised-shadow, var(--ew-elevation-2));
    max-height: min(220px, 50vh); overflow: auto;
    margin: 0;
  }
  .${cls}__list:popover-open,
  .${cls}__list:not([hidden]) {
    display: block;
  }
  .${cls}__option {
    padding: 8px 10px; border-radius: 6px; cursor: pointer;
  }
  .${cls}__option[aria-selected="true"] { background: color-mix(in oklch, var(--ew-color-action-bg) 18%, transparent); }
  .${cls}__option:focus { outline: 2px solid var(--ew-color-field-focus); outline-offset: -2px; }`;
}

function sliderCss(cls) {
  return `  .${cls}, ew-slider.${cls}, ew-slider { display: grid; gap: 8px; font-family: var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__label { font-size: 14px; font-weight: 600; color: var(--ew-color-fg-default); }
  .${cls}__control {
    width: 100%;
    accent-color: var(--ew-color-action-bg);
    height: var(--ew-structure-slider-track-height, 6px);
    border-radius: var(--ew-structure-slider-track-radius, 999px);
  }
  .${cls}__control:focus-visible { outline: 2px solid var(--ew-color-field-focus); outline-offset: 2px; }
  .${cls}__value { font-size: 14px; color: var(--ew-color-fg-muted); }`;
}

function menuCss(cls) {
  return `  .${cls}, ew-menu.${cls}, ew-menu { display: inline-block; position: relative; }
  .${cls}__trigger { anchor-name: --ew-menu-trigger; }
  .${cls}__panel {
    inset: unset;
    position-anchor: --ew-menu-trigger;
    position-area: block-end;
    min-width: anchor-size(width);
    border: var(--ew-structure-card-border-width, 1px) var(--ew-structure-card-border-style, solid) var(--ew-color-border-subtle);
    border-radius: var(--ew-structure-surface-radius, 8px);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: var(--ew-structure-card-raised-shadow, var(--ew-elevation-2));
    padding: 6px; min-width: 160px;
  }
  .${cls}__item {
    display: block; width: 100%; text-align: start;
    border: 0; background: transparent; color: inherit; font: inherit;
    padding: 8px 10px; border-radius: calc(var(--ew-structure-control-radius, 6px) * 0.75);
    cursor: pointer;
  }
  .${cls}__item:hover { background: color-mix(in oklch, var(--ew-color-action-bg) 16%, transparent); }
  .${cls}__item:focus-visible {
    background: color-mix(in oklch, var(--ew-color-action-bg) 16%, transparent);
    outline: 2px solid var(--ew-color-field-focus, Highlight);
    outline-offset: 2px;
  }`;
}

function popoverCss(cls) {
  return `  .${cls}, ew-popover.${cls}, ew-popover { display: inline-block; position: relative; }
  .${cls}__panel, .ew-popover__panel {
    border: var(--ew-structure-card-border-width, 1px) solid var(--ew-color-border-subtle);
    border-radius: var(--ew-structure-surface-radius, 8px);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: var(--ew-structure-card-raised-shadow, var(--ew-elevation-2));
    padding: 12px 14px; max-width: 280px;
  }`;
}

function tooltipCss(cls) {
  return `  .${cls} { position: relative; display: inline-flex; }
  .${cls}__trigger, .${cls} > :is(button, a, [tabindex], .ew-button, .ew-icon-button) {
    anchor-name: --ew-tooltip-trigger;
  }
  .${cls}__tip {
    inset: unset;
    position: fixed;
    position-anchor: --ew-tooltip-trigger;
    position-area: block-start;
    position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
    margin: 0;
    background: var(--ew-color-fg-default); color: var(--ew-color-fg-inverse, #fff);
    font-size: 14px; padding: var(--ew-structure-tooltip-padding, 6px 8px);
    border-radius: var(--ew-structure-tooltip-radius, 4px); white-space: nowrap;
    box-shadow: var(--ew-structure-tooltip-shadow, none);
    opacity: 0; pointer-events: none; transition: opacity 120ms ease;
  }
  .${cls}__tip:popover-open,
  .${cls}__tip[data-ew-open="true"] { opacity: 1; }
  @supports not (anchor-name: --x) {
    .${cls}__tip {
      position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .${cls}__tip { transition: none; }
  }`;
}

function toastCss(cls) {
  return `  .ew-toast-region, ew-toast-region {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    display: grid; gap: 10px; pointer-events: none;
  }
  .ew-toast-region > * { pointer-events: auto; }
  @media (max-width: 480px) {
    .ew-toast-region, ew-toast-region { left: 12px; right: 12px; bottom: 12px; max-width: calc(100vw - 24px); }
  }
  .${cls} {
    position: relative;
    border: var(--ew-structure-card-border-width, 1px) solid var(--ew-color-border-subtle);
    border-radius: var(--ew-structure-surface-radius, 8px);
    background: var(--ew-color-bg-elevated); color: var(--ew-color-fg-default);
    box-shadow: var(--ew-structure-card-shadow); padding: 12px 40px 12px 14px;
  }
  .${cls} .ew-icon-button { position: absolute; top: 6px; inset-inline-end: 6px; width: 32px; height: 32px; }
  .${cls}[data-variant="success"] { border-color: var(--ew-color-action-bg); }
  .${cls}[data-variant="warning"] { border-color: color-mix(in oklch, oklch(70% 0.15 85) 80%, var(--ew-color-border-strong)); }
  .${cls}[data-variant="danger"] { border-color: var(--ew-color-danger-bg); }
  .${cls}__title { display: block; margin-bottom: 4px; }
  .${cls}__body { margin: 0; }`;
}

function alertCss(cls) {
  return `  .${cls} {
    border: var(--ew-structure-card-border-width, 1px) solid var(--ew-color-border-subtle);
    border-inline-start-width: 4px;
    border-inline-start-color: var(--ew-color-action-bg);
    border-radius: var(--ew-structure-surface-radius, 8px);
    background: var(--ew-color-bg-surface); color: var(--ew-color-fg-default);
    padding: 12px 14px; display: grid; gap: 4px;
  }
  .${cls}[data-variant="success"] { border-inline-start-color: var(--ew-color-action-bg); }
  .${cls}[data-variant="warning"] { border-inline-start-color: oklch(70% 0.15 85); }
  .${cls}[data-variant="danger"] { border-inline-start-color: var(--ew-color-danger-bg); }
  .${cls}__title { font-weight: 700; }
  .${cls}__body { margin: 0; }`;
}

function iconButtonCss(cls) {
  return `  .${cls} {
    display: inline-grid; place-items: center;
    width: 40px; height: 40px; padding: 0;
    border: var(--ew-structure-button-border-width, 1px) var(--ew-structure-button-border-style, solid) var(--ew-color-border-strong);
    border-radius: var(--ew-structure-control-radius, 8px);
    background: var(--ew-color-action-bg); color: var(--ew-color-action-fg);
    box-shadow: var(--ew-structure-button-shadow, none);
    cursor: pointer; font: inherit;
  }
  .${cls}[data-variant="ghost"] { background: transparent; color: var(--ew-color-fg-default); border-color: transparent; box-shadow: none; }
  .${cls}[data-variant="secondary"] { background: transparent; color: var(--ew-color-fg-default); }
  .${cls}:focus-visible { outline: 2px solid var(--ew-color-field-focus); outline-offset: 2px; }
  .${cls}__icon { line-height: 1; font-size: 18px; }`;
}

function linkCss(cls) {
  return `  .${cls} {
    color: var(--ew-color-action-bg);
    font-family: var(--ew-font-body, system-ui, sans-serif);
    text-underline-offset: 0.15em;
  }
  .${cls}[data-variant="subtle"] { color: var(--ew-color-fg-muted); }
  .${cls}[data-variant="nav"] { color: var(--ew-color-fg-default); text-decoration: none; font-weight: 600; }
  .${cls}:focus-visible { outline: 2px solid var(--ew-color-field-focus); outline-offset: 2px; }`;
}

function avatarCss(cls) {
  return `  .${cls} {
    display: inline-grid; place-items: center; overflow: hidden;
    width: 40px; height: 40px;
    border-radius: var(--ew-structure-control-radius, 999px);
    background: var(--ew-color-bg-surface); color: var(--ew-color-fg-default);
    border: var(--ew-structure-card-border-width, 1px) solid var(--ew-color-border-subtle);
    font-family: var(--ew-font-body, system-ui, sans-serif); font-weight: 700; font-size: 14px;
  }
  .${cls}[data-variant="square"] { border-radius: var(--ew-structure-surface-radius, 8px); }
  .${cls}[data-size="sm"] { width: 32px; height: 32px; font-size: 12px; }
  .${cls}[data-size="lg"] { width: 56px; height: 56px; font-size: 16px; }
  .${cls}__image { width: 100%; height: 100%; object-fit: cover; }
  .${cls}__fallback { line-height: 1; }`;
}

function breadcrumbCss(cls) {
  return `  .${cls} { font-family: var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__list { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; margin: 0; padding: 0; align-items: center; }
  .${cls}__item { display: inline-flex; align-items: center; gap: 8px; color: var(--ew-color-fg-muted); }
  .${cls}__item:not(:last-child)::after {
    content: "/"; color: var(--ew-color-fg-muted); opacity: 0.7;
  }
  .${cls}__item[aria-current="page"] { color: var(--ew-color-fg-default); font-weight: 600; }`;
}

function ornamentDividerCss(cls) {
  return `  .${cls} {
    border: 0; height: 1px; margin: 24px 0; position: relative;
    background: linear-gradient(90deg, transparent, var(--ew-color-border-strong), transparent);
  }
  .${cls}[data-variant="ornament"]::before {
    content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    width: 12px; height: 12px; background: var(--ew-color-action-bg);
    clip-path: var(--ew-structure-button-clip, none);
    border-radius: var(--ew-structure-control-radius, 2px);
    box-shadow: 0 0 0 4px var(--ew-color-bg-page, #fff);
  }`;
}
