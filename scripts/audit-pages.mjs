import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const reports=[];
try{
  for(const route of ['/work','/work/after-dark','/design','/production','/rentals','/about']){
    await page.goto(`http://127.0.0.1:5173/#${route}`);
    const {violations}=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    reports.push({route,violations:violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    console.log(route,violations.length?'ISSUES':'PASS');
  }
  await page.goto('http://127.0.0.1:5173/#/');
  await page.locator('.featured-events').scrollIntoViewIfNeeded();
  await page.screenshot({path:'artifacts/work-desktop.jpg',type:'jpeg',quality:75});
  await page.locator('.design-section').scrollIntoViewIfNeeded();
  await page.screenshot({path:'artifacts/design-desktop.jpg',type:'jpeg',quality:75});
  for(const width of [320,768]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/','/rentals','/design']){
      await page.goto(`http://127.0.0.1:5173/#${route}`);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      if(overflow)reports.push({route,width,overflow});
    }
  }
  await writeFile('artifacts/page-audits.json',JSON.stringify(reports,null,2));
  const issues=reports.filter(r=>r.overflow||r.violations?.length);
  console.log(JSON.stringify(issues,null,2));
  if(issues.length)process.exitCode=1;
}finally{await browser.close();}

