import fs from 'node:fs';
import path from 'node:path';
import { getOutRoot, outPath } from './paths.js';
import { writeText, rel } from './io.js';

function itemFor(comp) {
  const cssPath = outPath('packages/css/dist', `${comp.id}.css`);
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  const files = [
    {
      path: `era-widgets/${comp.id}.css`,
      content: css,
      type: 'registry:file',
      target: `styles/era-widgets/${comp.id}.css`,
    },
  ];
  const wcByComp = {
    tabs: 'ew-tabs.js',
    select: 'ew-select.js',
    menu: 'ew-menu.js',
    popover: 'ew-popover.js',
    tooltip: 'ew-tooltip.js',
    toast: 'ew-toast.js',
    slider: 'ew-slider.js',
  };
  const wcFile = wcByComp[comp.id];
  if (wcFile) {
    const elPath = outPath('packages/elements/dist', wcFile);
    if (fs.existsSync(elPath)) {
      files.push({
        path: `era-widgets/${wcFile}`,
        content: fs.readFileSync(elPath, 'utf8'),
        type: 'registry:file',
        target: `components/era-widgets/${wcFile}`,
      });
    }
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
      cssPackage: `@groovster/css/${comp.id}.css`,
    },
  };
}

export function generateRegistry(components) {
  const outputs = [];
  const regRoot = outPath('registry');
  fs.mkdirSync(path.join(regRoot, 'r'), { recursive: true });
  const index = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'era-widgets',
    homepage: 'https://groovsterui.com',
    items: [],
  };

  for (const comp of components) {
    const item = itemFor(comp);
    const file = path.join(regRoot, 'r', `${comp.id}.json`);
    writeText(file, JSON.stringify(item, null, 2));
    outputs.push(rel(getOutRoot(), file));
    index.items.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      registryDependencies: [],
      files: item.files.map((f) => ({ path: f.path, type: f.type, target: f.target })),
    });
  }

  const indexPath = path.join(regRoot, 'registry.json');
  writeText(indexPath, JSON.stringify(index, null, 2));
  outputs.push(rel(getOutRoot(), indexPath));

  // Convenience: shadcn-style components.json hint
  writeText(
    path.join(regRoot, 'README.md'),
    `# Era Widgets registry

shadcn-compatible registry items for the six hero widgets.

\`\`\`bash
# After hosting registry/ (or using a local static server):
npx shadcn@latest add ./registry/r/button.json
npx shadcn@latest add ./registry/r/card.json
# …
\`\`\`

Items include generated CSS (and \`ew-tabs.js\` for Tabs) plus an HTML example.
Era look comes from \`data-era\` + \`@groovster/css/eras/<era>.css\` — not per-item React.
`
  );
  outputs.push('registry/README.md');
  return outputs;
}
