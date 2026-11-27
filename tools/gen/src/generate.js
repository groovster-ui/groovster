import fs from 'node:fs';
import path from 'node:path';
import { transformSync } from 'esbuild';
import {
  BUDGETS_PATH,
  REPO_ROOT,
  SPEC_ROOT,
  getGenCss,
  getGenDocs,
  getGenLlms,
  getGenManifest,
  getOutRoot,
} from './paths.js';
import { listFiles, readJson, writeText, rel } from './io.js';
import { flattenTokens } from './tokens-to-css.js';
import { genComponentCss } from './component-css.js';
import { generateExtras } from './gen-extras.js';
import { generateDialectCss } from './dialects.js';
import { bandTokenCss, muteBandSel } from './band.js';
import { decoDecoratorCss } from './deco-decorators.js';
import { atomicDecoratorCss } from './atomic-decorators.js';
import { neonDecoratorCss } from './neon-decorators.js';
import { modernistDecoratorCss } from './modernist-decorators.js';
import { nouveauDecoratorCss } from './nouveau-decorators.js';
import { memphisDecoratorCss } from './memphis-decorators.js';
import { groovyDecoratorCss } from './groovy-decorators.js';
import { appEraCss } from './app-era.js';
import { loadRecipes, recipeIndexLines, writeRecipeDocs } from './recipes.js';
import { additionalEraCss } from './additional-era-decorators.js';
import { loadEraCatalog } from './era-catalog.js';
import { matrixDocument } from '../../../tests/a11y/matrix-html.mjs';

const HEADER = '/* GENERATED FILE — do not edit. Source: spec/. Run: pnpm gen */\n';

function loadComponents() {
  return listFiles(path.join(SPEC_ROOT, 'components'), (f) => f.endsWith('.json'))
    .map((f) => readJson(f))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function loadEras() {
  return loadEraCatalog(REPO_ROOT);
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
  'Courier Prime': { 400: 'CourierPrime-Regular.woff2' },
  Comfortaa: { 400: 'Comfortaa-Regular.woff2', 700: 'Comfortaa-Bold.woff2' },
  'Spicy Rice': { 400: 'SpicyRice-Regular.woff2' },
  'Lilita One': { 400: 'LilitaOne-Regular.woff2' },
  Mulish: { 400: 'Mulish-Regular.woff2', 700: 'Mulish-Bold.woff2' },
  'Archivo Black': { 400: 'ArchivoBlack-Regular.woff2' },
  Nunito: { 400: 'Nunito-Regular.woff2', 700: 'Nunito-Bold.woff2' },
  Fraunces: { 400: 'Fraunces-Regular.woff2', 700: 'Fraunces-Bold.woff2' },
  'Cormorant Garamond': {
    400: 'CormorantGaramond-Regular.woff2',
    600: 'CormorantGaramond-SemiBold.woff2',
    700: 'CormorantGaramond-Bold.woff2',
    i400: 'CormorantGaramond-Italic.woff2',
  },
  Bellefair: { 400: 'Bellefair-Regular.woff2' },
  'Source Sans 3': { 400: 'SourceSans3-Regular.woff2', 700: 'SourceSans3-Bold.woff2' },
  'Inter Tight': { 400: 'InterTight-Regular.woff2', 700: 'InterTight-Bold.woff2' },
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
  // Optional font roles work for any era, including independently contributed eras.
  if (era.fonts.script) families.push(era.fonts.script);
  if (era.fonts.displayAlt) families.push(era.fonts.displayAlt);
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
      return Object.entries(files).map(([key, file]) => {
        const italic = String(key).startsWith('i');
        const weight = italic ? String(key).slice(1) : key;
        return `@font-face {
  font-family: "${family}";
  font-style: ${italic ? 'italic' : 'normal'};
  font-weight: ${weight};
  font-display: swap;
  src: url("${prefix}${file}") format("woff2"), local("${family}");
}`;
      });
    })
    .join('\n');
}

function copyPackagedFonts(outputs) {
  const srcDir = path.join(REPO_ROOT, 'packages/css/fonts');
  const destDir = path.join(getGenCss(), 'fonts');
  const outRoot = getOutRoot();
  fs.mkdirSync(destDir, { recursive: true });
  if (!fs.existsSync(srcDir)) return;
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    if (fs.statSync(from).isFile()) {
      fs.copyFileSync(from, to);
      outputs.push(rel(outRoot, to));
    }
  }
}

