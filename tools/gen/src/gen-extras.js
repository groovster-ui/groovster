import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, SPEC_ROOT, getOutRoot, outPath } from './paths.js';
import { listFiles, writeText, rel } from './io.js';
import { generateRegistry } from './registry.js';
import { generateDialectCss } from './dialects.js';
import { generateReactPackage } from './react-wrapper.js';

function publishMcpData(outputs) {
  const destRoot = path.join(REPO_ROOT, 'packages/mcp/data');
  fs.rmSync(destRoot, { recursive: true, force: true });
  const groups = [
    ['components', (file) => file.endsWith('.json')],
    ['eras', (file) => file.endsWith('.json')],
    ['tokens', (file) => file.endsWith('.tokens.json')],
    ['recipes', (file) => file.endsWith('.json')],
  ];
  for (const [folder, predicate] of groups) {
    for (const file of listFiles(path.join(SPEC_ROOT, folder), predicate)) {
      const relPath = path.relative(path.join(SPEC_ROOT), file);
      const dest = path.join(destRoot, relPath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(file, dest);
      outputs.push(rel(REPO_ROOT, dest));
    }
  }
  const cardDir = outPath('generated/llms');
  const cardDest = path.join(destRoot, 'llms');
  fs.mkdirSync(cardDest, { recursive: true });
  if (fs.existsSync(cardDir)) {
    for (const name of fs.readdirSync(cardDir)) {
      if (!/^recipe-[a-z0-9-]+\.card\.txt$/.test(name)) continue;
      const dest = path.join(cardDest, name);
      fs.copyFileSync(path.join(cardDir, name), dest);
      outputs.push(rel(REPO_ROOT, dest));
    }
  }
}

export function generateExtras({ components, eras, outputs }) {
  generateReactPackage(components, outputs);
  publishMcpData(outputs);
  // Tokens package dist
  const tokensDist = outPath('packages/tokens/dist');
  for (const tier of ['tier1', 'tier2', 'tier3']) {
    fs.mkdirSync(path.join(tokensDist, tier), { recursive: true });
  }
  for (const file of listFiles(path.join(SPEC_ROOT, 'tokens'), (f) => f.endsWith('.tokens.json'))) {
    const relTok = path.relative(path.join(SPEC_ROOT, 'tokens'), file);
    const dest = path.join(tokensDist, relTok);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    outputs.push(rel(getOutRoot(), dest));
  }
  writeText(
    path.join(tokensDist, 'index.json'),
    JSON.stringify({ version: '0.1.0-alpha.0', eras: eras.map((e) => e.id), tiers: [1, 2, 3] }, null, 2)
  );
  outputs.push(rel(getOutRoot(), path.join(tokensDist, 'index.json')));

  outputs.push(...generateRegistry(components));
  generateDialectCss(outputs);

  const rulesDir = outPath('generated/rules');
  const componentList = components.map((c) => c.id).join(', ');
  const eraIds = eras.map((e) => e.id).join('|');
  const eraList = eras.map((e) => `${e.id} (costume default)`).join(', ');

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
- Fidelity bands only: \`data-fidelity-band="whisper|standard|costume"\` (costume default when absent; \`default\`/\`signature\` deprecated aliases of \`standard\`; ancestor bands inherit).
- Zero attributes = defaults. Prefer native \`<button>\`, \`<dialog>\`, \`<input>\`.
- Hard widgets (APG light-DOM WCs, Zag.js not used): \`ew-tabs\`, \`ew-select\`, \`ew-menu\`, \`ew-popover\`, \`ew-tooltip\`, \`ew-toast-region\`, \`ew-slider\` via \`@groovster/elements/era-elements.js\` (published JS imports nothing).
- CSS: link \`@groovster/css/era-widgets.css\` (published CSS must not use at-import). Packaged OFL WOFF2 faces ship under \`@groovster/css/fonts/\`.
- Ornament classes live on the era packs (Neon: \`.ew-hero__stage\` **required** around sun/mountains/grid, plus \`.ew-chrome\` / \`.ew-script\`; Deco: \`.ew-hero__panel\`, stepped frames) — never demo-only \`<style>\`.
- Glow never counts as contrast; no display faces on controls.
- MCP \`validate\` returns exact "change X to Y" fixes.
- Heroes: ${componentList}. Eras: ${eraList}.
- Website recipes live in \`spec/recipes/\`. Read one card at \`generated/llms/recipe-<id>.card.txt\`.
- Agent skill: \`skills/groovster/SKILL.md\`.
`
  );
  outputs.push(rel(getOutRoot(), path.join(rulesDir, 'era-widgets.mdc')));

  writeText(
    path.join(rulesDir, 'AGENTS.md'),
    `# Era Widgets — agent notes (generated)

Use **HTML** with \`ew-*\` classes. Flip eras with \`data-era\` (${eraIds}).

Fidelity is **bands only**: \`data-fidelity-band="whisper|standard|costume"\` (\`default\`/\`signature\` deprecated aliases of \`standard\`).
**Costume is the default** when the attribute is absent; set whisper/standard to opt down.
The band may be on the era element or an ancestor.

\`\`\`html
<link rel="stylesheet" href="node_modules/@groovster/css/era-widgets.css" />
<div data-era="deco" data-mode="light">
  <button type="button" class="ew-button">Save</button>
</div>
\`\`\`

Ornament: Neon \`.ew-hero\` with required \`.ew-hero__stage\` (sun/mountains/grid) plus \`.ew-chrome\` / \`.ew-script\`; Deco \`.ew-hero__panel\` / stepped frames — documented in \`llms.txt\` and era cards.

MCP tools: list_eras, get_era_spec, get_component, install, recommend, find_recipe, validate.
\`recommend\` names a recipe when the description is a website. Load only that card.
Load only the llms section you need from \`generated/llms/\`.
Portable skill: \`skills/groovster/SKILL.md\`.
`
  );
  outputs.push(rel(getOutRoot(), path.join(rulesDir, 'AGENTS.md')));

  // Layered llms index already written; add pointer file at repo root for agents
  writeText(outPath('llms.txt'), fs.readFileSync(outPath('generated/llms/llms.txt'), 'utf8'));
  outputs.push('llms.txt');

  return outputs;
}
