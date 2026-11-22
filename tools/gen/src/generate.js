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
    const resolvedTokens = new Set();
    const t1Vars = flattenTokens(t1, [], resolvedTokens);
    const t2Vars = flattenTokens(t2, [], resolvedTokens);
    const vars = [...t1Vars, ...t2Vars];
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
  }
  [data-era="deco"] .ew-text-field__control {
    border-style: double;
    border-radius: 0;
  }
  [data-era="deco"] .ew-dialog {
    border-style: double;
    border-radius: 0;
  }
  [data-era="deco"] .ew-switch__track,
  [data-era="deco"] .ew-switch__thumb { border-radius: 0; }
  [data-era="deco"] .ew-tabs [role="tablist"],
  [data-era="deco"] ew-tabs [role="tablist"] {
    border-bottom-style: double;
    border-bottom-width: 3px;
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
    'Load ONLY the sections you need — do not ingest the whole library.',
    '',
    '## Quick start',
    '- CSS: @era-widgets/css/era-widgets.css',
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
