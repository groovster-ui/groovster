import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { recommendTool } from '../../packages/mcp/src/tools.js';
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

test('new style sources have complete mode tokens, real dialect rules, and compact agent cards', () => {
  for (const id of ['nordic','futurist','folklore']) {
    const era = loadEraCatalog().find(e => e.id === id);
    assert.ok(era.card.lines.join('\n').length < 900);
    for (const file of era.tokenFiles) assert.ok(fs.existsSync(new URL('../../'+file,import.meta.url)),file);
    const css = additionalEraCss(id);
    for (const dialect of era.dialects) assert.ok(css.includes('[data-dialect="'+dialect.id+'"]'),dialect.id);
    for (const component of ['ew-hero','ew-card','ew-button','ew-switch','ew-checkbox','ew-stat','ew-table','ew-ornament-divider','ew-nav-rail','ew-dialog','ew-chip']) assert.ok(css.includes(component),component);
    assert.doesNotMatch(css,/@import\b|url\(["']?https?:/i);
    assert.ok(css.includes('data-fidelity-band="whisper"'));
    assert.ok(css.includes('data-fidelity-band="standard"'));
  }
});
test('explicit style recommendations resolve to an existing dialect', () => {
  const catalog = new Map(loadEraCatalog().map(era => [era.id,era]));
  for (const [description,id,dialect] of [
    ['Scandinavian pop garden','nordic','botanical-pop'],
    ['futurist aero dashboard','futurist','aero'],
    ['woodland storybook','folklore','woodland'],
    ['organic mid-century','mcm-atomic','organic'],
    ['Riviera travel poster','deco','riviera'],
    ['liquid psychedelic','groovy','liquid'],
    ['New Wave typography','memphis','new-wave'],
  ]) {
    const result = recommendTool({ description });
    assert.equal(result.era,id);
    assert.equal(result.dialect,dialect);
    assert.ok(catalog.get(id).dialects.some(d => d.id === dialect));
  }
});
