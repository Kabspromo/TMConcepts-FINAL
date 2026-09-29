import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[];let checks=0;
page.on('pageerror',e=>errors.push(e.message));
const check=(label,value)=>{assert.ok(value,label);checks++;console.log('PASS '+label);};
try{
  await page.goto('http://127.0.0.1:5173/');
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=r;img.onerror=r;})));});
  const home=page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Home',exact:true});
  check('Desktop Home is visible and active',await home.isVisible()&&await home.getAttribute('aria-current')==='page');
  check('Reduced motion skips scroll effects',await page.locator('.services-brief').evaluate(el=>!el.classList.contains('scroll-reveal'))&&await page.locator('.scroll-light-flash').evaluate(el=>getComputedStyle(el).display==='none'));
  await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Work',exact:true}).click();
  check('Home is not highlighted on other pages',!(await home.getAttribute('class')).includes('active'));
  await home.click();
  check('Home returns to the homepage',page.url().endsWith('#/'));
  const whatsapp=page.getByRole('link',{name:'Chat with TM Concepts on WhatsApp'});
  check('WhatsApp icon is visible on desktop',await whatsapp.isVisible()&&await whatsapp.locator('svg').isVisible());
  check('WhatsApp uses the supplied phone number',(await whatsapp.getAttribute('href')).startsWith('https://wa.me/256704282211?'));
  await page.locator('.clients-section').scrollIntoViewIfNeeded();
  check('Six real client logos load in the marquee',await page.getByRole('region',{name:'Client logos'}).isVisible()&&await page.locator('.client-logo img').count()===12&&await page.locator('.client-logo img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0)));
  await page.locator('.impact-section').scrollIntoViewIfNeeded();
  await expect(page.locator('.counter-value').first()).toHaveText('200+');
  check('Counters show delivered events, experience, corporate clients and satisfaction',JSON.stringify(await page.locator('.counter-value').allTextContents())===JSON.stringify(['200+','15+','50+','100%'])&&JSON.stringify(await page.locator('.impact-stat h3').allTextContents())===JSON.stringify(['Events Delivered','Years Experience','Corporate Clients','Satisfaction Rate']));
  await page.locator('.services-brief').scrollIntoViewIfNeeded();
  check('Services overview has five linked photo cards',await page.locator('.brief-service-card').count()===5);
  await page.screenshot({path:'artifacts/services-brief.jpg',type:'jpeg',quality:80});
  await page.locator('.featured-events').scrollIntoViewIfNeeded();
  check('Three featured events are present',await page.locator('.featured-event').count()===3);
  await page.screenshot({path:'artifacts/featured-events.jpg',type:'jpeg',quality:80});
  for(const slug of ['corporate-summit','wedding-reception']){
    await page.goto(`http://127.0.0.1:5173/#/work/${slug}`);
    check(`Featured ${slug} detail opens`,await page.locator('.project-detail-hero').isVisible());
  }
  await page.goto('http://127.0.0.1:5173/#/');
  check('Reduced motion prevents automatic background video',await page.locator('.hero-backdrop video').evaluate(v=>v.paused));
  check('TM video is used in the hero header',await page.locator('.hero-backdrop video').getAttribute('src')==='/videos/tm.mp4');
  await page.getByRole('button',{name:'Play background video',exact:true}).click();
  await expect.poll(()=>page.locator('.hero-backdrop video').evaluate(v=>v.videoWidth),{timeout:15000}).toBeGreaterThanOrEqual(1920);
  check('Hero video plays in Full HD',await page.locator('.hero-backdrop video').evaluate(v=>!v.paused&&v.videoHeight>=1080&&v.muted));
  await page.screenshot({path:'artifacts/home-video-desktop.jpg',type:'jpeg',quality:80});
  await page.getByRole('button',{name:'Pause background video',exact:true}).click();
  check('Hero video pause works',await page.locator('.hero-backdrop video').evaluate(v=>v.paused));
  await page.getByRole('button',{name:'Play event showreel',exact:true}).click();
  await expect.poll(()=>page.locator('.experience-film video').evaluate(v=>v.videoWidth),{timeout:15000}).toBeGreaterThanOrEqual(1920);
  check('Showreel plays Full HD with controls',await page.locator('.experience-film video').evaluate(v=>!v.paused&&v.videoHeight>=1080&&v.controls));
  await page.locator('.experience-film video').evaluate(v=>v.pause());
  await page.screenshot({path:'artifacts/showreel-desktop.jpg',type:'jpeg',quality:80});
  await page.goto('http://127.0.0.1:5173/#/design');
  const designVideo=page.getByLabel('TM Concepts design video');
  check('FR video is embedded on the Design page',await designVideo.getAttribute('src')==='/videos/fr.mp4');
  await page.getByRole('button',{name:'Play Design page video',exact:true}).click();
  await expect.poll(()=>designVideo.evaluate(v=>v.videoWidth),{timeout:20000}).toBeGreaterThan(0);
  check('FR Design page video loads and plays',await designVideo.evaluate(v=>!v.paused&&v.videoHeight>=720&&v.controls));
  await designVideo.evaluate(v=>v.pause());
  await home.click();
  check('Home scrolls back to the opening section',await page.evaluate(()=>scrollY===0));
  const audits=[];
  for(const width of [1440,768,390,320]){
    await page.setViewportSize({width,height:width<600?844:1000});
    await page.goto('http://127.0.0.1:5173/#/');
    await page.locator('.hero').waitFor();
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    check(`No horizontal overflow at ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    check(`WhatsApp icon visible at ${width}px`,await whatsapp.isVisible());
    if(width<900){check(`Home shortcut visible at ${width}px`,await page.locator('.home-tab-link').isVisible());}
    if(width===1440||width===390){
      const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      audits.push({width,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
      await page.screenshot({path:`artifacts/home-updated-${width}.jpg`,type:'jpeg',quality:80});
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Open navigation menu'}).click();
  const menu=page.getByRole('dialog',{name:'Site navigation'});
  check('Expanded mobile menu includes Home',await menu.getByRole('link',{name:'01 Home',exact:true}).isVisible());
  await menu.getByRole('link',{name:'01 Home',exact:true}).click();
  check('Home closes mobile menu',!await menu.isVisible());
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('http://127.0.0.1:5173/');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.locator('.clients-section').scrollIntoViewIfNeeded();
  const logoTrack=page.locator('.client-track');
  const trackPosition=await logoTrack.evaluate(element=>getComputedStyle(element).transform);
  await expect.poll(()=>logoTrack.evaluate(element=>getComputedStyle(element).transform)).not.toBe(trackPosition);
  check('Client logos scroll sideways automatically',true);
  await page.getByRole('button',{name:'Pause client logos'}).click();
  check('Client logo scrolling can be paused',await logoTrack.evaluate(element=>getComputedStyle(element).animationPlayState)==='paused');
  await page.getByRole('button',{name:'Resume client logos'}).click();
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await expect.poll(()=>page.locator('.hero-backdrop video').evaluate(v=>!v.paused),{timeout:15000}).toBe(true);
  check('Muted background video autoplays normally',await page.locator('.hero-backdrop video').evaluate(v=>v.muted&&!v.paused));
  await page.locator('.services-brief').scrollIntoViewIfNeeded();
  await expect(page.locator('.services-brief')).toHaveClass(/scroll-revealed/);
  check('Scroll reveal triggers a lighting sweep',await page.locator('.services-brief').evaluate(el=>el.classList.contains('scroll-revealed'))&&await page.locator('.scroll-light-flash').evaluate(el=>getComputedStyle(el).animationName==='scroll-light-sweep'));
  await expect.poll(()=>page.locator('.hero-backdrop video').evaluate(v=>v.paused)).toBe(true);
  check('Offscreen background video pauses',await page.locator('.hero-backdrop video').evaluate(v=>v.paused));
  check('No browser errors',errors.length===0);
  await writeFile('artifacts/homepage-checks.json',JSON.stringify({checks,errors,audits},null,2));
  console.log(JSON.stringify(audits,null,2));
  check('New sections pass accessibility scans',audits.every(a=>a.violations.length===0));
}catch(e){await page.screenshot({path:'artifacts/homepage-failure.jpg',type:'jpeg',quality:80,fullPage:true});console.error(e);process.exitCode=1;}
finally{await browser.close();}



