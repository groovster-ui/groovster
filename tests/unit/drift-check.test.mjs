import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { classifyDrift, commandFailure } from '../../tools/gen/src/check.js';

const buf = (text) => Buffer.from(text);

test('drift classifier flags modified, missing, new, unexpected, and nondeterministic output', () => {
  const committed = new Map([
    ['packages/css/dist/base.css', buf('old')],
    ['packages/css/dist/gone.css', buf('x')],
  ]);
  const generated = new Map([
    ['packages/css/dist/base.css', buf('new')],
    ['packages/react/src/Button.tsx', buf('button')],
  ]);
  const regenerated = new Map([
    ['packages/css/dist/base.css', buf('newer')],
    ['packages/react/src/Button.tsx', buf('button')],
  ]);
  const manifest = ['packages/css/dist/base.css', 'packages/css/dist/missing.css', 'packages/react/src/Button.tsx'];
  const drift = classifyDrift({
    committed,
    generated,
    regenerated,
    manifest,
    owned: ['packages/css/dist/base.css', 'packages/css/dist/orphan.css', 'packages/react/src/Button.tsx'],
  });
  const reasons = drift.map((item) => `${item.file} ${item.reason}`);
  assert.ok(reasons.some((line) => line.includes('base.css') && line.includes('modified')));
  assert.ok(reasons.some((line) => line.includes('missing.css') && line.includes('missing')));
  assert.ok(reasons.some((line) => line.includes('Button.tsx') && line.includes('missing from baseline')));
  assert.ok(reasons.some((line) => line.includes('orphan.css') && line.includes('unexpected')));
  assert.ok(reasons.some((line) => line.includes('base.css') && line.includes('nondeterministic')));
  assert.ok(reasons.some((line) => line.includes('gone.css') && line.includes('orphan')));
});

test('clean generation has no drift', () => {
  const bytes = buf('same');
  const files = new Map([['packages/css/dist/base.css', bytes]]);
  const drift = classifyDrift({
    committed: files,
    generated: files,
    regenerated: new Map([['packages/css/dist/base.css', buf('same')]]),
    manifest: ['packages/css/dist/base.css'],
    owned: ['packages/css/dist/base.css'],
  });
  assert.deepEqual(drift, []);
});

test('commandFailure reports a nonzero child process', () => {
  assert.match(commandFailure({ status: 2, stderr: 'boom' }, 'elements bundle'), /exited 2/);
  assert.equal(commandFailure({ status: 0 }, 'elements bundle'), null);
});

test('a spec change without regeneration is modified output', () => {
  const spec = JSON.parse(fs.readFileSync(path.join('spec/components/button.json'), 'utf8'));
  assert.equal(typeof spec.summary, 'string');
  const committed = new Map([['packages/react/src/Button.tsx', buf('from old spec')]]);
  const generated = new Map([['packages/react/src/Button.tsx', buf(`from ${spec.summary}`)]]);
  const drift = classifyDrift({
    committed,
    generated,
    regenerated: generated,
    manifest: ['packages/react/src/Button.tsx'],
    owned: ['packages/react/src/Button.tsx'],
  });
  assert.equal(drift.length, 1);
  assert.match(drift[0].reason, /modified/);
});
