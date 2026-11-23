import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { listEraIds } from '../helpers/eras.mjs';
import { expectedAxeCases, matrixDocument } from '../a11y/matrix-html.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('era checks read every spec/eras directory', () => {
  const ids = listEraIds(REPO);
  const onDisk = fs
    .readdirSync(path.join(REPO, 'spec/eras'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(REPO, 'spec/eras', entry.name, 'era.spec.json')))
    .map((entry) => JSON.parse(fs.readFileSync(path.join(REPO, 'spec/eras', entry.name, 'era.spec.json'), 'utf8')).id)
    .sort((a, b) => a.localeCompare(b));
  assert.deepEqual(ids, onDisk);
  assert.ok(ids.includes('swiss'));
  assert.ok(ids.includes('bauhaus'));
  assert.ok(ids.length >= 9);
});

test('axe matrix covers every era in costume and whisper, light and dark', () => {
  const ids = listEraIds(REPO);
  const html = matrixDocument(REPO);
  const disk = fs.readFileSync(path.join(REPO, 'tests/a11y/fixtures/matrix.html'), 'utf8');
  assert.equal(
    disk,
    html,
    'tests/a11y/fixtures/matrix.html is stale. Run: node tests/a11y/matrix-html.mjs --write'
  );
  assert.equal(expectedAxeCases(REPO), ids.length * 2 * 2);
  const cases = html.match(/data-testid="case-/g) || [];
  assert.equal(cases.length, ids.length * 2 * 2);
  for (const era of ids) {
    for (const mode of ['light', 'dark']) {
      assert.match(html, new RegExp(`data-testid="case-${era}-${mode}"`));
      assert.match(html, new RegExp(`data-testid="case-${era}-${mode}-whisper"`));
    }
  }
});
