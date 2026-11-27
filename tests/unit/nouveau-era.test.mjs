import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { NOUVEAU_PRIMITIVES, nouveauDecoratorCss } from '../../tools/gen/src/nouveau-decorators.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Art Nouveau is a standalone first-class Groovster era',()=>{
 const e=JSON.parse(read('spec/eras/art-nouveau/era.spec.json'));
 assert.equal(e.id,'art-nouveau');
 assert.deepEqual(e.dialects.map(x=>x.id),['botanical','architectural']);
 assert.deepEqual(e.fidelity.bands.map(x=>x.id),['whisper','standard','costume']);
 assert.deepEqual(e.modes,['light','dark']);
 assert.ok(e.card.lines.join('\n').length<=900,'MCP card budget');
 for(const f of e.tokenFiles)assert.ok(fs.existsSync(path.join(root,f)),f);
 const css=read('packages/css/dist/eras/art-nouveau.css');
 assert.match(css,/data-era="art-nouveau"/);
 assert.match(css,/data-dialect="architectural"/);
 assert.match(css,/data:image\/svg\+xml/);
 assert.ok(!/@import\b|url\(["']?https?:/.test(css));
});
test('eight distinct original SVG masks and no runtime dependency',()=>{
 assert.equal(NOUVEAU_PRIMITIVES.length,8);
 assert.equal(new Set(NOUVEAU_PRIMITIVES).size,8);
 const css=nouveauDecoratorCss();
 for(const x of NOUVEAU_PRIMITIVES)assert.ok(css.includes('--ew-nv-'+x+':'),'missing '+x);
 assert.ok(!/@import\b|https?:\/\/|javascript:/.test(css));
});
test('era preserves existing agent context budgets',()=>{
 assert.ok(read('generated/llms/era-art-nouveau.card.txt').length<=900);
 assert.ok(read('generated/llms/llms.txt').length<=4200);
});
for(const site of ['maison-botanique','jardin-des-arts']){
 test(site+' is self-contained with canonical hero and accessible controls',()=>{
  const html=read('demos/reference/'+site+'/index.html');
  for(const str of ['data-era="art-nouveau"','data-dialect=','data-mode-switch','data-band-switch','data-dialect-switch','ew-hero__stage','class="ew-button"','aria-live','<label'])assert.ok(html.includes(str),str);
  assert.ok(!/https?:\/\//.test(html),'remote URL');
 });
}
test('reference browser JS contains no module imports or network calls',()=>{
 const js=read('demos/reference/nouveau.js');
 assert.ok(!/\b(import|export)\b|fetch\s*\(|XMLHttpRequest/.test(js));
 const css=read('demos/reference/nouveau.css');
 assert.ok(!/@import\b|url\(["']?https?:/.test(css));
});
