#!/usr/bin/env node
/** Offline smoke: call tools directly (no MCP transport). */
import { dispatch } from './tools.js';

const cases = [
  ['list_eras', {}],
  ['get_era_spec', { era: 'deco' }],
  ['get_component', { name: 'dialog', era: 'deco' }],
  ['recommend', { description: 'law firm marketing site' }],
  ['install', { name: 'button', target: 'npm' }],
  [
    'validate',
    {
      era: 'deco',
      markup: '<div><button class="ew-button">x</button></div>',
    },
  ],
  [
    'validate',
    {
      era: 'deco',
      markup: '<div data-era="deco"><button type="button" class="ew-button">Save</button></div>',
    },
  ],
];

let failed = 0;
for (const [name, args] of cases) {
  const out = dispatch(name, args);
  const chars = JSON.stringify(out).length;
  console.log(`\n== ${name} (${chars} chars) ==`);
  console.log(JSON.stringify(out, null, 2));
  if (name === 'validate' && args.markup.includes('data-era="deco"') && out.pass !== true) {
    console.error('expected pass');
    failed++;
  }
  if (name === 'validate' && !args.markup.includes('data-era') && (!out.fixes || !out.fixes.length)) {
    console.error('expected fixes');
    failed++;
  }
  if (name === 'recommend' && out.era !== 'deco') {
    console.error('expected deco for law firm');
    failed++;
  }
}

if (failed) {
  console.error(`\nSmoke failed: ${failed}`);
  process.exit(1);
}
console.log('\nMCP tool smoke OK');

const { smokeStandalone } = await import('./smoke-standalone.js');
await smokeStandalone();
