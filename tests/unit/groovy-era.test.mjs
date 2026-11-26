import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { groovyBloomPath, groovyPrintSvg } from '../../tools/gen/src/groovy-decorators.js';
const read = p => fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('Groovy remains offline and within the existing agent card budget', () => {
  const era = JSON.parse(read('spec/eras/groovy/era.spec.json'));
  assert.equal(era.fonts.display,'Spicy Rice');
  assert.ok(read('generated/llms/era-groovy.card.txt').length <= 900);
  const css = read('packages/css/dist/eras/groovy.css');
  assert.ok(!/@import\b|url\(["']?https?:/.test(css));
  assert.ok(fs.existsSync(new URL('../../packages/css/dist/fonts/SpicyRice-Regular.woff2',import.meta.url)));
});
test('Botanical paths close with continuous cubic tangents, without circular halos or text', () => {
  for (const lobes of [5,6]) {
    const d = groovyBloomPath(100,lobes,.18);
    const commands = d.match(/[MC][^MCZ]+/g).map(x => ({type:x[0],p:x.slice(1).trim().split(/\s+/).map(Number)}));
    const segments = commands.slice(1);
    for(let i=0;i<segments.length;i++) {
      const current=segments[i].p,next=segments[(i+1)%segments.length].p;
      const join=current.slice(4);
      for(let axis=0;axis<2;axis++) assert.ok(Math.abs((join[axis]-current[axis+2])-(next[axis]-join[axis]))<.25,'C1 tangent mismatch');
    }
    assert.deepEqual(segments.at(-1).p.slice(4),commands[0].p);
    assert.match(d,/Z$/);
  }
  const art=groovyPrintSvg();
  assert.equal(art,groovyPrintSvg(),'deterministic generation');
  assert.doesNotMatch(art,/<circle|<ellipse|<text|<image/);
});
test('The gallery covers every canonical component; the application stylesheet is layout only', () => {
  const specs=fs.readdirSync(new URL('../../spec/components/',import.meta.url)).filter(p=>p.endsWith('.json'));
  const gallery=read('demos/showcase/groovy.html');
  for(const spec of specs)assert.ok(gallery.includes(`data-component="${spec.slice(0,-5)}"`),spec);
  assert.equal((gallery.match(/data-component=/g)||[]).length,specs.length);
  const layout=read('demos/reference/groovy.css');
  assert.doesNotMatch(layout,/data-era|data-mode|data-fidelity|#[0-9a-f]{3,8}\b|url\(|box-shadow|border-radius/i);
  assert.doesNotMatch(read('demos/reference/groovy.js'),/fetch\s*\(|XMLHttpRequest/);
});
