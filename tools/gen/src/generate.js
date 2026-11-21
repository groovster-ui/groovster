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

function genBaseCss() {
  return `${HEADER}@layer reset, tokens, era, components, decorators, overrides;

@layer reset {
  .ew-root, .ew-root * { box-sizing: border-box; }
  .ew-root { margin: 0; }
}

@layer tokens {
  :root, .ew-root, [data-era] {
    color-scheme: light dark;
  }
}
`;
}

function genComponentCss(comp) {
  const cls = comp.className;
  const lines = [
    HEADER,
    `@layer components {`,
    `  .${cls} {`,
    `    /* anatomy: ${comp.anatomy.map((a) => a.part).join(', ')} */`,
    `    font: inherit;`,
    `  }`,
  ];

  if (comp.id === 'button') {
    lines.push(`  .${cls} {
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
  .${cls}[data-size="sm"] { padding: 4px 10px; font-size: 12px; letter-spacing: calc(var(--ew-structure-button-letter-spacing, 0) * 0.7); }
  .${cls}[data-size="lg"] { padding: 12px 22px; font-size: 16px; }
  @media (prefers-reduced-motion: reduce) {
    .${cls} { transition: none; }
  }`);
  } else if (comp.id === 'text-field') {
    lines.push(`  .${cls} { display: grid; gap: 6px; font-family: var(--ew-font-body, system-ui, sans-serif); }
  .${cls}__label { color: var(--ew-color-fg-default, inherit); font-size: 14px; }
  .${cls}__control {
    padding: var(--ew-field-padding-y, 8px) var(--ew-field-padding-x, 12px);
    border: 1px solid var(--ew-color-field-border, #888);
    border-radius: var(--ew-field-radius, var(--ew-radius-md, 8px));
    background: var(--ew-color-field-bg, #fff);
    color: var(--ew-color-fg-default, inherit);
    font: inherit;
  }
  .${cls}__control:focus-visible { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 1px; }
  .${cls}__description, .${cls}__error { font-size: 12px; color: var(--ew-color-fg-muted, #666); }
  .${cls}[data-invalid="true"] .${cls}__error, .${cls}__error { color: var(--ew-color-danger-bg, #a33); }`);
  } else if (comp.id === 'card') {
    lines.push(`  .${cls} {
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
  .${cls}__header {
    display: grid;
    gap: 8px;
  }
  .${cls}__header h3, .${cls}__header h2 {
    margin: 0;
    font-family: var(--ew-font-display, inherit);
    letter-spacing: var(--ew-structure-card-title-tracking, 0);
  }
  .${cls}__header[data-rule]::after,
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
  .${cls} > * { position: relative; z-index: 1; }`);
  } else if (comp.id === 'dialog') {
    lines.push(`  .${cls} {
    border: 1px solid var(--ew-color-border-strong, #888);
    border-radius: var(--ew-dialog-radius, var(--ew-radius-lg, 12px));
    padding: var(--ew-dialog-padding, 24px);
    max-width: var(--ew-dialog-max-width, 420px);
    background: var(--ew-color-bg-elevated, #fff);
    color: var(--ew-color-fg-default, inherit);
    box-shadow: var(--ew-elevation-dialog, none);
    font-family: var(--ew-font-body, system-ui, sans-serif);
  }
  .${cls}::backdrop { background: var(--ew-color-overlay, rgb(0 0 0 / 0.45)); }
  .${cls}__header h2 { margin: 0 0 12px; font-family: var(--ew-font-display, inherit); }
  .${cls}__footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }`);
  } else if (comp.id === 'tabs') {
    lines.push(`  .${cls} { display: grid; gap: 12px; font-family: var(--ew-font-body, system-ui, sans-serif); }
  .${cls} [role="tablist"] {
    display: flex;
    gap: var(--ew-tabs-gap, 8px);
    border-bottom: 1px solid var(--ew-color-border-subtle, #ccc);
  }
  .${cls}[data-orientation="vertical"] [role="tablist"] { flex-direction: column; border-bottom: 0; border-inline-end: 1px solid var(--ew-color-border-subtle, #ccc); }
  .${cls} [role="tab"] {
    appearance: none;
    background: transparent;
    border: 0;
    border-bottom: var(--ew-tabs-indicator-size, 2px) solid transparent;
    padding: 8px 12px;
    color: var(--ew-color-fg-muted, #666);
    font: inherit;
    cursor: pointer;
  }
  .${cls} [role="tab"][aria-selected="true"] {
    color: var(--ew-color-fg-default, inherit);
    border-bottom-color: var(--ew-color-action-bg, currentColor);
  }
  .${cls} [role="tab"]:focus-visible { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 2px; }
  .${cls} [role="tabpanel"] { color: var(--ew-color-fg-default, inherit); }`);
  } else if (comp.id === 'switch') {
    lines.push(`  .${cls} {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--ew-font-body, system-ui, sans-serif);
    cursor: pointer;
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
    border-radius: var(--ew-radius-pill, 999px);
    background: var(--ew-color-track-off, #ccc);
    display: inline-flex;
    align-items: center;
    padding: 3px;
    transition: background var(--ew-motion-switch, 160ms) ease;
  }
  .${cls}__thumb {
    width: var(--ew-switch-thumb-size, 18px);
    height: var(--ew-switch-thumb-size, 18px);
    border-radius: 50%;
    background: var(--ew-color-fg-inverse, #fff);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.25);
    transition: transform var(--ew-motion-switch, 160ms) ease;
  }
  .${cls}__control:checked + .${cls}__track { background: var(--ew-color-track-on, #334); }
  .${cls}__control:checked + .${cls}__track .${cls}__thumb { transform: translateX(20px); }
  .${cls}__control:focus-visible + .${cls}__track { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 2px; }
  .${cls}__label { color: var(--ew-color-fg-default, inherit); }
  @media (prefers-reduced-motion: reduce) {
    .${cls}__track, .${cls}__thumb { transition: none; }
  }`);
  } else {
    lines.push(`  /* stub styles for ${comp.id} */`);
  }

  lines.push(`}`);
  return lines.join('\n') + '\n';
}

