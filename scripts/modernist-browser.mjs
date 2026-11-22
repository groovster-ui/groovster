import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sites=['swiss-journal','swiss-console','bauhaus-museum','bauhaus-studio'];
const browser=await chromium.launch({headless:true});let checks=0;
try{
 for(const site of sites){
  for(const width of [320,375,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:900}});
   const errors=[];page.on('pageerror',err=>errors.push(err.message));
   await page.goto(pathToFileURL(path.join(root,'demos/reference',site,'index.html')).href);
   for(const mode of ['light','dark'])for(const band of ['whisper','standard','costume']){
    await page.locator('[data-mode-switch]').selectOption(mode);
    await page.locator('[data-band-switch]').selectOption(band);
    if(await page.locator('[data-era]').getAttribute('data-mode')!==mode)throw Error(site+' mode did not change');
    if(await page.locator('[data-era]').getAttribute('data-fidelity-band')!==band)throw Error(site+' fidelity did not change');
    if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1))throw Error(site+' overflow '+width+'/'+mode+'/'+band);
    checks++;
   }
   if(errors.length)throw Error(site+' browser errors: '+errors.join('; '));
   if(width===375){
    if(site==='bauhaus-studio'){await page.locator('[data-buy]').first().click();if(await page.locator('[data-cart]').textContent()!=='$89.00')throw Error('cart failed');}
    if(site==='swiss-console'){await page.locator('[data-resolve]').first().click();if(await page.locator('[data-status]').first().textContent()!=='Resolved')throw Error('resolution failed');}
    if(site==='bauhaus-museum'){await page.locator('[data-tickets]').fill('3');if(await page.locator('[data-cart]').textContent()!=='$54.00')throw Error('ticket calculator failed');}
    if(site==='swiss-journal'){await page.locator('[data-filter]').fill('typography');if(await page.locator('[data-filterable]:visible').count()!==1)throw Error('journal filter failed');}
   }
   await page.close();
  }
 }
 console.log('PASS '+checks+' viewport/mode/fidelity combinations; 4 functional checks');
}finally{await browser.close()}
