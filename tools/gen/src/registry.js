import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, SPEC_ROOT } from './paths.js';
import { listFiles, readJson, writeText, rel } from './io.js';

const REG_ROOT = path.join(REPO_ROOT, 'registry');

function itemFor(comp) {
  const cssPath = path.join(REPO_ROOT, 'packages/css/dist', `${comp.id}.css`);
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const files = [
    {
      path: `era-widgets/${comp.id}.css`,
      content: css,
      type: 'registry:file',
      target: `styles/era-widgets/${comp.id}.css`,
    },
  ];
  if (comp.id === 'tabs') {
    const el = fs.readFileSync(path.join(REPO_ROOT, 'packages/elements/dist/ew-tabs.js'), 'utf8');
    files.push({
      path: 'era-widgets/ew-tabs.js',
      content: el,
      type: 'registry:file',
      target: 'components/era-widgets/ew-tabs.js',
    });
  }
  // HTML example as a snippet file agents/shadcn can drop
  files.push({
    path: `era-widgets/${comp.id}.example.html`,
    content: `<!-- Era Widgets ${comp.name} — set data-era on an ancestor -->\n${comp.canonicalHtml}\n`,
    type: 'registry:file',
    target: `components/era-widgets/${comp.id}.example.html`,
  });

  return {
    name: `ew-${comp.id}`,
    type: 'registry:ui',
    title: `Era Widgets — ${comp.name}`,
    description: comp.summary,
    dependencies: [],
    registryDependencies: [],
    files,
    meta: {
      className: comp.className,
      canonicalHtml: comp.canonicalHtml,
      cssPackage: `@era-widgets/css/${comp.id}.css`,
    },
  };
}

export function generateRegistry(components) {
  const outputs = [];
  fs.mkdirSync(path.join(REG_ROOT, 'r'), { recursive: true });
  const index = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'era-widgets',
    homepage: 'https://github.com/example/groovster',
    items: [],
  };

  for (const comp of components) {
    const item = itemFor(comp);
    const file = path.join(REG_ROOT, 'r', `${comp.id}.json`);
    writeText(file, JSON.stringify(item, null, 2));
    outputs.push(rel(REPO_ROOT, file));
    index.items.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      registryDependencies: [],
      files: item.files.map((f) => ({ path: f.path, type: f.type, target: f.target })),
    });
  }

  const indexPath = path.join(REG_ROOT, 'registry.json');
  writeText(indexPath, JSON.stringify(index, null, 2));
  outputs.push(rel(REPO_ROOT, indexPath));

  // Convenience: shadcn-style components.json hint
  writeText(
    path.join(REG_ROOT, 'README.md'),
    `# Era Widgets registry

shadcn-compatible registry items for the six hero widgets.

\`\`\`bash
# After hosting registry/ (or using a local static server):
npx shadcn@latest add ./registry/r/button.json
npx shadcn@latest add ./registry/r/card.json
# …
\`\`\`

Items include generated CSS (and \`ew-tabs.js\` for Tabs) plus an HTML example.
Era look comes from \`data-era\` + \`@era-widgets/css/eras/<era>.css\` — not per-item React.
`
  );
  outputs.push('registry/README.md');
  return outputs;
}
