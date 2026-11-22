import fs from 'node:fs';
import path from 'node:path';
import {
  BUDGETS_PATH,
  GEN_CSS,
  GEN_DOCS,
  GEN_LLMS,
  GEN_MANIFEST,
  REPO_ROOT,
  SPEC_ROOT,
} from './paths.js';
import { listFiles, readJson, writeText, rel } from './io.js';
import { flattenTokens } from './tokens-to-css.js';
import { genComponentCss } from './component-css.js';
import { generateExtras } from './gen-extras.js';
import { generateDialectCss } from './dialects.js';

const HEADER = '/* GENERATED FILE — do not edit. Source: spec/. Run: pnpm gen */\n';

function loadComponents() {
  return listFiles(path.join(SPEC_ROOT, 'components'), (f) => f.endsWith('.json'))
    .map((f) => readJson(f))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function loadEras() {
  return listFiles(path.join(SPEC_ROOT, 'eras'), (f) => f.endsWith('era.spec.json'))
    .map((f) => readJson(f))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function fidelityAttrRules() {
  // Map data-fidelity="0"…"100" → --ew-fidelity so the numeric API is real CSS.
  const lines = [];
  for (let i = 0; i <= 100; i++) {
    lines.push(`  [data-fidelity="${i}"] { --ew-fidelity: ${i}; }`);
  }
  return lines.join('\n');
}

function genBaseCss() {
  return `${HEADER}@layer reset, tokens, era, components, decorators, overrides;

@property --ew-fidelity {
  syntax: "<number>";
  inherits: true;
  initial-value: 50;
}

@layer reset {
  .ew-root, .ew-root * { box-sizing: border-box; }
  .ew-root { margin: 0; }
}

@layer tokens {
  :root, .ew-root, [data-era] {
    color-scheme: light dark;
    --ew-fidelity: var(--ew-fidelity-default, 50);
    --ew-fidelity-ornament: clamp(0, (var(--ew-fidelity) - 20) / 50, 1);
    --ew-fidelity-drama: clamp(0, (var(--ew-fidelity) - 40) / 40, 1);
  }
${fidelityAttrRules()}
  /* Continuous fidelity drives ornament/drama when band is absent */
  [data-era][data-fidelity]:not([data-fidelity-band]) {
    --ew-structure-card-ornament-opacity: calc(var(--ew-fidelity-ornament) * 0.35);
  }
${Array.from({ length: 26 }, (_, i) => `  [data-era][data-fidelity="${i}"]:not([data-fidelity-band]) {
    --ew-structure-card-ornament-opacity: 0;
    --ew-structure-button-clip: none;
    --ew-structure-card-clip: none;
    --ew-structure-button-shadow: none;
    --ew-structure-card-raised-shadow: var(--ew-elevation-1, none);
  }`).join('\n')}
}

@layer overrides {
  @media (prefers-reduced-transparency: reduce) {
    [data-era] {
      --ew-color-overlay: var(--ew-color-bg-elevated);
      --ew-structure-card-ornament-opacity: 0;
      --ew-structure-button-bevel: none;
    }
    [data-era] .ew-card::before,
    [data-era] .ew-dialog::backdrop {
      opacity: 1;
      background: var(--ew-color-bg-elevated);
      backdrop-filter: none;
    }
  }

  @media (forced-colors: active) {
    [data-era] {
      --ew-color-fg-default: CanvasText;
      --ew-color-fg-muted: GrayText;
      --ew-color-fg-inverse: Canvas;
      --ew-color-bg-page: Canvas;
      --ew-color-bg-surface: Canvas;
      --ew-color-bg-elevated: Canvas;
      --ew-color-border-subtle: ButtonBorder;
      --ew-color-border-strong: ButtonText;
      --ew-color-action-bg: Highlight;
      --ew-color-action-fg: HighlightText;
      --ew-color-field-bg: Field;
      --ew-color-field-border: ButtonBorder;
      --ew-color-field-focus: Highlight;
      --ew-structure-card-ornament-opacity: 0;
      --ew-structure-button-shadow: none;
      --ew-structure-card-shadow: none;
      --ew-structure-card-raised-shadow: none;
      --ew-structure-button-clip: none;
      --ew-structure-card-clip: none;
    }
    .ew-button, .ew-icon-button, .ew-card, .ew-dialog, .ew-text-field__control,
    .ew-select__trigger, .ew-select__control, .ew-menu__panel, .ew-popover__panel,
    .ew-toast, .ew-alert, .ew-tooltip__tip {
      border: 1px solid ButtonBorder !important;
      forced-color-adjust: none;
    }
    .ew-button:focus-visible, .ew-icon-button:focus-visible,
    .ew-text-field__control:focus-visible, .ew-select__trigger:focus-visible,
    [role="tab"]:focus-visible, .ew-menu__item:focus-visible,
    .ew-link:focus-visible, .ew-slider__control:focus-visible {
      outline: 3px solid Highlight !important;
      outline-offset: 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ew-root *, .ew-root *::before, .ew-root *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
`;
}

function ornamentVars(kind) {
  switch (kind) {
    case 'chevron':
      return {
        content: '""',
        opacity: '0.35',
        bg: `linear-gradient(135deg, transparent 40%, var(--ew-color-border-strong) 40%, var(--ew-color-border-strong) 45%, transparent 45%) top left no-repeat,
      linear-gradient(225deg, transparent 40%, var(--ew-color-border-strong) 40%, var(--ew-color-border-strong) 45%, transparent 45%) top right no-repeat`,
        size: '28px 14px',
        blend: 'normal',
      };
    case 'starburst':
      return {
        content: '""',
        opacity: '0.22',
        bg: `radial-gradient(circle at 92% 12%, var(--ew-color-action-bg) 0 2px, transparent 3px) no-repeat,
      conic-gradient(from 0deg at 92% 12%, transparent 0 10deg, color-mix(in oklch, var(--ew-color-action-bg) 55%, transparent) 10deg 12deg, transparent 12deg 30deg) no-repeat`,
        size: '120px 120px',
        blend: 'multiply',
      };
    case 'scanline':
      return {
        content: '""',
        opacity: '0.18',
        bg: `repeating-linear-gradient(
        to bottom,
        transparent 0 2px,
        color-mix(in oklch, var(--ew-color-fg-default) 35%, transparent) 2px 3px
      ),
      linear-gradient(120deg, transparent 40%, color-mix(in oklch, var(--ew-color-action-bg) 18%, transparent) 50%, transparent 60%)`,
        size: 'auto',
        blend: 'screen',
      };
    default:
      return { content: 'none', opacity: '0', bg: 'none', size: 'auto', blend: 'normal' };
  }
}

function structureVars(structure) {
  const b = structure.button;
  const c = structure.card;
  const orn = ornamentVars(c.ornament || 'none');
  const lines = [
    `    --ew-structure-control-radius: ${structure.controlRadius};`,
    `    --ew-structure-surface-radius: ${structure.surfaceRadius};`,
    `    --ew-structure-button-border-width: ${b.borderWidth};`,
    `    --ew-structure-button-border-style: ${b.borderStyle};`,
    `    --ew-structure-button-letter-spacing: ${b.letterSpacing};`,
    `    --ew-structure-button-text-transform: ${b.textTransform};`,
    `    --ew-structure-button-font-weight: ${b.fontWeight};`,
    `    --ew-structure-button-shadow: ${b.shadow};`,
    `    --ew-structure-button-clip: ${b.clipPath};`,
    `    --ew-structure-button-padding-x: ${b.paddingX || '16px'};`,
    `    --ew-structure-button-padding-y: ${b.paddingY || '8px'};`,
    `    --ew-structure-button-bevel: ${b.bevel || 'none'};`,
    `    --ew-structure-card-border-width: ${c.borderWidth};`,
    `    --ew-structure-card-border-style: ${c.borderStyle};`,
    `    --ew-structure-card-shadow: ${c.shadow};`,
    `    --ew-structure-card-raised-shadow: ${c.raisedShadow || c.shadow};`,
    `    --ew-structure-card-clip: ${c.clipPath};`,
    `    --ew-structure-card-padding: ${c.padding};`,
    `    --ew-structure-card-title-tracking: ${c.titleTracking || '0'};`,
    `    --ew-structure-card-header-rule-display: ${c.headerRule ? 'block' : 'none'};`,
    `    --ew-structure-card-header-rule: linear-gradient(90deg, transparent, var(--ew-color-border-strong), transparent);`,
    `    --ew-structure-card-ornament-content: ${orn.content};`,
    `    --ew-structure-card-ornament-opacity: ${orn.opacity};`,
    `    --ew-structure-card-ornament-bg: ${orn.bg};`,
    `    --ew-structure-card-ornament-size: ${orn.size};`,
    `    --ew-structure-card-ornament-blend: ${orn.blend};`,
    `    --ew-structure-field-border-width: ${structure.field?.borderWidth || '1px'};`,
    `    --ew-structure-field-border-style: ${structure.field?.borderStyle || 'solid'};`,
    `    --ew-structure-field-radius: ${structure.field?.radius || structure.controlRadius};`,
    `    --ew-structure-dialog-border-width: ${structure.dialog?.borderWidth || '1px'};`,
    `    --ew-structure-dialog-border-style: ${structure.dialog?.borderStyle || 'solid'};`,
    `    --ew-structure-dialog-radius: ${structure.dialog?.radius || structure.surfaceRadius};`,
    `    --ew-structure-dialog-shadow: ${structure.dialog?.shadow || 'var(--ew-elevation-dialog)'};`,
    `    --ew-structure-dialog-clip: ${structure.dialog?.clipPath || 'none'};`,
    `    --ew-structure-tabs-indicator-height: ${structure.tabs?.indicatorHeight || '2px'};`,
    `    --ew-structure-tabs-indicator-style: ${structure.tabs?.indicatorStyle || 'solid'};`,
    `    --ew-structure-tabs-radius: ${structure.tabs?.radius || '0px'};`,
    `    --ew-structure-switch-track-radius: ${structure.switch?.trackRadius || '999px'};`,
    `    --ew-structure-switch-thumb-radius: ${structure.switch?.thumbRadius || '999px'};`,
    `    --ew-structure-switch-shadow: ${structure.switch?.shadow || 'none'};`,
    `    --ew-structure-tooltip-radius: ${structure.tooltip?.radius || structure.controlRadius};`,
    `    --ew-structure-tooltip-shadow: ${structure.tooltip?.shadow || 'none'};`,
    `    --ew-structure-tooltip-padding: ${structure.tooltip?.padding || '6px 8px'};`,
    `    --ew-structure-slider-track-height: ${structure.slider?.trackHeight || '6px'};`,
    `    --ew-structure-slider-thumb-size: ${structure.slider?.thumbSize || '16px'};`,
    `    --ew-structure-slider-track-radius: ${structure.slider?.trackRadius || '999px'};`,
  ];
  return lines;
}

function tokenFileFor(era, tierDir, mode) {
  const match = era.tokenFiles.find(
    (f) => f.includes(`/${tierDir}/`) && f.includes(`.${mode}.`)
  );
  if (!match) {
    throw new Error(`Missing ${tierDir} ${mode} token file for era ${era.id}`);
  }
  return path.join(REPO_ROOT, ...match.split('/'));
}

function genEraCss(era) {
  const blocks = [HEADER, `@layer tokens {`];
  for (const mode of era.modes) {
    const t1 = readJson(tokenFileFor(era, 'tier1', mode));
    const t2 = readJson(tokenFileFor(era, 'tier2', mode));
    const vars = [...flattenTokens(t1), ...flattenTokens(t2)];
    const selector =
      mode === 'light'
        ? `[data-era="${era.id}"], [data-era="${era.id}"][data-mode="light"]`
        : `[data-era="${era.id}"][data-mode="dark"]`;
    blocks.push(`  ${selector} {`);
    blocks.push(`    --ew-era: ${era.id};`);
    blocks.push(`    --ew-mode: ${mode};`);
    blocks.push(...vars);
    blocks.push(`    color: var(--ew-color-fg-default);`);
    blocks.push(`    background: var(--ew-color-bg-page);`);
    blocks.push(`    font-family: var(--ew-font-body, system-ui, sans-serif);`);
    blocks.push(`  }`);
  }
  blocks.push(`}`);

  blocks.push(`@layer era {`);
  blocks.push(`  [data-era="${era.id}"] {`);
  blocks.push(`    --ew-fidelity-default: ${era.fidelity.recommended.default};`);
  if (era.structure) {
    blocks.push(...structureVars(era.structure));
  }
  blocks.push(`  }`);

  // Fidelity bands: whisper mutes ornaments / softens drama; costume keeps full structure
  blocks.push(`  [data-era="${era.id}"][data-fidelity-band="whisper"] {`);
  blocks.push(`    --ew-structure-card-ornament-opacity: 0;`);
  blocks.push(`    --ew-structure-button-clip: none;`);
  blocks.push(`    --ew-structure-card-clip: none;`);
  blocks.push(`    --ew-structure-button-shadow: none;`);
  blocks.push(`    --ew-structure-card-raised-shadow: var(--ew-elevation-1, none);`);
  blocks.push(`  }`);
  blocks.push(`}`);
  // Decorators layer: era-specific chrome that changes structure beyond variables
  blocks.push(`@layer decorators {`);
  if (era.id === 'deco') {
    blocks.push(`  /* === DECO: ART DECO (1920s-30s) — poster-scale geometry === */
  
  /* Metallic gold + shared ornament masks (SVG as mask, tinted via background) */
  [data-era="deco"] {
    --ew-gradient-metal-light: linear-gradient(180deg, #E5C166 0%, #B08D2C 38%, #7A5C12 62%, #D4AE2E 100%);
    --ew-gradient-metal-dark: linear-gradient(180deg, #F6E27A 0%, #D4AF37 38%, #9C7A22 62%, #E9CD6B 100%);
    --ew-gradient-metal: var(--ew-gradient-metal-light);
    --ew-ornament-fan: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 56'%3E%3Cpath d='M8 52 L60 4 L112 52 M18 52 L60 14 L102 52 M28 52 L60 22 L92 52 M38 52 L60 30 L82 52 M48 52 L60 38 L72 52' stroke='%23000' stroke-width='2.4' fill='none'/%3E%3Ccircle cx='60' cy='52' r='4' fill='%23000'/%3E%3C/svg%3E");
    --ew-deco-step-clip: polygon(
      0 20px, 8px 20px, 8px 12px, 12px 12px, 12px 0,
      calc(100% - 12px) 0, calc(100% - 12px) 12px, calc(100% - 8px) 12px, calc(100% - 8px) 20px, 100% 20px,
      100% calc(100% - 20px), calc(100% - 8px) calc(100% - 20px), calc(100% - 8px) calc(100% - 12px), calc(100% - 12px) calc(100% - 12px), calc(100% - 12px) 100%,
      12px 100%, 12px calc(100% - 12px), 8px calc(100% - 12px), 8px calc(100% - 20px), 0 calc(100% - 20px)
    );
    --ew-deco-step-clip-sm: polygon(
      0 12px, 6px 12px, 6px 6px, 6px 0,
      calc(100% - 6px) 0, calc(100% - 6px) 6px, calc(100% - 6px) 12px, 100% 12px,
      100% calc(100% - 12px), calc(100% - 6px) calc(100% - 12px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%,
      6px 100%, 6px calc(100% - 6px), 6px calc(100% - 12px), 0 calc(100% - 12px)
    );
  }
  [data-era="deco"][data-mode="dark"] {
    --ew-gradient-metal: var(--ew-gradient-metal-dark);
  }
  
  /* Page sunburst — bold poster rays (costume only) */
  [data-era="deco"][data-fidelity-band="costume"]::before {
    content: "" / "";
    position: fixed;
    inset: 0;
    background:
      repeating-conic-gradient(
        from 0deg at 50% 36%,
        color-mix(in oklch, var(--ew-color-gold) 78%, transparent) 0deg 4.5deg,
        transparent 4.5deg 11deg
      );
    mask-image: radial-gradient(ellipse 85% 70% at 50% 32%, black 5%, transparent 68%);
    -webkit-mask-image: radial-gradient(ellipse 85% 70% at 50% 32%, black 5%, transparent 68%);
    pointer-events: none;
    z-index: 0;
    opacity: 1;
  }
  
  /* Subtle vertical pinstripe over lacquer */
  [data-era="deco"][data-fidelity-band="costume"]::after {
    content: "" / "";
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0 7px,
      color-mix(in oklch, var(--ew-color-gold) 6%, transparent) 7px 8px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.55;
  }
  
  /* === CARDS — ziggurat frame + fan crest === */
  [data-era="deco"] .ew-card {
    border-style: double;
    border-width: 4px;
    border-color: var(--ew-color-gold);
    clip-path: var(--ew-deco-step-clip);
    box-shadow:
      0 0 0 1px color-mix(in oklch, var(--ew-color-gold) 70%, transparent),
      0 6px 0 0 var(--ew-color-border-strong),
      0 12px 0 0 color-mix(in oklch, var(--ew-color-fg-default) 22%, transparent);
    overflow: visible;
  }
  
  [data-era="deco"] .ew-card[data-variant="raised"] {
    background: var(--ew-color-bg-elevated);
  }
  
  /* Fan crest — large, gold-tinted via mask */
  [data-era="deco"][data-fidelity-band="costume"] .ew-card::before {
    content: "" / "";
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 56px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
    opacity: 1;
    z-index: 2;
    pointer-events: none;
  }
  
  /* Inner double-rule stepped frame */
  [data-era="deco"][data-fidelity-band="costume"] .ew-card::after {
    content: "" / "";
    position: absolute;
    inset: 10px;
    border: 2px double var(--ew-color-gold);
    clip-path: var(--ew-deco-step-clip-sm);
    pointer-events: none;
    opacity: 0.85;
    z-index: 1;
  }
  
  [data-era="deco"] .ew-card__header {
    padding-top: 48px;
  }
  
  [data-era="deco"] .ew-card__header h2,
  [data-era="deco"] .ew-card__header h3 {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    text-align: center;
    font-weight: 600;
    color: var(--ew-color-fg-default);
  }
  
  /* Bold chevron band under card titles */
  [data-era="deco"][data-fidelity-band="costume"] .ew-card__header::after {
    content: "" / "";
    display: block;
    height: 14px;
    margin: 16px auto 0;
    width: 160px;
    background:
      repeating-linear-gradient(
        -45deg,
        var(--ew-color-gold) 0 8px,
        transparent 8px 16px
      ),
      repeating-linear-gradient(
        45deg,
        var(--ew-color-gold) 0 8px,
        transparent 8px 16px
      );
    background-size: 100% 50%;
    background-position: 0 0, 0 100%;
    background-repeat: repeat-x;
    opacity: 0.9;
  }
  
  [data-era="deco"][data-fidelity-band="whisper"] .ew-card::before,
  [data-era="deco"][data-fidelity-band="whisper"] .ew-card::after,
  [data-era="deco"][data-fidelity-band="whisper"] .ew-card__header::after { display: none; }
  
  /* === SECTION DIVIDERS — real-size chevron / fan === */
  [data-era="deco"][data-fidelity-band="costume"] .ew-ornament-divider {
    height: 28px;
    margin: 48px auto;
    max-width: 720px;
    background:
      linear-gradient(90deg, transparent, var(--ew-color-gold), transparent) center / 100% 2px no-repeat,
      linear-gradient(90deg, transparent, var(--ew-color-gold), transparent) center / 100% 2px no-repeat;
    background-position: center 10px, center 16px;
    border: 0;
    opacity: 1;
  }
  [data-era="deco"][data-fidelity-band="costume"] .ew-ornament-divider::before {
    content: "" / "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 88px;
    height: 40px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
    background-image: none;
    clip-path: none;
  }
  [data-era="deco"][data-fidelity-band="costume"] .ew-ornament-divider[data-variant="ornament"]::before {
    width: 100px;
    height: 46px;
  }
  
  /* === BUTTONS === */
  [data-era="deco"] .ew-button {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    clip-path: var(--ew-deco-step-clip-sm);
    box-shadow: 0 3px 0 0 var(--ew-color-border-strong);
  }
  
  [data-era="deco"] .ew-button:active {
    box-shadow: 0 1px 0 0 var(--ew-color-border-strong);
  }
  
  [data-era="deco"] .ew-button[data-variant="secondary"] {
    border-style: double;
    border-width: 3px;
    border-color: var(--ew-color-gold);
  }
  
  /* === INPUTS — gold underline / inset frame, small-caps labels === */
  [data-era="deco"] .ew-text-field__label,
  [data-era="deco"] .ew-select__label {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
    font-weight: 700;
    font-variant-caps: all-small-caps;
  }
  
  [data-era="deco"] .ew-text-field__control,
  [data-era="deco"] .ew-select__control,
  [data-era="deco"] .ew-select__trigger {
    border-radius: 0;
    border-top: 1px solid color-mix(in oklch, var(--ew-color-gold) 35%, transparent);
    border-left: 1px solid color-mix(in oklch, var(--ew-color-gold) 35%, transparent);
    border-right: 1px solid color-mix(in oklch, var(--ew-color-gold) 35%, transparent);
    border-bottom: 3px solid var(--ew-color-gold);
    background: color-mix(in oklch, var(--ew-color-field-bg) 92%, var(--ew-color-brass) 8%);
  }
  
  [data-era="deco"] .ew-text-field__control:focus,
  [data-era="deco"] .ew-select__control:focus {
    outline: 2px solid var(--ew-color-field-focus);
    outline-offset: 2px;
    border-bottom-color: var(--ew-color-goldFocus, var(--ew-color-gold));
  }
  
  /* === CHECKBOX / SWITCH alignment === */
  [data-era="deco"] .ew-checkbox,
  [data-era="deco"] .ew-switch {
    align-items: center;
    min-height: 28px;
  }
  [data-era="deco"] .ew-checkbox__box {
    width: 20px;
    height: 20px;
    border-style: double;
    border-width: 3px;
    border-color: var(--ew-color-gold);
  }
  [data-era="deco"] .ew-switch__track,
  [data-era="deco"] .ew-switch__thumb {
    border-radius: 0;
  }
  [data-era="deco"] .ew-switch__track {
    border: 2px solid var(--ew-color-gold);
  }
  [data-era="deco"] .ew-switch__thumb {
    background: var(--ew-color-gold);
  }
  
  /* === DIALOG === */
  [data-era="deco"] .ew-dialog {
    border-style: double;
    border-width: 4px;
    border-color: var(--ew-color-gold);
    clip-path: var(--ew-deco-step-clip);
    box-shadow: 0 10px 0 0 var(--ew-color-border-strong);
    position: relative;
  }
  
  [data-era="deco"][data-fidelity-band="costume"] .ew-dialog::before {
    content: "" / "";
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 46px;
    background-color: var(--ew-color-gold);
    -webkit-mask: var(--ew-ornament-fan) center / contain no-repeat;
    mask: var(--ew-ornament-fan) center / contain no-repeat;
    opacity: 0.95;
  }
  
  [data-era="deco"] .ew-dialog h2 {
    text-transform: uppercase;
    letter-spacing: 0.16em;
    text-align: center;
    margin-top: 40px;
  }
  
  /* === TABS — gold-framed === */
  [data-era="deco"] .ew-tabs [role="tablist"],
  [data-era="deco"] ew-tabs [role="tablist"] {
    border-bottom: 3px double var(--ew-color-gold);
    gap: 0;
  }
  
  [data-era="deco"] .ew-tabs [role="tab"],
  [data-era="deco"] ew-tabs [role="tab"] {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 13px;
    font-weight: 700;
    border: 2px solid transparent;
    border-bottom: 0;
    margin-bottom: -3px;
  }
  
  [data-era="deco"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="deco"] ew-tabs [role="tab"][aria-selected="true"] {
    clip-path: polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
    /* action pair stays AA in both modes (gold/lacquer dark; black/gold light) */
    background: var(--ew-color-action-bg);
    color: var(--ew-color-action-fg);
    border-color: var(--ew-color-gold);
  }
  
  /* === HEADINGS === */
  [data-era="deco"] h1 {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    text-align: center;
  }
  
  [data-era="deco"][data-fidelity-band="costume"] h1 {
    background: var(--ew-gradient-metal);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @supports not (background-clip: text) {
    [data-era="deco"][data-fidelity-band="costume"] h1 {
      color: var(--ew-color-gold);
      -webkit-text-fill-color: unset;
    }
  }
  
  [data-era="deco"] h2, [data-era="deco"] h3 {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    text-align: center;
  }
  
  @media (prefers-reduced-motion: reduce) {
    [data-era="deco"] * {
      animation: none !important;
      transition: none !important;
    }
  }
  
  @media (forced-colors: active) {
    [data-era="deco"][data-fidelity-band="costume"]::before,
    [data-era="deco"][data-fidelity-band="costume"]::after,
    [data-era="deco"][data-fidelity-band="costume"] .ew-card::before,
    [data-era="deco"][data-fidelity-band="costume"] .ew-card::after,
    [data-era="deco"][data-fidelity-band="costume"] .ew-ornament-divider::before {
      display: none;
    }
  }
`);
  } else if (era.id === 'mcm-atomic') {
    blocks.push(`  [data-era="mcm-atomic"] .ew-card {
    border-radius: var(--ew-structure-surface-radius, 24px);
  }
  [data-era="mcm-atomic"][data-fidelity-band="costume"] .ew-card[data-variant="raised"] {
    border-radius: 28px 28px 36px 20px / 24px 32px 22px 30px;
  }
  [data-era="mcm-atomic"] .ew-button {
    border-radius: var(--ew-structure-control-radius, 999px);
  }
  [data-era="mcm-atomic"] .ew-card__header h2,
  [data-era="mcm-atomic"] .ew-card__header h3 {
    text-transform: lowercase;
    font-weight: 600;
  }
  [data-era="mcm-atomic"] .ew-text-field__control {
    border-radius: var(--ew-structure-field-radius, 16px);
    border-width: 0;
    background: var(--ew-color-bg-surface);
    box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--ew-color-fg-default) 12%, transparent);
  }
  [data-era="mcm-atomic"] .ew-dialog {
    border-radius: var(--ew-structure-dialog-radius, 28px);
    border-width: 0;
  }
  [data-era="mcm-atomic"] .ew-tabs[data-variant="pills"] [role="tab"],
  [data-era="mcm-atomic"] ew-tabs[data-variant="pills"] [role="tab"] {
    border-radius: 999px;
  }
`);
  } else if (era.id === 'neon') {
    blocks.push(`  [data-era="neon"] .ew-button {
    border-image: linear-gradient(120deg, var(--ew-color-border-strong), var(--ew-color-border-subtle), var(--ew-color-border-strong)) 1;
  }
  [data-era="neon"] .ew-button[data-variant="ghost"] { border-image: none; }
  [data-era="neon"] .ew-card {
    border-color: var(--ew-color-border-strong);
    background-image:
      linear-gradient(180deg, color-mix(in oklch, var(--ew-color-bg-elevated) 92%, white) 0%, var(--ew-color-bg-surface) 100%);
  }
  [data-era="neon"] .ew-card__header::after {
    content: "";
    display: block;
    height: 2px;
    margin-top: 10px;
    background: linear-gradient(90deg, var(--ew-color-action-bg), var(--ew-color-border-subtle), transparent);
  }
  [data-era="neon"][data-fidelity-band="whisper"] .ew-card__header::after { display: none; }
  [data-era="neon"] .ew-card__header h2,
  [data-era="neon"] .ew-card__header h3 {
    text-transform: uppercase;
    font-family: var(--ew-font-display, inherit);
  }
  [data-era="neon"] .ew-text-field__control {
    border-radius: 2px;
    box-shadow: 0 0 0 1px color-mix(in oklch, var(--ew-color-border-subtle) 50%, transparent);
  }
  [data-era="neon"] .ew-dialog {
    border-color: var(--ew-color-border-strong);
    box-shadow: var(--ew-structure-dialog-shadow);
  }
  [data-era="neon"] .ew-switch__track {
    border-radius: 2px;
  }
  [data-era="neon"] .ew-switch__thumb { border-radius: 2px; }
  [data-era="neon"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="neon"] ew-tabs [role="tab"][aria-selected="true"] {
    text-shadow: 0 0 8px color-mix(in oklch, var(--ew-color-action-bg) 45%, transparent);
  }
`);
  } else if (era.id === 'neutral') {
    blocks.push(`  [data-era="neutral"] .ew-button {
    border-radius: var(--ew-structure-control-radius, 8px);
  }
  [data-era="neutral"] .ew-card {
    border-radius: var(--ew-structure-surface-radius, 12px);
  }
  [data-era="neutral"] .ew-tooltip__tip {
    border-radius: var(--ew-structure-tooltip-radius, 6px);
    box-shadow: var(--ew-structure-tooltip-shadow, none);
  }
  [data-era="neutral"] .ew-slider__control {
    height: var(--ew-structure-slider-track-height, 6px);
  }
`);
  } else if (era.id === 'memphis') {
    blocks.push(`  [data-era="memphis"] .ew-button {
    border-width: 3px;
    box-shadow: 4px 4px 0 0 var(--ew-color-fg-default);
    transform: rotate(-0.4deg);
  }
  [data-era="memphis"] .ew-button[data-variant="secondary"] {
    background: var(--ew-color-bg-elevated);
    box-shadow: 4px 4px 0 0 var(--ew-color-action-bg);
    transform: rotate(0.5deg);
  }
  [data-era="memphis"] .ew-card {
    border-width: 3px;
    box-shadow: 6px 6px 0 0 var(--ew-color-fg-default);
  }
  [data-era="memphis"] .ew-card[data-variant="raised"] {
    box-shadow: 8px 8px 0 0 var(--ew-color-action-bg), 14px 14px 0 0 var(--ew-color-fg-default);
  }
  [data-era="memphis"] .ew-card__header::before {
    content: "";
    display: block;
    width: 18px; height: 18px;
    margin-bottom: 8px;
    background:
      linear-gradient(45deg, var(--ew-color-action-bg) 25%, transparent 25%) 0 0 / 8px 8px,
      linear-gradient(-45deg, var(--ew-color-border-strong) 25%, transparent 25%) 0 0 / 8px 8px;
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  }
  [data-era="memphis"][data-fidelity-band="whisper"] .ew-card__header::before { display: none; }
  [data-era="memphis"] .ew-text-field__control,
  [data-era="memphis"] .ew-select__trigger {
    border-width: 3px;
    border-radius: 14px 4px 14px 4px;
  }
  [data-era="memphis"] .ew-dialog {
    border-width: 3px;
    box-shadow: 10px 10px 0 0 var(--ew-color-fg-default);
  }
  [data-era="memphis"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="memphis"] ew-tabs [role="tab"][aria-selected="true"] {
    background: color-mix(in oklch, var(--ew-color-action-bg) 18%, transparent);
    box-shadow: 3px 3px 0 0 var(--ew-color-fg-default);
  }
  [data-era="memphis"] .ew-tooltip__tip {
    border: 2px solid var(--ew-color-fg-default);
    border-radius: 2px;
    box-shadow: 3px 3px 0 0 var(--ew-color-action-bg);
    padding: var(--ew-structure-tooltip-padding, 6px 8px);
  }
  [data-era="memphis"] .ew-slider__control {
    accent-color: var(--ew-color-action-bg);
    height: var(--ew-structure-slider-track-height, 8px);
  }
  [data-era="memphis"] .ew-menu__panel,
  [data-era="memphis"] .ew-popover__panel {
    border-width: 3px;
    box-shadow: 5px 5px 0 0 var(--ew-color-fg-default);
  }
`);
  } else if (era.id === 'groovy') {
    blocks.push(`  [data-era="groovy"] .ew-button {
    border-radius: 999px;
    box-shadow: 0 4px 0 0 color-mix(in oklch, var(--ew-color-fg-default) 18%, transparent);
  }
  [data-era="groovy"] .ew-card {
    border-radius: 28px 36px 24px 40px / 32px 24px 36px 28px;
    border-width: 0;
    background-image:
      radial-gradient(circle at 12% 18%, color-mix(in oklch, var(--ew-color-action-bg) 22%, transparent) 0 18%, transparent 19%),
      radial-gradient(circle at 88% 12%, color-mix(in oklch, var(--ew-color-border-strong) 18%, transparent) 0 14%, transparent 15%);
  }
  [data-era="groovy"] .ew-card__header::after {
    content: "";
    display: block;
    height: 10px;
    margin-top: 10px;
    background:
      radial-gradient(circle at 10px 5px, var(--ew-color-action-bg) 0 3px, transparent 4px),
      radial-gradient(circle at 28px 5px, var(--ew-color-border-strong) 0 3px, transparent 4px),
      radial-gradient(circle at 46px 5px, var(--ew-color-action-bg) 0 3px, transparent 4px);
    opacity: 0.7;
  }
  [data-era="groovy"][data-fidelity-band="whisper"] .ew-card__header::after { display: none; }
  [data-era="groovy"] .ew-text-field__control {
    border-radius: 999px;
    border-width: 2px;
  }
  [data-era="groovy"] .ew-dialog {
    border-radius: 36px 28px 40px 32px / 28px 36px 30px 34px;
  }
  [data-era="groovy"] .ew-tabs [role="tablist"],
  [data-era="groovy"] ew-tabs [role="tablist"] {
    border-bottom: 0;
    gap: 10px;
  }
  [data-era="groovy"] .ew-tabs [role="tab"],
  [data-era="groovy"] ew-tabs [role="tab"] {
    border-radius: 999px;
    border-bottom: 0;
    padding-inline: 14px;
  }
  [data-era="groovy"] .ew-tabs [role="tab"][aria-selected="true"],
  [data-era="groovy"] ew-tabs [role="tab"][aria-selected="true"] {
    background: var(--ew-color-action-bg);
    color: var(--ew-color-action-fg);
  }
  [data-era="groovy"] .ew-tooltip__tip {
    border-radius: 999px;
    padding: 8px 12px;
    box-shadow: 0 4px 0 color-mix(in oklch, var(--ew-color-fg-default) 20%, transparent);
  }
  [data-era="groovy"] .ew-slider__control {
    height: var(--ew-structure-slider-track-height, 10px);
    border-radius: 999px;
  }
  [data-era="groovy"] .ew-switch__track {
    border-radius: 999px;
    box-shadow: inset 0 0 0 2px color-mix(in oklch, var(--ew-color-fg-default) 12%, transparent);
  }
`);
  } else if (era.id === 'earth') {
    blocks.push(`  [data-era="earth"] .ew-button {
    border-radius: 6px;
    border-width: 1px;
    letter-spacing: 0.04em;
    box-shadow: none;
    background-image: linear-gradient(180deg, color-mix(in oklch, white 8%, transparent), transparent);
  }
  [data-era="earth"] .ew-card {
    border-radius: 10px;
    border-width: 1px;
    box-shadow: none;
    background-image:
      linear-gradient(180deg, color-mix(in oklch, var(--ew-color-bg-elevated) 88%, var(--ew-color-border-subtle)), var(--ew-color-bg-surface));
  }
  [data-era="earth"] .ew-card__header::after {
    content: "";
    display: block;
    height: 2px;
    margin-top: 10px;
    background: linear-gradient(90deg, transparent, var(--ew-color-border-strong), transparent);
    opacity: 0.65;
  }
  [data-era="earth"][data-fidelity-band="whisper"] .ew-card__header::after { display: none; }
  [data-era="earth"] .ew-text-field__control {
    border-radius: 6px;
    border-width: 0 0 2px 0;
    background: transparent;
  }
  [data-era="earth"] .ew-dialog {
    border-radius: 12px;
    border-width: 1px;
  }
  [data-era="earth"] .ew-tabs [role="tablist"],
  [data-era="earth"] ew-tabs [role="tablist"] {
    border-bottom-color: color-mix(in oklch, var(--ew-color-border-strong) 55%, transparent);
  }
  [data-era="earth"] .ew-tooltip__tip {
    border-radius: 4px;
    border: 1px solid var(--ew-color-border-subtle);
    background: var(--ew-color-bg-elevated);
    color: var(--ew-color-fg-default);
    box-shadow: none;
  }
  [data-era="earth"] .ew-slider__control {
    height: var(--ew-structure-slider-track-height, 4px);
    accent-color: var(--ew-color-border-strong);
  }
  [data-era="earth"] .ew-ornament-divider {
    background: linear-gradient(90deg, transparent, var(--ew-color-border-subtle), transparent);
  }
`);
  }
  blocks.push(`}`);
  return blocks.join('\n') + '\n';
}

function genDocsStub(comp) {
  return `# ${comp.name}

> Generated from \`spec/components/${comp.id}.json\`. Do not hand-edit.

${comp.summary}

## Canonical HTML

\`\`\`html
${comp.canonicalHtml}
\`\`\`

## Imports

${(comp.imports || []).map((i) => `- \`${i}\``).join('\n')}

## Variants

${Object.entries(comp.variants)
  .map(([k, v]) => `- **${k}** (\`${v.attribute}\`): ${v.values.join(' | ')} (default: ${v.default})`)
  .join('\n')}

## ARIA

- Role: ${comp.aria.role}
${comp.aria.notes.map((n) => `- ${n}`).join('\n')}

## Do

${comp.do.map((d) => `- ${d}`).join('\n')}

## Don't

${comp.dont.map((d) => `- ${d}`).join('\n')}
`;
}

function genLlmsSection(comp) {
  // Keep compact for agent budgets
  const lines = [
    `## ${comp.name} (\`${comp.className}\`)`,
    '',
    comp.summary,
    '',
    'HTML:',
    '```html',
    comp.canonicalHtml,
    '```',
    '',
    `CSS: ${(comp.imports || []).join(' + ')}`,
    `Variants: ${Object.entries(comp.variants)
      .map(([k, v]) => `${k}=${v.values.join('|')}(default:${v.default})`)
      .join('; ')}`,
    `Sizes: ${comp.sizes.values.join('|')} (default ${comp.sizes.default})`,
    `ARIA: ${comp.aria.role}`,
    `Do: ${comp.do[0]}`,
    `Don't: ${comp.dont[0]}`,
    '',
  ];
  return lines.join('\n');
}

