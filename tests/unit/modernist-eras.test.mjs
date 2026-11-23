import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
for(const id of ['swiss','bauhaus']){
 test(id+' is a generated standalone era',()=>{
  const era=JSON.parse(read('spec/eras/'+id+'/era.spec.json'));
  assert.equal(era.id,id);
  assert.deepEqual(era.modes,['light','dark']);
  assert.deepEqual(era.fidelity.bands.map(b=>b.id),['whisper','standard','costume']);
  for(const f of era.tokenFiles)assert.ok(fs.existsSync(path.join(root,f)),f);
  const css=read('packages/css/dist/eras/'+id+'.css');
  assert.match(css,new RegExp('data-era="'+id+'"'));
  assert.ok(!/@import\b|url\(["']?https?:/.test(css));
  assert.ok(read('generated/llms/era-'+id+'.card.txt').length<=900);
 });
}
for(const page of ['swiss-journal','swiss-console','bauhaus-museum','bauhaus-studio']){
 test(page+' reference uses local Groovster CSS and functional markup',()=>{
  const html=read('demos/reference/'+page+'/index.html');
  assert.match(html,/data-fidelity-band="costume"/);
  assert.match(html,/data-mode-switch/);
  assert.match(html,/data-band-switch/);
  assert.match(html,/ew-button/);
  assert.ok(!/https?:\/\//.test(html));
 });
}
test('modernist browser assets do not import third-party modules',()=>{
 assert.ok(!/(^|\n)\s*(import|export)\b/.test(read('demos/reference/modernist.js')));
 assert.ok(!/@import\b|url\(["']?https?:/.test(read('demos/reference/modernist.css')));
});