function genBaseCss() {
  return `${HEADER}@layer reset, tokens, era, components, decorators, overrides;

@layer reset {
  .ew-root, .ew-root * { box-sizing: border-box; }
  .ew-root { margin: 0; overflow-x: clip; }
  .ew-button, .ew-icon-button, .ew-checkbox, .ew-radio, .ew-switch, .ew-select__trigger {
    min-height: 24px;
  }
  .ew-icon-button { min-width: 24px; }
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

  .ew-truncate,
  .ew-card__title--truncate,
  .ew-list-item__primary,
  .ew-media-card__title.ew-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: normal;
    min-width: 0;
    max-width: 100%;
  }
  .ew-clamp-2, .ew-clamp-3, .ew-product-card__title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
    min-width: 0;
    max-width: 100%;
  }
  .ew-clamp-2, .ew-product-card__title { -webkit-line-clamp: 2; line-clamp: 2; }
  .ew-product-card__title {
    font-family: var(--ew-font-body, system-ui, sans-serif);
    text-transform: none;
    letter-spacing: normal;
    font-size: 0.95rem;
    line-height: 1.3;
    font-weight: 600;
    max-height: 2.6em;
  }
  .ew-clamp-3 { -webkit-line-clamp: 3; line-clamp: 3; }

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

/** Drop `--token: var(--token)` cycles. Tier-2 `color.danger.fg` aliases the tier-1 name and would erase the literal. */
function withoutSelfReference(vars) {
  return vars.filter((line) => {
    const match = line.match(/--([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)\s*;/i);
    return !(match && match[1] === match[2]);
  });
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
    const vars = withoutSelfReference([...flattenTokens(t1), ...flattenTokens(t2)]);
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
    blocks.push(atomicDecoratorCss());
  } else if (era.id === 'neon') {
    blocks.push(neonDecoratorCss());
  } else if (era.id === 'art-nouveau') {
    blocks.push(nouveauDecoratorCss());
  } else if (era.id === 'swiss' || era.id === 'bauhaus') {
    blocks.push(modernistDecoratorCss(era.id));
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
    blocks.push(memphisDecoratorCss());
  } else if (era.id === 'groovy') {
    blocks.push(groovyDecoratorCss());
  }
  blocks.push(appEraCss(era.id));
  blocks.push(additionalEraCss(era.id));
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

function genLlmsIndex(components, eras, recipes = []) {
  const lines = [
    '# Era Widgets',
    '',
    'CSS-first, spec-first skins for agents. API: HTML + ew- classes + data-*.',
    'Set data-era on root; reuse HTML across eras.',
    'Load only needed sections; avoid full-library context.',
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
    '- Costume heroes use `.ew-hero__stage` and `.ew-hero__panel`; see era cards.',
    '',
    '## Components (one file each)',
    ...components.map((c) => `- ${c.id}: generated/llms/${c.id}.md`),
    '',
    ...recipeIndexLines(recipes),
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
  const GEN_CSS = getGenCss();
  const GEN_DOCS = getGenDocs();
  const GEN_LLMS = getGenLlms();
  const GEN_MANIFEST = getGenManifest();
  const outRoot = getOutRoot();

  const components = loadComponents();
  const eras = loadEras();
  const recipes = loadRecipes();
  const budgets = readJson(BUDGETS_PATH);
  const outputs = [];

  copyPackagedFonts(outputs);

  const base = path.join(GEN_CSS, 'base.css');
  writeText(base, genBaseCss());
  outputs.push(rel(outRoot, base));

  const tier3 = readJson(path.join(SPEC_ROOT, 'tokens/tier3/components.shared.tokens.json'));
  const componentsCssVars = `${HEADER}@layer tokens {\n  :root, .ew-root {\n${flattenTokens(tier3).join('\n')}\n  }\n}\n`;
  const componentsTokensPath = path.join(GEN_CSS, 'tokens-components.css');
  writeText(componentsTokensPath, componentsCssVars);
  outputs.push(rel(outRoot, componentsTokensPath));

  for (const comp of components) {
    const cssPath = path.join(GEN_CSS, `${comp.id}.css`);
    writeText(cssPath, genComponentCss(comp));
    outputs.push(rel(outRoot, cssPath));

    const docPath = path.join(GEN_DOCS, `${comp.id}.md`);
    writeText(docPath, genDocsStub(comp));
    outputs.push(rel(outRoot, docPath));

    const llmsPath = path.join(GEN_LLMS, `${comp.id}.md`);
    writeText(llmsPath, genLlmsSection(comp));
    outputs.push(rel(outRoot, llmsPath));
  }

  for (const era of eras) {
    const cssPath = path.join(GEN_CSS, 'eras', `${era.id}.css`);
    writeText(cssPath, genEraCss(era));
    outputs.push(rel(outRoot, cssPath));

    const cardPath = path.join(GEN_LLMS, `era-${era.id}.card.txt`);
    writeText(cardPath, genEraCard(era));
    outputs.push(rel(outRoot, cardPath));
  }

  const indexPath = path.join(GEN_LLMS, 'llms.txt');
  writeText(indexPath, genLlmsIndex(components, eras, recipes));
  outputs.push(rel(outRoot, indexPath));
  writeRecipeDocs({ recipes, components, outputs });

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
  // Existing build-time esbuild removes repetition in the all-era delivery bundle.
  // Standalone era/component CSS files stay readable and are not minified here.
  const compactBundle = transformSync(bundleCss, { loader: 'css', minify: true, charset: 'utf8' }).code;
  writeText(bundlePath, compactBundle);
  outputs.push(rel(outRoot, bundlePath));

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
    outputs.push(rel(outRoot, path.join(GEN_LLMS, `mcp-${comp.id}.default.txt`)));
  }
  for (const era of eras) {
    const card = fs.readFileSync(path.join(GEN_LLMS, `era-${era.id}.card.txt`), 'utf8');
    budgetReport.measured[`mcp.eraCard:${era.id}`] = { chars: card.length, budget: 'mcp.eraCard' };
  }
  const index = fs.readFileSync(indexPath, 'utf8');
  budgetReport.measured['llms.index'] = { chars: index.length, budget: 'llms.index' };
  for (const recipe of recipes) {
    const cardPath = path.join(GEN_LLMS, `recipe-${recipe.id}.card.txt`);
    const card = fs.readFileSync(cardPath, 'utf8');
    budgetReport.measured[`llms.recipeCard:${recipe.id}`] = { chars: card.length, budget: 'llms.recipeCard' };
  }

  generateExtras({ components, eras, outputs });

  const matrixPath = path.join(getOutRoot(), 'tests/a11y/fixtures/matrix.html');
  writeText(matrixPath, matrixDocument(REPO_ROOT));
  outputs.push(rel(outRoot, matrixPath));

  const shellPath = path.join(getOutRoot(), 'demos/recipes/shared/shell.js');
  if (fs.existsSync(shellPath)) {
    const shell = fs.readFileSync(shellPath, 'utf8');
    const eraIds = JSON.stringify(eras.map((era) => era.id));
    const eraPairs = JSON.stringify(eras.map((era) => [era.id, era.name]));
    const eraBlock = /^ {2}const ERA_IDS = .*\n {2}const ERAS = .*$/m;
    if (!eraBlock.test(shell)) throw new Error('demos/recipes/shared/shell.js is missing the era catalog block');
    const nextShell = shell.replace(
      eraBlock,
      `  const ERA_IDS = ${eraIds};\n  const ERAS = ${eraPairs};`,
    );
    if (nextShell !== shell) writeText(shellPath, nextShell);
  }

  const elementsDist = path.join(outRoot, 'packages/elements/dist');
  if (fs.existsSync(elementsDist)) {
    for (const name of fs.readdirSync(elementsDist)) {
      const full = path.join(elementsDist, name);
      if (fs.statSync(full).isFile()) outputs.push(rel(outRoot, full));
    }
  }

  const manifest = {
    generatedAt: 'deterministic-build',
    components: components.map((c) => c.id),
    eras: eras.map((e) => e.id),
    recipes: recipes.map((recipe) => recipe.id),
    outputs: [...new Set([...outputs, 'generated/manifest.json'])].sort(),
    budgetReport,
  };
  writeText(GEN_MANIFEST, JSON.stringify(manifest, null, 2));

  return manifest;
}

