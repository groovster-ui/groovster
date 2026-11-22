import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { parseNativeElement, componentSource } from '../../tools/gen/src/react-wrapper.js';

test('nativeElement selectors become real tags and attributes', () => {
  assert.deepEqual(parseNativeElement('input[type=checkbox]'), {
    tag: 'input',
    attrs: { type: 'checkbox' },
    custom: false,
  });
  assert.equal(parseNativeElement('article|section|div').tag, 'article');
  assert.equal(parseNativeElement('hr|div').tag, 'hr');
  assert.equal(parseNativeElement('select + ew-select').tag, 'ew-select');
  assert.equal(parseNativeElement('div (custom element later: ew-tabs)').tag, 'ew-tabs');
});

test('every component spec generates a valid tag and its root class', () => {
  const dir = path.join('spec/components');
  const files = fs.readdirSync(dir).filter((name) => name.endsWith('.json'));
  assert.equal(files.length, 21);
  for (const file of files) {
    const spec = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const source = componentSource(spec);
    assert.match(source, new RegExp(spec.className));
    assert.doesNotMatch(source, /createElement\(\s*'[^']*\[/);
    assert.doesNotMatch(source, /createElement\(\s*'[^']*\|/);
    if (spec.id === 'checkbox') {
      assert.match(source, /type: "checkbox"/);
      assert.match(source, /ew-checkbox__box/);
      assert.match(source, /ew-checkbox__control/);
      assert.match(source, /ew-checkbox__label/);
    }
    if (spec.id === 'switch') {
      assert.match(source, /role: 'switch'/);
      assert.match(source, /aria-checked/);
      assert.match(source, /ew-switch__track/);
      assert.match(source, /ew-switch__thumb/);
    }
    if (spec.id === 'radio') assert.match(source, /ew-radio__disc/);
    if (spec.id === 'text-field') assert.match(source, /htmlFor: controlId/);
  }
});
