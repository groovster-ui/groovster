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
import { bandTokenCss, muteBandSel } from './band.js';
import { decoDecoratorCss } from './deco-decorators.js';
import { neonDecoratorCss } from './neon-decorators.js';

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

/** Mute-band selectors (whisper|default|signature) on self or ancestor. */
function muteBandBlock(eraId, decls) {
  return `  ${muteBandSel(eraId)} {
${decls}
  }`;
}

/** Map CSS family name → packaged WOFF2 basenames (latin OFL). Bold when the face is used at 600/700. */
const FONT_FILES = {
  Limelight: { 400: 'Limelight-Regular.woff2' },
  Jost: { 400: 'Jost-Regular.woff2', 700: 'Jost-Bold.woff2' },
  'IBM Plex Mono': { 400: 'IBMPlexMono-Regular.woff2', 700: 'IBMPlexMono-Bold.woff2' },
  Orbitron: { 400: 'Orbitron-Regular.woff2', 700: 'Orbitron-Bold.woff2' },
  'Exo 2': { 400: 'Exo2-Regular.woff2', 700: 'Exo2-Bold.woff2' },
  'Share Tech Mono': { 400: 'ShareTechMono-Regular.woff2' },
  Monoton: { 400: 'Monoton-Regular.woff2' },
  'Mr Dafoe': { 400: 'MrDafoe-Regular.woff2' },
  'Josefin Sans': { 400: 'JosefinSans-Regular.woff2', 700: 'JosefinSans-Bold.woff2' },
  'Nunito Sans': { 400: 'NunitoSans-Regular.woff2', 700: 'NunitoSans-Bold.woff2' },
  'Space Mono': { 400: 'SpaceMono-Regular.woff2', 700: 'SpaceMono-Bold.woff2' },
  Comfortaa: { 400: 'Comfortaa-Regular.woff2', 700: 'Comfortaa-Bold.woff2' },
  Mulish: { 400: 'Mulish-Regular.woff2', 700: 'Mulish-Bold.woff2' },
  'Archivo Black': { 400: 'ArchivoBlack-Regular.woff2' },
  Nunito: { 400: 'Nunito-Regular.woff2', 700: 'Nunito-Bold.woff2' },
  Fraunces: { 400: 'Fraunces-Regular.woff2', 700: 'Fraunces-Bold.woff2' },
  'Source Sans 3': { 400: 'SourceSans3-Regular.woff2', 700: 'SourceSans3-Bold.woff2' },
  'Source Code Pro': { 400: 'SourceCodePro-Regular.woff2', 700: 'SourceCodePro-Bold.woff2' },
  'Source Serif 4': { 400: 'SourceSerif4-Regular.woff2', 700: 'SourceSerif4-Bold.woff2' },
  Yellowtail: { 400: 'Yellowtail-Regular.woff2' },
  'League Spartan': { 400: 'LeagueSpartan-Regular.woff2', 700: 'LeagueSpartan-Bold.woff2' },
  'Work Sans': { 400: 'WorkSans-Regular.woff2', 700: 'WorkSans-Bold.woff2' },
  Oswald: { 400: 'Oswald-Regular.woff2', 700: 'Oswald-Bold.woff2' },
};

/**
 * @font-face with shipped WOFF2 (font-display: swap), including bold faces that are used.
 * Paths are relative to dist/eras/*.css; the era-widgets bundle rewrites them.
 */
function fontFaceBlock(era, { forBundle = false } = {}) {
  if (!era.fonts) return '';
  const families = [era.fonts.display, era.fonts.body, era.fonts.mono].filter(Boolean);
  if (era.id === 'neon') families.push('Monoton', 'Mr Dafoe');
  if (era.id === 'mcm-atomic') {
    if (era.fonts.script) families.push(era.fonts.script);
    if (era.fonts.displayAlt) families.push(era.fonts.displayAlt);
  }
  const unique = [...new Set(families)];
  const prefix = forBundle ? './fonts/' : '../fonts/';
  return unique
    .flatMap((family) => {
      const files = FONT_FILES[family];
      if (!files) {
        return [`@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local("${family}");
}`];
      }
      return Object.entries(files).map(
        ([weight, file]) => `@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("${prefix}${file}") format("woff2"), local("${family}");
}`
      );
    })
    .join('\n');
}

