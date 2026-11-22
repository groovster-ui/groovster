#!/usr/bin/env node
/**
 * Install packed @groovster/react and @groovster/css outside the workspace and render them.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'groovster-react-'));

function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function pack(dir) {
  const output = run('npm', ['pack', '--json', '--pack-destination', tmp], dir);
  const meta = JSON.parse(output.slice(output.indexOf('[')));
  return path.join(tmp, meta[0].filename);
}

const reactTar = pack(path.join(root, 'packages/react'));
const cssTar = pack(path.join(root, 'packages/css'));
const elementsTar = pack(path.join(root, 'packages/elements'));

for (const reactVersion of ['18.3.1', '19.0.0']) {
  const app = path.join(tmp, `app-${reactVersion}`);
  fs.mkdirSync(app, { recursive: true });
  fs.writeFileSync(path.join(app, 'package.json'), JSON.stringify({
    name: 'groovster-react-consumer',
    private: true,
    type: 'module',
  }));
  run('npm', ['install', '--ignore-scripts', reactTar, cssTar, elementsTar, `react@${reactVersion}`, `react-dom@${reactVersion}`], app);
  const cssFile = path.join(app, 'node_modules/@groovster/css/dist/era-widgets.css');
  const elementsFile = path.join(app, 'node_modules/@groovster/elements/dist/era-elements.js');
  if (!fs.existsSync(cssFile)) throw new Error(`CSS package missing ${cssFile}`);
  if (!fs.existsSync(elementsFile)) throw new Error(`Elements package missing ${elementsFile}`);
  if (fs.readFileSync(cssFile, 'utf8').includes('@import')) throw new Error('Published CSS contains @import');
  fs.writeFileSync(path.join(app, 'render.mjs'), `import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EraRoot, Button, Checkbox, Select } from '@groovster/react';
const html = renderToStaticMarkup(React.createElement(EraRoot, { era: 'deco', fidelityBand: 'costume' },
  React.createElement(Checkbox, { label: 'Accept', name: 'terms' }),
  React.createElement(Button, { variant: 'primary' }, 'Save'),
  React.createElement(Select, { label: 'Country' }, React.createElement('option', { value: 'us' }, 'US'))
));
if (!html.includes('ew-checkbox__control') || !html.includes('<button') || !html.includes('<ew-select')) {
  console.error(html);
  process.exit(1);
}
console.log('rendered', ${JSON.stringify(reactVersion)});
`);
  run(process.execPath, ['render.mjs'], app);
}

const typesApp = path.join(tmp, 'types');
fs.mkdirSync(typesApp);
fs.writeFileSync(path.join(typesApp, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
run('npm', ['install', '--ignore-scripts', reactTar, 'react@19.0.0', 'typescript@5.7.3', '@types/react@19.0.2'], typesApp);
fs.writeFileSync(path.join(typesApp, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    module: 'nodenext',
    moduleResolution: 'nodenext',
    jsx: 'react-jsx',
    strict: true,
    noEmit: true,
    skipLibCheck: true,
  },
  files: ['demo.tsx'],
}));
fs.writeFileSync(path.join(typesApp, 'demo.tsx'), `import { EraRoot, Button, Checkbox, Select } from '@groovster/react';
export function Demo() {
  return (
    <EraRoot era="deco" fidelityBand="whisper">
      <Checkbox label="Accept" name="terms" />
      <Button variant="ghost">Save</Button>
      <Select label="Country"><option value="us">US</option></Select>
    </EraRoot>
  );
}
`);
run(path.join(typesApp, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.json'], typesApp);
fs.rmSync(tmp, { recursive: true, force: true });
console.log('Standalone React package consumer OK');