function genLlmsIndex(components, eras) {
  const lines = [
    '# Era Widgets',
    '',
    'CSS-first, spec-first UI skins for agents. Canonical API is HTML + ew- classes + data-* attrs.',
    'Set personality with data-era on a root. Do not rewrite markup per era.',
    'Load ONLY the sections you need — do not ingest the whole library.',
    '',
    '## Quick start',
    '- CSS: @groovster/css/era-widgets.css',
    '- MCP: list_eras | get_component | validate | recommend',
    '- Rules: generated/rules/era-widgets.mdc',
    '',
    '## Eras (cards: generated/llms/era-<id>.card.txt)',
    ...eras.map((e) => `- ${e.id}: ${e.identity.oneLiner} (fidelity ~${e.fidelity.recommended.default})`),
    '',
    '## Components (one file each)',
    ...components.map((c) => `- ${c.id}: generated/llms/${c.id}.md`),
    '',
    '## Rules',
    '- Prefer native elements.',
    '- Zero attrs = defaults.',
    '- Glow never counts as contrast.',
    '- Open-license fonts only in default packs.',
    '- Published CSS/JS must import nothing.',
    '',
  ];
  return lines.join('\n');
}

function genEraCard(era) {
  return era.card.lines.join('\n') + '\n';
}

function mcpDefaultReply(comp) {
  // Budget the *real* compact MCP get_component payload (same shape as the server).
  const cssImport = `@groovster/css/${comp.id}.css`;
  const payload = {
    version: '0.1.0-alpha.0',
    name: comp.id,
    html: comp.canonicalHtml,
    css: `import "${cssImport}";`,
    a11y: comp.aria.notes[0],
  };
  return JSON.stringify(payload);
}

