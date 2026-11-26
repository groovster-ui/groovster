/** 72 responsive cases + 24 axe audits, real keyboard and overlay interactions.
 * Run: node scripts/groovy-browser.mjs [--capture]. No new dependencies. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { safePath } from '../tests/helpers/safe-path.mjs';
import { inspectGroovyPage } from '../tests/groovy/probes.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const requireA11y=createRequire(path.join(root,'tools/a11y/package.json'));
const AxeBuilder=requireA11y('@axe-core/playwright').default;
const server=createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=safePath(root,pathname.replace(/^\//,''));
  if(!file||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end();return;}
  const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream';
  res.writeHead(200,{'content-type':type});res.end(fs.readFileSync(file));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const report={cases:[],interactions:[],errors:[]};
const capture=process.argv.includes('--capture');
const out=path.join(root,'generated/a11y/groovy');fs.mkdirSync(out,{recursive:true});
let browser;
try {
  browser=await chromium.launch();
  report.engine=browser.version();
  for(const [site,url] of [['home','/demos/reference/groovy-home/index.html'],['gallery','/demos/showcase/groovy.html']]) {
    // axe opens a second page to collect results, so use an explicit context.
    const context=await browser.newContext({reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',e=>report.errors.push(e.message));
    page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))report.errors.push('Network asset: '+r.url());});
    await page.goto(origin+url);
    for(const width of [320,390,768,1024,1280,1440]) {
      await page.setViewportSize({width,height:800});
      for(const mode of ['light','dark'])for(const band of ['costume','standard','whisper']) {
        await page.locator('[data-mode-switch]').selectOption(mode);
        await page.locator('[data-band-switch]').selectOption(band);
        // Let state transitions settle before comparing painted contrast.
        await page.emulateMedia({reducedMotion:'reduce'});
        const probe=await page.evaluate(inspectGroovyPage);probe.site=site;
        if(width===390||width===1280){const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();probe.axe=a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}
        report.cases.push(probe);
        if(capture&&width===1280)await page.screenshot({path:path.join(out,`${site}-${mode}-${band}.jpg`),type:'jpeg',quality:85,fullPage:true});
      }
    }
    if(site==='gallery') {
      for(const band of ['costume','standard','whisper']) {
        await page.locator('[data-band-switch]').selectOption(band);
        await page.locator('.ew-checkbox__control').press('Space');
        await page.locator('#t-basic').click();await page.locator('#t-basic').press('ArrowRight');
        assert.equal(await page.locator('#t-pro').getAttribute('aria-selected'),'true');
        await page.locator('#vol').press('Home');await page.locator('#vol').press('ArrowRight');
        assert.equal(await page.locator('.ew-slider__value').textContent(),'1');
        await page.locator('.ew-menu__trigger').press('Enter');
        assert.equal(await page.locator('.ew-menu__trigger').getAttribute('aria-expanded'),'true');
        await page.locator('.ew-menu__item').first().press('Escape');
        assert.equal(await page.locator('.ew-menu__trigger').getAttribute('aria-expanded'),'false');
        await page.getByRole('button',{name:'Open dialog',exact:true}).click();
        assert.equal(await page.locator('#sample-dialog').evaluate(el=>el.open),true);
        await page.keyboard.press('Escape');assert.equal(await page.locator('#sample-dialog').evaluate(el=>el.open),false);
        await page.locator('.ew-popover__trigger').click();assert.equal(await page.locator('#pop-1').evaluate(el=>el.matches(':popover-open')),true);
        await page.keyboard.press('Escape');
        await page.locator('.ew-switch__control').press('Space');
        const input=page.locator('.ew-switch__control');assert.equal(await input.getAttribute('aria-checked'),String(await input.isChecked()));
        report.interactions.push({band,pass:true});
      }
      await page.emulateMedia({forcedColors:'active'});
      assert.equal(await page.locator('.ew-button').first().evaluate(el=>getComputedStyle(el).borderTopStyle),'solid');
    }
    await context.close();
  }
  const failed=report.cases.filter(c=>c.errors.length||c.axe?.length);
  console.log(JSON.stringify({cases:report.cases.length,axeAudits:report.cases.filter(c=>c.axe).length,failed,errors:report.errors,interactions:report.interactions},null,2));
  assert.equal(failed.length,0);assert.deepEqual(report.errors,[]);
} finally {
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  if(browser)await browser.close();server.close();
}
