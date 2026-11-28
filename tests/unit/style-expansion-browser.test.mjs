import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { chromium } from '../../tools/a11y/node_modules/playwright/index.mjs';
import { safePath } from '../helpers/safe-path.mjs';
import { loadEraCatalog } from '../../tools/gen/src/era-catalog.js';

const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const catalog=loadEraCatalog();
const familyIds=['nordic','futurist','folklore'];
const dialects={'mcm-atomic':['organic'],deco:['riviera'],groovy:['liquid'],memphis:['new-wave']};
const cases=catalog.flatMap(era=>familyIds.includes(era.id)
  ? ['',...era.dialects.map(d=>d.id)].map(d=>[era.id,d])
  : (dialects[era.id]||[]).map(d=>[era.id,d]));
function serve(){
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2'};
  const server=createServer((req,res)=>{
    const file=safePath(REPO,decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).replace(/^\/+/, ''));
    if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server)));
}
test('style lab renders every new dialect in both modes and all three fidelity bands', {timeout:120000}, async()=>{
  const server=await serve();let browser;
  try{
    browser=await chromium.launch();
    const page=await browser.newPage({viewport:{width:1100,height:850}});
    const base='http://127.0.0.1:'+server.address().port;
    await page.goto(base+'/demos/showcase/style-lab.html');
    await page.waitForSelector('#stage[data-ready="true"]');
    const componentCount=JSON.parse(fs.readFileSync(path.join(REPO,'generated/manifest.json'),'utf8')).components.length;
    assert.equal(await page.locator('#gallery [data-component]').count(),componentCount);
    for(const [era,dialect] of cases){
      await page.selectOption('#era',era);
      await page.selectOption('#dialect',dialect);
      for(const mode of ['light','dark']){
        await page.selectOption('#mode',mode);
        for(const fidelity of ['costume','standard','whisper']){
          await page.selectOption('#fidelity',fidelity);
          const actual=await page.evaluate(()=>{
            const stage=document.getElementById('stage'), style=getComputedStyle(stage);
            const art=getComputedStyle(stage.querySelector('.ew-hero__stage')).backgroundImage;
            const rule=getComputedStyle(stage.querySelector('.ew-card__header')).boxShadow;
            const button=stage.querySelector('.ew-hero .ew-button'), rect=button.getBoundingClientRect();
            return {era:stage.dataset.era,dialect:stage.dataset.dialect||'',mode:stage.dataset.mode,fidelity:stage.dataset.fidelityBand,
              token:style.getPropertyValue('--ew-era').trim(),art,rule,buttonHeight:rect.height};
          });
          const key=[era,dialect,mode,fidelity].join('/');
          assert.equal(actual.token,era,key);
          assert.deepEqual([actual.era,actual.dialect,actual.mode,actual.fidelity],[era,dialect,mode,fidelity],key);
          assert.ok(actual.buttonHeight>=24,key);
          if(familyIds.includes(era)){
            if(fidelity==='whisper'||fidelity==='standard')assert.equal(actual.art,'none',key);
            if(fidelity==='costume'&&!['minimal','typographic'].includes(dialect))assert.notEqual(actual.art,'none',key);
            if(fidelity==='whisper')assert.equal(actual.rule,'none',key);
          }
        }
      }
    }
    // Real small-screen controls and keyboard focus in the new families.
    await page.setViewportSize({width:375,height:812});
    for(const era of familyIds){
      await page.selectOption('#era',era);
      await page.selectOption('#density','compact');
      const button=page.locator('#stage .ew-hero .ew-button');
      await button.focus();
      assert.equal(await button.evaluate(el=>el===document.activeElement),true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),true,era+' mobile overflow');
    }
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
});