export function generateAll() {
  const components = loadComponents();
  const eras = loadEras();
  const budgets = readJson(BUDGETS_PATH);
  const outputs = [];

  const base = path.join(GEN_CSS, 'base.css');
  writeText(base, genBaseCss());
  outputs.push(rel(REPO_ROOT, base));

  const tier3 = readJson(path.join(SPEC_ROOT, 'tokens/tier3/components.shared.tokens.json'));
  const componentsCssVars = `${HEADER}@layer tokens {\n  :root, .ew-root {\n${flattenTokens(tier3).join('\n')}\n  }\n}\n`;
  const componentsTokensPath = path.join(GEN_CSS, 'tokens-components.css');
  writeText(componentsTokensPath, componentsCssVars);
  outputs.push(rel(REPO_ROOT, componentsTokensPath));

  for (const comp of components) {
    const cssPath = path.join(GEN_CSS, `${comp.id}.css`);
    writeText(cssPath, genComponentCss(comp));
    outputs.push(rel(REPO_ROOT, cssPath));

    const docPath = path.join(GEN_DOCS, `${comp.id}.md`);
    writeText(docPath, genDocsStub(comp));
    outputs.push(rel(REPO_ROOT, docPath));

    const llmsPath = path.join(GEN_LLMS, `${comp.id}.md`);
    writeText(llmsPath, genLlmsSection(comp));
    outputs.push(rel(REPO_ROOT, llmsPath));
  }

  for (const era of eras) {
    const cssPath = path.join(GEN_CSS, 'eras', `${era.id}.css`);
    writeText(cssPath, genEraCss(era));
    outputs.push(rel(REPO_ROOT, cssPath));

    const cardPath = path.join(GEN_LLMS, `era-${era.id}.card.txt`);
    writeText(cardPath, genEraCard(era));
    outputs.push(rel(REPO_ROOT, cardPath));
  }

  const indexPath = path.join(GEN_LLMS, 'llms.txt');
  writeText(indexPath, genLlmsIndex(components, eras));
  outputs.push(rel(REPO_ROOT, indexPath));

  generateDialectCss(outputs);

  // Bundle for smoke page
  const bundleParts = [
    fs.readFileSync(path.join(GEN_CSS, 'base.css'), 'utf8'),
    fs.readFileSync(path.join(GEN_CSS, 'tokens-components.css'), 'utf8'),
  ];
  for (const era of eras) {
    bundleParts.push(fs.readFileSync(path.join(GEN_CSS, 'eras', `${era.id}.css`), 'utf8'));
  }
  const dialectsPath = path.join(GEN_CSS, 'dialects.css');
  if (fs.existsSync(dialectsPath)) bundleParts.push(fs.readFileSync(dialectsPath, 'utf8'));
  for (const comp of components) {
    bundleParts.push(fs.readFileSync(path.join(GEN_CSS, `${comp.id}.css`), 'utf8'));
  }
  const bundlePath = path.join(GEN_CSS, 'era-widgets.css');
  writeText(bundlePath, bundleParts.join('\n'));
  outputs.push(rel(REPO_ROOT, bundlePath));

  // Budget snapshots for CI
  const budgetReport = {
    budgets: budgets.budgets,
    measured: {},
  };
  for (const comp of components) {
    const section = fs.readFileSync(path.join(GEN_LLMS, `${comp.id}.md`), 'utf8');
    budgetReport.measured[`llms.section:${comp.id}`] = { chars: section.length, budget: 'llms.section' };
    const mcp = mcpDefaultReply(comp);
    budgetReport.measured[`mcp.defaultReply:${comp.id}`] = { chars: mcp.length, budget: 'mcp.defaultReply' };
    writeText(path.join(GEN_LLMS, `mcp-${comp.id}.default.txt`), mcp);
    outputs.push(rel(REPO_ROOT, path.join(GEN_LLMS, `mcp-${comp.id}.default.txt`)));
  }
  for (const era of eras) {
    const card = fs.readFileSync(path.join(GEN_LLMS, `era-${era.id}.card.txt`), 'utf8');
    budgetReport.measured[`mcp.eraCard:${era.id}`] = { chars: card.length, budget: 'mcp.eraCard' };
  }
  const index = fs.readFileSync(indexPath, 'utf8');
  budgetReport.measured['llms.index'] = { chars: index.length, budget: 'llms.index' };

  generateExtras({ components, eras, outputs });

  const manifest = {
    generatedAt: 'deterministic-build',
    components: components.map((c) => c.id),
    eras: eras.map((e) => e.id),
    outputs: outputs.sort(),
    budgetReport,
  };
  writeText(GEN_MANIFEST, JSON.stringify(manifest, null, 2));

  return manifest;
}
