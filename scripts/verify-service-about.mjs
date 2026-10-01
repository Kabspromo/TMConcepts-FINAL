import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {servicePages,projects,media} from '../src/content.js';
import {serviceImagery} from '../src/serviceImagery.js';
import {aboutCompany,aboutJourney} from '../src/aboutContent.js';
const origin=process.env.TM_TEST_ORIGIN||'http://127.0.0.1:4173';
await mkdir('artifacts/service-audit/verification',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),checks=[],errors=[],audits=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
const load=async path=>{await page.goto(origin+path);await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});};
try{
 check('Every service has an explicit image mapping',servicePages.every(s=>s.photo===serviceImagery[s.slug]));
 check('Technically distinct services have distinct images',new Set(servicePages.map(s=>s.photo.src)).size===servicePages.length);
 check('All service images are local optimized WebP',servicePages.every(s=>s.photo.src.startsWith('/images/services/')&&s.photo.src.endsWith('.webp')));
 for(const s of servicePages){const m=await sharp(await readFile('public'+s.photo.src)).metadata();check('Image dimensions match '+s.slug,m.width===s.photo.width&&m.height===s.photo.height);check('Source and crop metadata '+s.slug,Boolean(s.photo.alt&&s.photo.position&&s.photo.mobilePosition&&s.photo.source.kind));}
 check('Stock is documented with source, author and license',servicePages.filter(s=>s.photo.source.kind==='stock').every(s=>s.photo.source.url&&s.photo.source.author&&s.photo.source.license));
 check('Portfolio contains no stock imagery',projects.flatMap(p=>p.images).every(key=>media[key]&&media[key].source?.kind!=='stock'&&!media[key].src?.includes('/services/')));
 for(const width of [360,375,390,412,430,768,1024,1440]){
  await page.setViewportSize({width,height:width<700?844:1000});
  for(const route of ['/','/services','/about']){
   await load(route);
   check(width+'px no horizontal overflow '+route,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(width+'px all image assets load '+route,await page.locator('img').evaluateAll(items=>items.every(i=>i.naturalWidth>0)));
   if(route!=='/about'){
    const cards=await page.locator('.service-card').evaluateAll(nodes=>nodes.map(n=>({path:new URL(n.href).pathname,src:n.querySelector('img')?.getAttribute('src'),position:n.querySelector('img')?getComputedStyle(n.querySelector('img')).objectPosition:null})));
    check(width+'px shared service images '+route,cards.every(c=>serviceImagery[c.path.split('/').at(-1)]?.src===c.src));
    check(width+'px deliberate service crop '+route,cards.every(c=>{const image=serviceImagery[c.path.split('/').at(-1)];return c.position===(width<=600?image.mobilePosition:image.position);}));
   }else{
    check(width+'px six-stage journey',await page.getByRole('tab').count()===6);
    check(width+'px exact mission',(await page.locator('.about-mission h2').innerText())===aboutCompany.mission);
    check(width+'px prominent vision',(await page.locator('.about-vision h2').innerText()).replaceAll('\n',' ')===aboutCompany.vision);
    check(width+'px named CEO',await page.getByRole('heading',{name:'TENYWA MUSA',exact:true}).count()===1);
   }
   if(width===390||width===1440){await page.screenshot({path:'artifacts/service-audit/verification/'+(route==='/'?'home':route.slice(1))+'-'+width+'.jpg',quality:80,fullPage:true});}
   if(width===1440){const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({route,violations:audit.violations});check('No accessibility violations '+route,audit.violations.length===0);}
  }
 }
 await load('/about');
 await page.getByRole('tab',{name:/Idea/}).focus();await page.keyboard.press('End');check('Process End key reaches live event',await page.getByRole('tab',{name:/Live event/}).getAttribute('aria-selected')==='true');
 await page.keyboard.press('ArrowRight');check('Process arrow key wraps six stages',await page.getByRole('tab',{name:/Idea/}).getAttribute('aria-selected')==='true');
 for(const s of servicePages){
  await load('/services/'+s.slug);
  check('Detail page uses shared image '+s.slug,await page.locator('.service-hero-media img').getAttribute('src')===s.photo.src);
  if(s.photo.source.kind==='stock'){
   check('Stock never labelled as TM work '+s.slug,(await page.locator('.service-hero-media .photo-credit').innerText()).includes('SERVICE ILLUSTRATION')&&!(await page.locator('.service-evidence').innerText()).includes('IN A TM CONCEPTS EVENT'));
   check('Credit links to exact source '+s.slug,await page.locator('.service-hero-media .photo-credit a').getAttribute('href')===s.photo.source.url);
  }
 }
 await page.setViewportSize({width:390,height:844});await load('/services');
 const tiles=[];
 for(const service of servicePages){
  const card=page.locator('.service-card[href="/services/'+service.slug+'"]');
  await card.scrollIntoViewIfNeeded();const buffer=await card.screenshot();
  tiles.push(await sharp(buffer).resize({width:300}).extend({top:0,bottom:10,left:0,right:0,background:'#f4f4f1'}).png().toBuffer());
 }
 const dimensions=await Promise.all(tiles.map(tile=>sharp(tile).metadata()));const rowHeight=Math.max(...dimensions.map(d=>d.height));
 await sharp({create:{width:1200,height:Math.ceil(tiles.length/4)*rowHeight,channels:3,background:'#f4f4f1'}}).composite(tiles.map((input,i)=>({input,left:i%4*300,top:Math.floor(i/4)*rowHeight}))).jpeg({quality:85}).toFile('artifacts/service-audit/verification/service-card-review.jpg');
 check('No runtime or console errors',errors.length===0);
 await writeFile('artifacts/service-audit/verification/results.json',JSON.stringify({passed:checks.length,checks,errors,audits},null,2));
 console.log('PASS '+checks.length+' service image, About, crop, accessibility and source checks.');
}catch(error){await page.screenshot({path:'artifacts/service-audit/verification/failure.jpg',quality:80,fullPage:true});await writeFile('artifacts/service-audit/verification/failure.json',JSON.stringify({message:error.message,url:page.url(),checks,errors,audits},null,2));throw error;}finally{await browser.close();}
