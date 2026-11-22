import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  dispatch,
  getComponentTool,
  getEraSpec,
  installTool,
  recommendTool,
} from '../../packages/mcp/src/tools.js';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Extract repo-relative filesystem paths (packages/...) from install step strings. */
function extractRepoPaths(steps) {
  const found = new Set();
  const re = /packages\/(?:css|elements)\/dist\/[A-Za-z0-9._/-]+\.(?:css|js)/g;
  for (const step of steps) {
    for (const m of String(step).matchAll(re)) {
      found.add(m[0]);
    }
  }
  return [...found];
}

test('recommendTool keyword routing', () => {
  const cases = [
    ['law firm luxury hotel', 'deco'],
    ['synthwave neon game night', 'neon'],
    ['neon festival outrun', 'neon'],
    ['memphis confetti postmodern', 'memphis'],
    ['groovy 70s avocado disco', 'groovy'],
    ['earth organic wellness craft', 'earth'],
    ['cafe lifestyle mid-century atomic', 'mcm-atomic'],
    ['admin settings saas dashboard', 'neutral'],
    ['something unrelated bland', 'neutral'],
  ];
  for (const [description, era] of cases) {
    const out = recommendTool({ description });
    assert.equal(out.era, era, `expected ${era} for "${description}", got ${out.era}`);
  }
});

test('get_era_spec aliases', () => {
  const out = getEraSpec({ era: 'art-deco' });
  assert.equal(out.error, undefined);
  assert.equal(out.id, 'deco');
});

test('get_component aliases', () => {
  const out = getComponentTool({ name: 'textfield' });
  assert.equal(out.error, undefined);
  assert.equal(out.name, 'text-field');
});

test('get_era_spec mid-century alias', () => {
  const out = getEraSpec({ era: 'mid-century' });
  assert.equal(out.error, undefined);
  assert.equal(out.id, 'mcm-atomic');
});

test('unknown era / component / tool errors', () => {
  const era = getEraSpec({ era: 'not-an-era' });
  assert.ok(era.error);
  assert.match(era.error, /Unknown era/);

  const comp = getComponentTool({ name: 'not-a-widget' });
  assert.ok(comp.error);
  assert.match(comp.error, /Unknown component/);

  const unknown = dispatch('no_such_tool', {});
  assert.ok(unknown.error);
  assert.match(unknown.error, /Unknown tool/);
});

test('installTool hard widget paths resolve under repo', () => {
  const out = installTool({ name: 'tabs', target: 'npm' });
  assert.ok(Array.isArray(out.steps) && out.steps.length);
  const joined = out.steps.join('\n');
  assert.ok(joined.includes('era-elements.js'), 'hard widgets must mention era-elements.js bundle');
  assert.ok(
    !/\b(?:pnpm add|npm (?:i|install)|yarn add)\s+@groovster\b/i.test(joined),
    'must not suggest published installs'
  );

  const paths = extractRepoPaths(out.steps);
  assert.ok(paths.length >= 2, `expected multiple repo paths, got ${JSON.stringify(paths)}`);
  assert.ok(paths.includes('packages/css/dist/era-widgets.css'));
  assert.ok(paths.includes('packages/elements/dist/era-elements.js'));
  for (const rel of paths) {
    const abs = path.join(REPO, rel);
    assert.ok(fs.existsSync(abs), `missing file for suggested path: ${rel}`);
  }
});

test('installTool button paths resolve under repo', () => {
  const out = installTool({ name: 'button', target: 'npm' });
  assert.ok(Array.isArray(out.steps) && out.steps.length);
  const joined = out.steps.join('\n');
  assert.ok(!/\b(?:pnpm add|npm (?:i|install)|yarn add)\s+@groovster\b/i.test(joined));

  const paths = extractRepoPaths(out.steps);
  assert.ok(paths.includes('packages/css/dist/era-widgets.css'));
  for (const rel of paths) {
    const abs = path.join(REPO, rel);
    assert.ok(fs.existsSync(abs), `missing file for suggested path: ${rel}`);
  }
});

test('installTool copy + registry targets still work', () => {
  const copy = installTool({ name: 'tabs', target: 'copy' });
  assert.ok(copy.steps.some((s) => s.includes('packages/css/dist/era-widgets.css')));
  assert.ok(copy.steps.some((s) => s.includes('packages/elements/dist/era-elements.js')));
  for (const rel of extractRepoPaths(copy.steps)) {
    assert.ok(fs.existsSync(path.join(REPO, rel)), `missing: ${rel}`);
  }

  const reg = installTool({ name: 'button', target: 'registry' });
  assert.ok(reg.steps.some((s) => /shadcn@latest add/.test(s)));
  assert.ok(reg.steps.some((s) => /button\.json/.test(s)));
});
