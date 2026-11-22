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

  try {
    if (name === 'list_eras') {
      if (!Array.isArray(out.eras) || out.eras.length < 1) {
        throw new Error('list_eras: expected non-empty eras array');
      }
      if (!out.eras.some((e) => e.id === 'deco')) {
        throw new Error('list_eras: expected deco era');
      }
    } else if (name === 'get_era_spec') {
      if (out.error || out.id !== 'deco' || !out.card) {
        throw new Error('get_era_spec: expected deco card without error');
      }
    } else if (name === 'get_component') {
      if (out.error || out.name !== 'dialog' || !out.html) {
        throw new Error('get_component: expected dialog html without error');
      }
    } else if (name === 'recommend') {
      if (out.era !== 'deco') {
        throw new Error(`recommend: expected deco for law firm, got ${out.era}`);
      }
    } else if (name === 'install') {
      if (!Array.isArray(out.steps) || out.steps.length < 1) {
        throw new Error('install: expected non-empty steps');
      }
      const joined = out.steps.join('\n');
      if (!joined.includes('packages/css/dist/era-widgets.css')) {
        throw new Error('install: expected CSS dist path in steps');
      }
      if (/\b(?:pnpm add|npm (?:i|install)|yarn add)\s+@groovster\b/i.test(joined)) {
        throw new Error('install: must not suggest installing unpublished @groovster packages');
      }
    } else if (name === 'validate' && !args.markup.includes('data-era')) {
      if (out.pass !== false || !out.fixes?.length) {
        throw new Error('validate: expected fail with fixes when data-era missing');
      }
      if (!out.fixes.some((f) => f.includes('data-era="deco"'))) {
        throw new Error('validate: expected data-era fix');
      }
    } else if (name === 'validate' && args.markup.includes('data-era="deco"')) {
      if (out.pass !== true || (out.fixes && out.fixes.length)) {
        throw new Error('validate: expected pass with empty fixes for valid markup');
      }
    } else {
      throw new Error(`unhandled smoke case: ${name}`);
    }
  } catch (err) {
    console.error(err.message || err);
    failed++;
  }
}

if (failed) {
  console.error(`\nSmoke failed: ${failed}`);
  process.exit(1);
}
console.log('\nMCP tool smoke OK');
