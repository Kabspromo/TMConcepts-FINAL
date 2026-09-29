import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:5173');
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r;})));});
  await page.screenshot({path:'artifacts/home-desktop.jpg',type:'jpeg',quality:80});
  await page.screenshot({path:'artifacts/home-full.jpg',type:'jpeg',quality:70,fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'artifacts/home-mobile.jpg',type:'jpeg',quality:80});
  console.log('Final desktop and mobile preview captures saved.');
}finally{await browser.close();}
