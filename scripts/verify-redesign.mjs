import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {routes,servicePages,projects,aliases,SITE_URL,workFilters} from '../src/content.js';
import {getSEO} from '../src/seo.js';
const origin=process.env.TM_TEST_ORIGIN||'http://127.0.0.1:4173';
await mkdir('artifacts/redesign',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[],results=[],accessibility=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
const check=(name,condition)=>{assert.ok(condition,name);results.push(name);};
const goto=async(path)=>{await page.goto(origin+path);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);};
try{
  const titles=new Set(),descriptions=new Set(),images=new Set();
  for(const path of routes){
    const response=await fetch(origin+path),html=await response.text(),seo=getSEO(path);
    check('Static HTML and title '+path,response.status===200&&html.includes('<h1')&&html.includes(seo.title.replaceAll('&','&amp;')));
    check('Canonical and schema '+path,html.includes('href="'+seo.canonical+'"')&&html.includes('application/ld+json')&&html.includes('BreadcrumbList'));
    titles.add(seo.title);descriptions.add(seo.description);images.add(seo.image);
  }
  check('Every page has unique title, description and social image',titles.size===routes.length&&descriptions.size===routes.length&&images.size===routes.length);
  console.log('PASS pre-rendered SEO on '+routes.length+' routes.');
  const widths=[360,375,390,412,430,768,1024,1440,1920];
  for(const width of widths){
    await page.setViewportSize({width,height:width<700?844:1000});
    for(const path of routes){
      await goto(path);
      check(width+'px one heading '+path,await page.locator('main h1').count()===1);
      const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth,offenders:[...document.querySelectorAll('main h1,main h2,main h3,.button,.fields input,.process-tabs')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1);}).map(el=>el.className+': '+el.textContent.slice(0,70))}));
      check(width+'px no overflow '+path,!overflow.page&&overflow.offenders.length===0);
      check(width+'px rendered metadata '+path,await page.title()===getSEO(path).title);
      if(width===1440) {
        await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;})));});
        check('All photos loaded '+path,await page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.naturalWidth>0)));
        const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
        accessibility.push({path,violations:audit.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
      }
    }
    console.log('PASS responsive layout at '+width+'px across '+routes.length+' routes.');
  }
  await writeFile('artifacts/redesign/accessibility.json',JSON.stringify(accessibility,null,2));
  check('No WCAG A/AA violations in page audit',accessibility.every(x=>x.violations.length===0));
  await page.setViewportSize({width:1440,height:1000});await goto('/');
  await page.screenshot({path:'artifacts/redesign/home-desktop.jpg',quality:80});
  await page.screenshot({path:'artifacts/redesign/home-full.jpg',quality:65,fullPage:true});
  await page.locator('.services-nav summary').click();
  check('Grouped services mega menu opens',await page.locator('.mega-menu').isVisible());
  await page.keyboard.press('Escape');check('Escape closes mega menu',!(await page.locator('.services-nav').getAttribute('open'))&&await page.locator('.services-nav summary').evaluate(el=>el===document.activeElement));
  await page.locator('.services-nav summary').click();await page.locator('.mega-menu').getByRole('link',{name:'Event Power & Generator Solutions',exact:true}).click();
  check('Service navigation uses clean URLs',new URL(page.url()).pathname==='/services/power-solutions');
  await page.goBack();await page.locator('.hero').waitFor();check('Back navigation restores home',await page.locator('.hero').isVisible());
  for(const [old,destination]of Object.entries(aliases)){
    await goto('/#'+old);check('Legacy hash redirect '+old,new URL(page.url()).pathname===destination&&new URL(page.url()).hash==='');
  }
  await goto('/');
  const slider=page.getByRole('slider',{name:'Compare event design and final visualisation'});
  await slider.focus();await slider.press('ArrowRight');check('Comparison is keyboard adjustable',await slider.inputValue()==='51');
  await goto('/about');
  await page.getByRole('tab',{name:/Idea/}).focus();await page.keyboard.press('ArrowRight');
  check('Process tabs support arrow keys',await page.getByRole('tab',{name:/Space planning/}).getAttribute('aria-selected')==='true');
  await goto('/work');
  for(const filter of workFilters){
    await page.getByRole('button',{name:filter,exact:true}).click();
    const count=projects.filter(p=>filter==='All'||p.categories.includes(filter)).length;
    check('Portfolio filter '+filter,await page.locator('.project-card').count()===count);
    if(!count)check('Clean empty category state '+filter,await page.locator('.work-empty .photo-placeholder').isVisible());
  }
  await page.getByRole('button',{name:'Pause gallery',exact:true}).click();check('Gallery pause control',await page.locator('.project-marquee').evaluate(el=>el.classList.contains('is-paused')));
  await page.getByRole('button',{name:'Resume gallery',exact:true}).click();
  check('Reduced motion stops marquee',await page.locator('.marquee-track').first().evaluate(el=>getComputedStyle(el).animationName==='none'));
  await goto('/contact');
  const inline=page.locator('.builder-embedded');
  await inline.getByLabel('Venue or location').fill('Ntinda test venue');
  await inline.getByRole('button',{name:'Continue',exact:true}).click();
  check('Event type validation',await inline.getByRole('alert').innerText()==='Choose an event type to continue.');
  await inline.getByRole('button',{name:'Conference',exact:true}).click();await inline.getByRole('button',{name:'Continue',exact:true}).click();
  await inline.getByRole('button',{name:'Continue',exact:true}).click();check('Service validation',await inline.getByRole('alert').innerText()==='Choose at least one service, or select Full Production.');
  await goto('/rentals');
  await page.getByRole('searchbox',{name:'Search equipment'}).fill('moving');
  check('Rental search narrows the catalog',await page.locator('.equipment-card').count()===1);
  await page.getByRole('button',{name:'View Moving head beam details',exact:true}).click();check('Equipment detail dialog',await page.locator('.equipment-dialog').isVisible());
  await page.getByRole('button',{name:'ADD TO YOUR BRIEF',exact:true}).click();await page.getByRole('button',{name:'YOUR BRIEF (1)',exact:true}).click();
  const form=page.locator('.project-dialog');
  await form.getByRole('button',{name:'Conference',exact:true}).click();
  await form.getByLabel('Venue or location').fill('Kampala test venue');
  await form.getByLabel('Number of guests').fill('250');await form.getByLabel('Event date').fill('2027-02-20');
  await form.getByRole('button',{name:'Continue',exact:true}).click();
  await form.getByRole('button',{name:'Power & Generators',exact:true}).click();await form.getByRole('button',{name:'Branding & Signage',exact:true}).click();
  await form.getByRole('button',{name:'Increase Moving head beam quantity'}).click();
  const file=form.locator('input[type=file]');
  await file.setInputFiles({name:'not-allowed.txt',mimeType:'text/plain',buffer:Buffer.from('test')});
  check('Unsupported attachments rejected',await form.getByRole('alert').isVisible());
  await file.setInputFiles({name:'venue-plan.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\nTest venue plan')});
  check('Venue file accepted with local-only notice',await form.getByText('venue-plan.pdf',{exact:true}).isVisible()&&await form.getByText('Files stay on your device. Attach them in WhatsApp after opening your brief.').isVisible());
  await form.getByRole('button',{name:'Continue',exact:true}).click();
  await form.getByLabel('Your name').fill('Preview Tester');await form.getByLabel('Email',{exact:false}).fill('preview@example.com');await form.getByLabel('Phone',{exact:true}).fill('+256700000000');await form.getByLabel('Company',{exact:true}).fill('Test Organisation');await form.getByLabel('Message',{exact:true}).fill('Testing the production brief locally.');
  await form.getByRole('button',{name:'Review your brief',exact:true}).click();
  const whatsapp=new URL(await form.getByRole('link',{name:'Open brief in WhatsApp'}).getAttribute('href'));const brief=whatsapp.searchParams.get('text');
  check('Correct WhatsApp recipient and complete enquiry',whatsapp.origin==='https://wa.me'&&whatsapp.pathname==='/256704282211'&&['Test Organisation','Power & Generators','Branding & Signage','Moving head beam × 2','venue-plan.pdf','Kampala test venue','250','2027-02-20'].every(s=>brief.includes(s)));
  const [download]=await Promise.all([page.waitForEvent('download'),form.getByRole('button',{name:'Download brief'}).click()]);
  check('Brief download preserves complete content',(await readFile(await download.path(),'utf8'))===brief);
  const dialogAudit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  check('Project review dialog accessibility',dialogAudit.violations.length===0);
  await page.keyboard.press('Escape');check('Escape closes project dialog',!(await form.isVisible()));
  await goto('/about');
  const [pdf]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/COMPANY PROFILE PDF/}).click()]);
  check('Company profile PDF downloads',pdf.suggestedFilename()==='tm-concepts-company-profile.pdf');
  await goto('/services/power-solutions');await page.screenshot({path:'artifacts/redesign/power-desktop.jpg',quality:75,fullPage:true});
  await goto('/work');await page.screenshot({path:'artifacts/redesign/work-desktop.jpg',quality:70,fullPage:true});
  for(const width of [375,390,430]){
    await page.setViewportSize({width,height:844});await goto('/');
    await page.getByRole('button',{name:'Open navigation menu'}).click();check('Mobile menu opens '+width,await page.locator('.menu-dialog').isVisible());
    await page.locator('.menu-dialog').getByRole('link',{name:'Services',exact:false}).first().click();
    check('Mobile menu closes after navigation '+width,!(await page.locator('.menu-dialog').isVisible())&&new URL(page.url()).pathname==='/services');
    await page.locator('.header-project').click();check('Mobile brief does not overflow '+width,await form.evaluate(el=>el.scrollWidth<=el.clientWidth));
    await page.keyboard.press('Escape');
  }
  await page.setViewportSize({width:390,height:844});await goto('/');await page.screenshot({path:'artifacts/redesign/home-mobile.jpg',quality:85});await page.screenshot({path:'artifacts/redesign/home-mobile-full.jpg',quality:65,fullPage:true});
  await goto('/contact');await page.screenshot({path:'artifacts/redesign/contact-mobile.jpg',quality:75,fullPage:true});
  check('No console, hydration, runtime or asset errors',errors.length===0);
  console.log('PASS '+results.length+' checks; '+routes.length+' page accessibility audits; zero runtime errors.');
  await writeFile('artifacts/redesign/results.json',JSON.stringify({passed:results.length,checks:results,errors,accessibility},null,2));
}catch(error){
  console.error('Verification failed:',error.message,'at',page.url());
  await writeFile('artifacts/redesign/failure.json',JSON.stringify({message:error.message,url:page.url(),errors,accessibility},null,2));
  await page.screenshot({path:'artifacts/redesign/failure.jpg',quality:70,timeout:10000}).catch(()=>{});
  throw error;
}finally{await browser.close();}
