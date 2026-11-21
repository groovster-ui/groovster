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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ew-button-gap, 8px);
    padding: var(--ew-button-padding-y, 8px) var(--ew-button-padding-x, 16px);
    border: 1px solid var(--ew-color-border-strong, currentColor);
    border-radius: var(--ew-button-radius, var(--ew-radius-md, 8px));
    background: var(--ew-color-action-bg, #334);
    color: var(--ew-color-action-fg, #fff);
    font-size: var(--ew-button-font-size, 14px);
    font-family: var(--ew-font-body, system-ui, sans-serif);
    cursor: pointer;
  }
  .${cls}:hover { background: var(--ew-color-action-hover, #223); }
  .${cls}:focus-visible { outline: 2px solid var(--ew-color-field-focus, Highlight); outline-offset: 2px; }
  .${cls}:disabled { opacity: 0.5; cursor: not-allowed; }
  .${cls}[data-variant="secondary"] {
    background: transparent;
    color: var(--ew-color-fg-default, inherit);
  }
  .${cls}[data-variant="ghost"] {
    background: transparent;
    border-color: transparent;
    color: var(--ew-color-fg-default, inherit);
  }
  .${cls}[data-variant="danger"] {
    background: var(--ew-color-danger-bg, #a33);
    color: var(--ew-color-danger-fg, #fff);
  }
  .${cls}[data-size="sm"] { padding: 4px 10px; font-size: 12px; }
  .${cls}[data-size="lg"] { padding: 12px 20px; font-size: 16px; }`);
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
    display: grid;
    gap: var(--ew-card-gap, 12px);
    padding: var(--ew-card-padding, 16px);
    border: 1px solid var(--ew-color-border-subtle, #ccc);
    border-radius: var(--ew-card-radius, var(--ew-radius-lg, 12px));
    background: var(--ew-color-bg-surface, #f6f6f6);
    color: var(--ew-color-fg-default, inherit);
    box-shadow: var(--ew-elevation-1, none);
    font-family: var(--ew-font-body, system-ui, sans-serif);
  }
  .${cls}[data-variant="raised"] { box-shadow: var(--ew-elevation-2, none); background: var(--ew-color-bg-elevated, #fff); }
  .${cls}[data-variant="outline"] { box-shadow: none; }
  .${cls}[data-variant="flat"] { border-color: transparent; box-shadow: none; }
  .${cls}[data-variant="inset"] { box-shadow: inset 0 1px 2px color-mix(in oklch, black 12%, transparent); }
  .${cls}__header h3, .${cls}__header h2 { margin: 0; font-family: var(--ew-font-display, inherit); }
  .${cls}__body { margin: 0; }
  .${cls}__footer { display: flex; gap: 8px; flex-wrap: wrap; }`);
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
    // Also support prefers-color-scheme when data-mode omitted for dark packs — keep explicit for smoke.
    blocks.push(`  ${selector} {`);
    blocks.push(`    --ew-era: ${era.id};`);
    blocks.push(`    --ew-mode: ${mode};`);
    if (t1.font) {
      // already flattened
    }
    blocks.push(...vars);
    // Map common semantic shortcuts used by components
    blocks.push(`    color: var(--ew-color-fg-default);`);
    blocks.push(`    background: var(--ew-color-bg-page);`);
    blocks.push(`    font-family: var(--ew-font-body, system-ui, sans-serif);`);
    blocks.push(`  }`);
  }

  // fidelity hooks (structure only in Phase 0)
  blocks.push(`  [data-era="${era.id}"] {`);
  blocks.push(`    --ew-fidelity-default: ${era.fidelity.recommended.default};`);
  blocks.push(`  }`);
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
