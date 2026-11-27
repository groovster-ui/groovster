import test from 'node:test';
import assert from 'node:assert/strict';
import { loadEraCatalog } from '../../tools/gen/src/era-catalog.js';
import { additionalEraCss } from '../../tools/gen/src/additional-era-decorators.js';

test('new style families and dialects are discoverable', () => {
  const catalog = new Map(loadEraCatalog().map(era => [era.id, era]));
  for (const [id, dialects] of Object.entries({
    nordic: ['botanical-pop', 'minimal', 'folk'],
    futurist: ['mechanical', 'typographic', 'aero'],
    folklore: ['woodland', 'cottage', 'traditional'],
    'mcm-atomic': ['organic'], deco: ['riviera'], groovy: ['liquid'], memphis: ['new-wave'],
  })) {
    const era = catalog.get(id);
    assert.ok(era, id);
    for (const dialect of dialects) assert.ok(era.dialects.some(item => item.id === dialect), dialect);
    assert.ok(additionalEraCss(id).includes('data-era'));
  }
  assert.equal(additionalEraCss('neutral'), '');
});