function copyPackagedFonts(outputs) {
  const srcDir = path.join(REPO_ROOT, 'packages/css/fonts');
  const destDir = path.join(GEN_CSS, 'fonts');
  fs.mkdirSync(destDir, { recursive: true });
  if (!fs.existsSync(srcDir)) return;
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    if (fs.statSync(from).isFile()) {
      fs.copyFileSync(from, to);
      outputs.push(rel(REPO_ROOT, to));
    }
  }
}

function genBaseCss() {
  return `${HEADER}@layer reset, tokens, era, components, decorators, overrides;

@layer reset {
  .ew-root, .ew-root * { box-sizing: border-box; }
  .ew-root { margin: 0; }
}

@layer tokens {
${bandTokenCss()}
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
        // Conic rays only — no stray radial dot at 92%/12%.
        bg: `conic-gradient(from 0deg at 92% 12%, transparent 0 10deg, color-mix(in oklch, var(--ew-color-action-bg) 55%, transparent) 10deg 12deg, transparent 12deg 30deg) no-repeat`,
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
  const faces = fontFaceBlock(era);
  const blocks = [HEADER];
  if (faces) blocks.push(faces);
  blocks.push(`@layer tokens {`);
  for (const mode of era.modes) {
    const t1 = readJson(tokenFileFor(era, 'tier1', mode));
    const t2 = readJson(tokenFileFor(era, 'tier2', mode));
    const vars = [...flattenTokens(t1), ...flattenTokens(t2)];
    // Neon defaults to dark (synthwave night) when data-mode is absent; other eras default to light.
    const defaultMode = era.id === 'neon' ? 'dark' : 'light';
    const selector =
      mode === defaultMode
        ? `[data-era="${era.id}"], [data-era="${era.id}"][data-mode="${mode}"]`
        : `[data-era="${era.id}"][data-mode="${mode}"]`;
    blocks.push(`  ${selector} {`);
    blocks.push(`    --ew-era: ${era.id};`);
    blocks.push(`    --ew-mode: ${mode};`);
    blocks.push(...vars);
    // Spec fonts fill gaps when tier1 tokens omit font.* (Deco historically did).
    const hasFont = vars.some((v) => v.includes('--ew-font-display'));
    if (era.fonts && !hasFont) {
      const quote = (name) => (String(name).includes(' ') ? `"${name}"` : name);
      blocks.push(`    --ew-font-display: ${quote(era.fonts.display)}, "Bodoni Moda", serif;`);
      blocks.push(`    --ew-font-body: ${quote(era.fonts.body)}, Futura, system-ui, sans-serif;`);
      if (era.fonts.mono) {
        blocks.push(`    --ew-font-mono: ${quote(era.fonts.mono)}, ui-monospace, monospace;`);
      }
    }
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

  // Mute bands (whisper|default|signature) on self OR ancestor opt down from costume default
  blocks.push(
    muteBandBlock(
      era.id,
      `    --ew-structure-card-ornament-opacity: 0;
    --ew-structure-button-clip: none;
    --ew-structure-card-clip: none;
    --ew-structure-button-shadow: none;
    --ew-structure-card-raised-shadow: var(--ew-elevation-1, none);`
    )
  );
  blocks.push(`}`);
  // Decorators layer: era-specific chrome that changes structure beyond variables
  blocks.push(`@layer decorators {`);
  if (era.id === 'deco') {
    blocks.push(decoDecoratorCss());
  } else if (era.id === 'mcm-atomic') {
    blocks.push(`  [data-era="mcm-atomic"] .ew-card {
    border-radius: var(--ew-structure-surface-radius, 24px);
  }
  [data-era="mcm-atomic"] .ew-card[data-variant="raised"] {
    border-radius: 28px 28px 36px 20px / 24px 32px 22px 30px;
  }
  ${muteBandSel('mcm-atomic', ' .ew-card[data-variant="raised"]')} {
    border-radius: var(--ew-structure-surface-radius, 24px);
  }
  [data-era="mcm-atomic"] .ew-button {
    border-radius: var(--ew-structure-control-radius, 999px);
  }
  [data-era="mcm-atomic"] .ew-card__header h2,
  [data-era="mcm-atomic"] .ew-card__header h3 {
    text-transform: lowercase;
    font-weight: 600;
  }
  [data-era="mcm-atomic"] .ew-text-field__control,
  [data-era="mcm-atomic"] .ew-select__control,
  [data-era="mcm-atomic"] .ew-select__trigger,
  [data-era="mcm-atomic"] .ew-textarea__control {
    border-radius: var(--ew-structure-field-radius, 16px);
    border-width: 2px;
    border-style: solid;
    border-color: var(--ew-color-field-border);
    background: var(--ew-color-field-bg);
    box-shadow: inset 0 0 0 1px color-mix(in oklch, var(--ew-color-fg-default) 18%, transparent);
  }
  [data-era="mcm-atomic"] .ew-radio__control:not(:checked) + .ew-radio__disc,
  [data-era="mcm-atomic"] .ew-checkbox__control:not(:checked) + .ew-checkbox__box {
    border-width: 2px;
    border-style: solid;
    border-color: var(--ew-color-border-strong);
    background: var(--ew-color-field-bg);
  }
  [data-era="mcm-atomic"] .ew-checkbox__control:checked + .ew-checkbox__box {
    background: var(--ew-color-action-bg);
    border-color: var(--ew-color-action-bg);
  }
  [data-era="mcm-atomic"] .ew-radio__control:checked + .ew-radio__disc {
    background: var(--ew-color-field-bg);
    border-color: var(--ew-color-border-strong);
  }
  [data-era="mcm-atomic"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-fg-default);
  }
  [data-era="mcm-atomic"] .ew-switch__control:not(:checked) + .ew-switch__track {
    border: 2px solid var(--ew-color-border-strong);
    background: var(--ew-color-field-bg);
  }
  [data-era="mcm-atomic"] .ew-switch__control:checked + .ew-switch__track {
    background: var(--ew-color-track-on, var(--ew-color-action-bg));
    border-color: var(--ew-color-border-strong);
  }
  [data-era="mcm-atomic"] .ew-switch__control:checked + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-bg-elevated, #fff);
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
    blocks.push(neonDecoratorCss());
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
  /* Off-state switch: knob + track edge ≥3:1 against the card surface */
  [data-era="neutral"] .ew-switch__track {
    border: 2px solid var(--ew-color-border-strong);
  }
  [data-era="neutral"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-fg-default);
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
  ${muteBandSel('memphis', ' .ew-card__header::before')} { display: none; }
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
  ${muteBandSel('groovy', ' .ew-card__header::after')} { display: none; }
  [data-era="groovy"] .ew-text-field__control,
  [data-era="groovy"] .ew-select__control,
  [data-era="groovy"] .ew-select__trigger,
  [data-era="groovy"] .ew-textarea__control {
    border-radius: 999px;
    border-width: 2px;
    border-style: solid;
    border-color: var(--ew-color-field-border);
    background: var(--ew-color-field-bg);
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
    border: 2px solid var(--ew-color-border-strong);
    box-shadow: none;
  }
  [data-era="groovy"] .ew-switch__control:not(:checked) + .ew-switch__track .ew-switch__thumb {
    background: var(--ew-color-fg-default);
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
  ${muteBandSel('earth', ' .ew-card__header::after')} { display: none; }
  [data-era="earth"] .ew-text-field__control,
  [data-era="earth"] .ew-select__control,
  [data-era="earth"] .ew-select__trigger,
  [data-era="earth"] .ew-textarea__control {
    border-radius: 6px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--ew-color-field-border);
    border-bottom-width: 2px;
    background: var(--ew-color-field-bg);
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
    ...eras.map((e) => `- ${e.id}: ${e.identity.oneLiner}`),
    '',
    '## Fidelity & ornament',
    '- Bands: `whisper|standard|costume` (costume default; `default`/`signature` → standard).',
    '- Neon costume heroes **require** `.ew-hero__stage` wrapping `.ew-hero__sun` / `__mountains` / `__grid` (also `.ew-chrome`, `.ew-script`, `.ew-sun-mark`).',
    '- Deco: `.ew-hero__panel` / backdrop / rays / fan; stepped frames; `.ew-ornament-divider`.',
    '- Docs: `demos/showcase/NEON.md`, `FIDELITY.md`. Fonts: OFL WOFF2 in `packages/css/fonts`.',
    '',
    '## Components (one file each)',
    ...components.map((c) => `- ${c.id}: generated/llms/${c.id}.md`),
    '',
    '## Rules',
    '- Prefer native elements. Zero attrs = defaults. Glow ≠ contrast.',
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

  copyPackagedFonts(outputs);

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
  // Era CSS uses ../fonts/ (from dist/eras/); rewrite for dist/era-widgets.css.
  const bundleCss = bundleParts.join('\n').replaceAll('url("../fonts/', 'url("./fonts/');
  writeText(bundlePath, bundleCss);
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
