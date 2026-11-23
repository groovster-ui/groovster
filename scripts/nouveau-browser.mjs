import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const snap=path.join(root,'demos/reference/shots/nouveau');
const capture=process.argv.includes('--capture');
const cases=['maison-botanique','jardin-des-arts'];
const widths=[320,375,768,1024,1440],modes=['light','dark'],bands=['whisper','standard','costume'],dialects=['botanical','architectural'];
const shots=new Set([
 'maison-botanique-1440-light-costume-botanical',
 'maison-botanique-1440-dark-costume-botanical',
 'maison-botanique-375-light-costume-botanical',
 'maison-botanique-1440-light-standard-botanical',
 'jardin-des-arts-1440-light-costume-architectural',
 'jardin-des-arts-1440-dark-costume-architectural',
 'jardin-des-arts-375-dark-costume-architectural',
 'jardin-des-arts-1440-light-whisper-architectural',
]);
if(capture)fs.mkdirSync(snap,{recursive:true});
const browser=await chromium.launch({headless:true});
let checks=0,images=0;
try{
 for(const site of cases)for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(root,'demos/reference',site,'index.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  for(const dialect of dialects)for(const mode of modes)for(const band of bands){
   await page.locator('[data-dialect-switch]').selectOption(dialect);
   await page.locator('[data-mode-switch]').selectOption(mode);
   await page.locator('[data-band-switch]').selectOption(band);
   const data=await page.locator('[data-era]').evaluate(el=>({era:el.dataset.era,dialect:el.dataset.dialect,mode:el.dataset.mode,band:el.dataset.fidelityBand}));
   if(data.era!=='art-nouveau'||data.dialect!==dialect||data.mode!==mode||data.band!==band)throw Error('skin switch failed '+site);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
   if(overflow)throw Error('horizontal overflow '+site+' '+width+' '+mode+' '+dialect+' '+band);
   const key=[site,width,mode,band,dialect].join('-');
   if(capture&&shots.has(key)){await page.screenshot({path:path.join(snap,key+'.png'),fullPage:true,animations:'disabled'});images++;}
   checks++;
  }
  if(errors.length)throw Error('browser console errors '+errors.join(';'));
  if(width===375){
   await page.locator('[data-band-switch]').selectOption('costume');
   if(site==='maison-botanique'){
    await page.locator('select[data-category]').selectOption('herb');
    if(await page.locator('[data-product]:visible').count()!==1)throw Error('category filtering failed');
    await page.locator('[data-category]').selectOption('all');
    await page.locator('[data-stock]').check();
    if(await page.locator('[data-product]:visible').count()!==2)throw Error('stock filter failed');
    await page.locator('[data-stock]').uncheck();
    await page.locator('[data-add]').first().click();
    await page.locator('[data-open-cart]').click();
    if(await page.locator('#cart-dialog [data-cart-total]').textContent()!=='$24.00')throw Error('cart total incorrect');
    await page.locator('[data-checkout]').click();
    if(await page.locator('[data-cart-count]').first().textContent()!=='0')throw Error('cart reset failed');
    await page.locator('#email').fill('tester@example.com');
    await page.locator('[data-newsletter] button').click();
    if(!/fictional signup/i.test(await page.locator('[data-live]').textContent()))throw Error('newsletter missing confirmation');
   }else{
    await page.locator('[data-ticket-type]').selectOption('concession');
    await page.locator('[data-tickets]').fill('3');
    if(await page.locator('[data-ticket-total]').textContent()!=='$36.00')throw Error('ticket total incorrect');
    await page.locator('#visitor').fill('Sample Guest');
    await page.locator('#visit-email').fill('guest@example.com');
    await page.locator('#visit-date').fill('2027-01-15');
    await page.locator('[data-visit-form] button').click();
    if(!/demonstration visit request/i.test(await page.locator('[data-live]').textContent()))throw Error('visit request missing confirmation');
   }
  }
  await page.close();
 }
 console.log('PASS '+checks+' responsive/dialect/mode/fidelity combinations; local interactions passed; screenshots='+images);
}finally{await browser.close()}