function ornamentVars(kind) {
  switch (kind) {
    case 'chevron':
      return {
        content: '""',
        opacity: '0.35',
        bg: `linear-gradient(135deg, transparent 40%, var(--ew-color-border-strong) 40%, var(--ew-color-border-strong) 45%, transparent 45%) top left / 28px 14px no-repeat,
      linear-gradient(225deg, transparent 40%, var(--ew-color-border-strong) 40%, var(--ew-color-border-strong) 45%, transparent 45%) top right / 28px 14px no-repeat`,
        size: 'auto',
        blend: 'normal',
      };
    case 'starburst':
      return {
        content: '""',
        opacity: '0.22',
        bg: `radial-gradient(circle at 92% 12%, var(--ew-color-action-bg) 0 2px, transparent 3px),
      conic-gradient(from 0deg at 92% 12%, transparent 0 10deg, color-mix(in oklch, var(--ew-color-action-bg) 55%, transparent) 10deg 12deg, transparent 12deg 30deg)`,
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
  ];
  return lines;
}

function genEraCss(era) {
  const blocks = [HEADER, `@layer era {`];
  for (const mode of era.modes) {
    const tier1Path = path.join(REPO_ROOT, ...era.tokenFiles.find((f) => f.includes(`.${mode}.`)).split('/'));
    const tier2Path = path.join(REPO_ROOT, ...era.tokenFiles.find((f) => f.includes('.shared.tokens') && f.includes('tier2')).split('/'));
    const t1 = readJson(tier1Path);
    const t2 = readJson(tier2Path);
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
    blocks.push(`  [data-era="deco"] .ew-card__header::after {
    content: "";
    display: block;
    height: 3px;
    margin-top: 8px;
    background:
      linear-gradient(90deg, transparent 0, var(--ew-color-border-strong) 8%, var(--ew-color-border-strong) 92%, transparent 100%),
      repeating-linear-gradient(90deg, var(--ew-color-border-strong) 0 6px, transparent 6px 10px);
    background-size: 100% 1px, 100% 3px;
    background-position: center, center;
    background-repeat: no-repeat;
  }
  [data-era="deco"][data-fidelity-band="whisper"] .ew-card__header::after { display: none; }
  [data-era="deco"] .ew-button[data-variant="secondary"] {
    border-style: double;
    border-width: 3px;
  }`);
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
  }`);
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
  }`);
  } else if (era.id === 'neutral') {
    blocks.push(`  [data-era="neutral"] .ew-button {
    border-radius: var(--ew-structure-control-radius, 8px);
  }
  [data-era="neutral"] .ew-card {
    border-radius: var(--ew-structure-surface-radius, 12px);
  }`);
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
    '',
    '## Eras',
    ...eras.map((e) => `- ${e.id}: ${e.identity.oneLiner} (fidelity ~${e.fidelity.recommended.default})`),
    '',
    '## Components (load one section)',
    ...components.map((c) => `- ${c.id}: generated/llms/${c.id}.md`),
    '',
    '## Rules',
    '- Prefer native elements.',
    '- Zero attrs = defaults.',
    '- Glow never counts as contrast.',
    '- Open-license fonts only in default packs.',
    '',
  ];
  return lines.join('\n');
}

function genEraCard(era) {
  return era.card.lines.join('\n') + '\n';
}

function mcpDefaultReply(comp) {
  const html = comp.canonicalHtml;
  const imp = (comp.imports || [])[0] || '@era-widgets/css/' + comp.id + '.css';
  return [
    `<!-- ${comp.name} -->`,
    html,
    '',
    `import "${imp}";`,
    `a11y: ${comp.aria.notes[0]}`,
  ].join('\n');
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

  // Bundle for smoke page
  const bundleParts = [
    fs.readFileSync(path.join(GEN_CSS, 'base.css'), 'utf8'),
    fs.readFileSync(path.join(GEN_CSS, 'tokens-components.css'), 'utf8'),
  ];
  for (const era of eras) {
    bundleParts.push(fs.readFileSync(path.join(GEN_CSS, 'eras', `${era.id}.css`), 'utf8'));
  }
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
