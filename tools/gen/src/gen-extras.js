import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, SPEC_ROOT } from './paths.js';
import { listFiles, writeText, rel } from './io.js';
import { generateRegistry } from './registry.js';
import { generateDialectCss } from './dialects.js';

export function generateExtras({ components, eras, outputs }) {
  // Tokens package dist
  const tokensDist = path.join(REPO_ROOT, 'packages/tokens/dist');
  for (const tier of ['tier1', 'tier2', 'tier3']) {
    fs.mkdirSync(path.join(tokensDist, tier), { recursive: true });
  }
  for (const file of listFiles(path.join(SPEC_ROOT, 'tokens'), (f) => f.endsWith('.tokens.json'))) {
    const relTok = path.relative(path.join(SPEC_ROOT, 'tokens'), file);
    const dest = path.join(tokensDist, relTok);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    outputs.push(rel(REPO_ROOT, dest));
  }
  writeText(
    path.join(tokensDist, 'index.json'),
    JSON.stringify({ version: '0.1.0-alpha.0', eras: eras.map((e) => e.id), tiers: [1, 2, 3] }, null, 2)
  );
  outputs.push(rel(REPO_ROOT, path.join(tokensDist, 'index.json')));

  outputs.push(...generateRegistry(components));
  generateDialectCss(outputs);

  const rulesDir = path.join(REPO_ROOT, 'generated/rules');
  const componentList = components.map((c) => c.id).join(', ');
  const eraIds = eras.map((e) => e.id).join('|');
  const eraList = eras.map((e) => `${e.id} (~${e.fidelity.recommended.default})`).join(', ');

  writeText(
    path.join(rulesDir, 'era-widgets.mdc'),
    `---
description: Era Widgets — CSS-first agent rules (generated)
globs:
  - "**/*.{html,css,tsx,jsx,vue,svelte}"
---

# Era Widgets

- Canonical API is **HTML + \`ew-*\` classes + \`data-*\`**, not React props.
- Set personality with \`data-era\` on a root (${eraIds}). Do not rewrite markup per era.
- Zero attributes = defaults. Prefer native \`<button>\`, \`<dialog>\`, \`<input>\`.
- Hard widgets (APG light-DOM WCs, Zag.js not used): \`ew-tabs\`, \`ew-select\`, \`ew-menu\`, \`ew-popover\`, \`ew-tooltip\`, \`ew-toast-region\`, \`ew-slider\` via \`@era-widgets/elements/era-elements.js\` (published JS imports nothing).
- CSS: link \`@era-widgets/css/era-widgets.css\` (published CSS must not use at-import).
- Glow never counts as contrast; no display faces on controls.
- MCP \`validate\` returns exact "change X to Y" fixes.
- Heroes: ${componentList}. Eras: ${eraList}.
`
  );
  outputs.push(rel(REPO_ROOT, path.join(rulesDir, 'era-widgets.mdc')));

  writeText(
    path.join(rulesDir, 'AGENTS.md'),
    `# Era Widgets — agent notes (generated)

Use **HTML** with \`ew-*\` classes. Flip eras with \`data-era\` (${eraIds}).

\`\`\`html
<link rel="stylesheet" href="node_modules/@era-widgets/css/era-widgets.css" />
<div data-era="deco" data-mode="light">
  <button type="button" class="ew-button">Save</button>
</div>
\`\`\`

MCP tools: list_eras, get_era_spec, get_component, install, recommend, validate.
Load only the llms section you need from \`generated/llms/\`.
`
  );
  outputs.push(rel(REPO_ROOT, path.join(rulesDir, 'AGENTS.md')));

  // Layered llms index already written; add pointer file at repo root for agents
  writeText(
    path.join(REPO_ROOT, 'llms.txt'),
    fs.readFileSync(path.join(REPO_ROOT, 'generated/llms/llms.txt'), 'utf8')
  );
  outputs.push('llms.txt');

  return outputs;
}
