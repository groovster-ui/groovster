/**
 * Generate a thin React wrapper package from component specs.
 * Props map to ew-* classes, data-* attributes, and custom elements.
 */
import fs from 'node:fs';
import path from 'node:path';
import { getOutRoot, outPath } from './paths.js';
import { writeText, rel } from './io.js';

function toPascal(id) {
  return id
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/** Strip HTML comments from canonical snippets. */
function stripComments(html) {
  return String(html || '').replace(/<!--[\s\S]*?-->/g, '');
}

/**
 * CSS class the React wrapper should apply.
 * Toast's wrapper is the live region (`ew-toast-region`), not the item (`ew-toast`).
 */
function resolveClassName(comp) {
  if (comp.id === 'toast') return 'ew-toast-region';
  return comp.className || 'ew-unknown';
}

/**
 * Resolve a single valid tag name for React.createElement.
 * Prefer the element in canonicalHtml that carries the component class.
 */
function classAttrHas(classAttr, cls) {
  return String(classAttr || '')
    .trim()
    .split(/\s+/)
    .includes(cls);
}

function resolveTag(comp) {
  const cls = resolveClassName(comp);
  const html = stripComments(comp.canonicalHtml);
  const tagRe = /<([a-zA-Z][\w-]*)\b([^>]*)>/g;
  let fromCanonical = null;
  let m;
  while ((m = tagRe.exec(html))) {
    const attrs = m[2] || '';
    const classMatch = attrs.match(/\bclass\s*=\s*"([^"]*)"/i);
    if (classMatch && classAttrHas(classMatch[1], cls)) {
      fromCanonical = m[1];
      break;
    }
  }
  if (fromCanonical) return fromCanonical;

  const isWc =
    comp.behavior === 'web-component' ||
    ['tabs', 'select', 'menu', 'popover', 'tooltip', 'toast', 'slider'].includes(comp.id);
  if (comp.id === 'toast') return 'ew-toast-region';
  if (isWc) return `ew-${comp.id}`;

  let ne = String(comp.nativeElement || 'div');
  ne = ne.split('|')[0].trim();
  if (ne.includes('+')) {
    const parts = ne.split('+').map((s) => s.trim());
    const custom = parts.find((p) => /^ew-[\w-]+/.test(p));
    if (custom) return custom.match(/^ew-[\w-]+/)[0];
    ne = parts[0];
  }
  ne = ne.replace(/\[.*$/, '').replace(/\s*\(.*$/, '').trim();
  if (!/^[a-z][\w-]*$/i.test(ne)) return 'div';
  return ne;
}

function propTypes(comp) {
  const lines = [`  className?: string;`, `  children?: React.ReactNode;`];
  for (const [key, def] of Object.entries(comp.variants || {})) {
    const vals = (def.values || []).map((v) => JSON.stringify(v)).join(' | ');
    lines.push(`  ${key}?: ${vals};`);
  }
  if (comp.sizes?.values) {
    lines.push(`  size?: ${comp.sizes.values.map((v) => JSON.stringify(v)).join(' | ')};`);
  }
  return lines.join('\n');
}

function componentSource(comp) {
  const name = toPascal(comp.id);
  const tag = resolveTag(comp);
  const className = resolveClassName(comp);

  const variantEntries = Object.entries(comp.variants || {});
  const dataBindings = variantEntries
    .map(([key, def]) => {
      const attr = def.attribute || `data-${key}`;
      return `    if (${key} != null) dataProps[${JSON.stringify(attr)}] = ${key};`;
    })
    .join('\n');
  const sizeBind = comp.sizes
    ? `    if (size != null) dataProps[${JSON.stringify(comp.sizes.attribute || 'data-size')}] = size;`
    : '';

  const destructure = [
    'className',
    'children',
    ...variantEntries.map(([k]) => k),
    ...(comp.sizes ? ['size'] : []),
    '...rest',
  ].join(', ');

  // React 18 SSR emits literal "className" on custom elements; use "class" instead.
  const classKey = tag.includes('-') ? 'class' : 'className';

  return `import * as React from 'react';

export type ${name}Props = {
${propTypes(comp)}
} & React.HTMLAttributes<HTMLElement>;

/** Thin wrapper: ${comp.summary} */
export const ${name} = React.forwardRef<HTMLElement, ${name}Props>(function ${name}(
  { ${destructure} },
  ref
) {
  const dataProps: Record<string, string> = {};
${dataBindings}
${sizeBind}
  const cls = ['${className}', className].filter(Boolean).join(' ');
  return React.createElement(
    '${tag}',
    { ref, ${classKey}: cls, ...dataProps, ...rest },
    children
  );
});
${name}.displayName = '${name}';
`;
}

export function generateReactPackage(components, outputs) {
  const root = outPath('packages/react');
  const src = path.join(root, 'src');
  fs.mkdirSync(src, { recursive: true });

  const exports = [];
  const indexLines = [`/** Generated React wrappers for Groovster — do not hand-edit. */`, ``];

  for (const comp of components) {
    const name = toPascal(comp.id);
    const file = path.join(src, `${name}.tsx`);
    writeText(file, componentSource(comp));
    outputs.push(rel(getOutRoot(), file));
    indexLines.push(`export { ${name} } from './${name}.js';`);
    indexLines.push(`export type { ${name}Props } from './${name}.js';`);
    exports.push(name);
  }

  // Root helpers
  writeText(
    path.join(src, 'EraRoot.tsx'),
    `import * as React from 'react';

export type EraRootProps = {
  era: string;
  mode?: 'light' | 'dark';
  fidelity?: number;
  fidelityBand?: 'whisper' | 'signature' | 'costume';
  dialect?: string;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function EraRoot({
  era,
  mode = 'light',
  fidelity,
  fidelityBand,
  dialect,
  className,
  children,
  ...rest
}: EraRootProps) {
  const cls = ['ew-root', className].filter(Boolean).join(' ');
  const data: Record<string, string> = { 'data-era': era, 'data-mode': mode };
  if (fidelity != null) data['data-fidelity'] = String(fidelity);
  if (fidelityBand) data['data-fidelity-band'] = fidelityBand;
  if (dialect) data['data-dialect'] = dialect;
  return React.createElement('div', { className: cls, ...data, ...rest }, children);
}
`
  );
  outputs.push(rel(getOutRoot(), path.join(src, 'EraRoot.tsx')));
  indexLines.push(`export { EraRoot } from './EraRoot.js';`);
  indexLines.push(`export type { EraRootProps } from './EraRoot.js';`);

  writeText(path.join(src, 'index.ts'), indexLines.join('\n') + '\n');
  outputs.push(rel(getOutRoot(), path.join(src, 'index.ts')));

  const pkgPath = path.join(root, 'package.json');
  writeText(
    pkgPath,
    JSON.stringify(
      {
        name: '@groovster/react',
        version: '0.1.0-alpha.0',
        description: 'Thin React wrappers over Groovster ew-* HTML/CSS (generated from specs).',
        type: 'module',
        license: 'MIT',
        files: ['src', 'README.md'],
        exports: {
          '.': './src/index.ts',
          './package.json': './package.json',
        },
        scripts: {
          typecheck: 'tsc --noEmit',
        },
        peerDependencies: {
          react: '>=18',
        },
        devDependencies: {
          '@types/react': '^18.3.18',
          '@types/react-dom': '^18.3.5',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          tsx: '^4.19.2',
          typescript: '~5.7.3',
        },
        publishConfig: { access: 'public' },
        keywords: ['groovster', 'react', 'design-systems'],
      },
      null,
      2
    ) + '\n'
  );
  outputs.push(rel(getOutRoot(), pkgPath));

  writeText(
    path.join(root, 'README.md'),
    `# @groovster/react

Thin generated React wrappers. Canonical API remains HTML + \`ew-*\` classes.

\`\`\`tsx
import { EraRoot, Button, Card } from '@groovster/react';
import '@groovster/css/era-widgets.css';

export function Demo() {
  return (
    <EraRoot era="deco" mode="light" fidelity={35} fidelityBand="signature">
      <Card variant="raised">
        <Button variant="primary">Save</Button>
      </Card>
    </EraRoot>
  );
}
\`\`\`

Vue and Svelte wrappers can follow the same generator pattern.
`
  );
  outputs.push(rel(getOutRoot(), path.join(root, 'README.md')));

  return exports;
}
