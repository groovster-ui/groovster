const HEADER = '/* GENERATED FILE — do not edit. Source: spec/. Run: pnpm gen */\n';

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
  }[comp.id];

  if (body) lines.push(body(cls));
  else lines.push(`  /* stub styles for ${comp.id} */`);

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
    justify-content: center;
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
  .${cls}[data-size="sm"] { padding: 4px 10px; font-size: 12px; }
  .${cls}[data-size="lg"] { padding: 12px 22px; font-size: 16px; }
  @media (prefers-reduced-motion: reduce) { .${cls} { transition: none; } }`;
}

function textFieldCss(cls) {
  return `  .${cls} {
    display: grid;
    gap: 6px;
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
  .${cls}__description, .${cls}__error { font-size: 12px; color: var(--ew-color-fg-muted, #666); }
  .${cls}[data-invalid="true"] .${cls}__error, .${cls}__error { color: var(--ew-color-danger-bg, #a33); }
  .${cls}[data-size="sm"] .${cls}__control { padding: 4px 8px; font-size: 12px; }
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
  .${cls}__header { display: grid; gap: 8px; }
  .${cls}__header h3, .${cls}__header h2 {
    margin: 0;
    font-family: var(--ew-font-display, inherit);
    letter-spacing: var(--ew-structure-card-title-tracking, 0);
  }
  .${cls}[data-header-rule="true"] .${cls}__header::after {
    content: "";
    display: var(--ew-structure-card-header-rule-display, none);
    height: 2px;
    width: 100%;
    background: var(--ew-structure-card-header-rule, var(--ew-color-border-strong));
  }
  .${cls}__body { margin: 0; }
  .${cls}__footer { display: flex; gap: 8px; flex-wrap: wrap; }
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
  .${cls}[data-size="sm"] { max-width: 320px; }
  .${cls}[data-size="lg"] { max-width: 560px; }
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
