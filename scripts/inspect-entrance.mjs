import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
await page.locator('.site-entrance').waitFor();
console.log(await page.evaluate(()=>new Promise(resolve=>{
  const samples=[];const start=performance.now();
  const interval=setInterval(()=>{
    const root=document.querySelector('.site-entrance');const sign=document.querySelector('.entrance-signature');
    samples.push({time:Math.round(performance.now()-start),phase:root?.getAttribute('data-phase'),class:root?.className,opacity:sign&&getComputedStyle(sign).opacity,animation:sign&&getComputedStyle(sign).animationName,duration:sign&&getComputedStyle(sign).animationDuration,delay:sign&&getComputedStyle(sign).animationDelay,state:sign&&getComputedStyle(sign).animationPlayState,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches});
    if(samples.length===24){clearInterval(interval);resolve(samples);}
  },180);
})));
}finally{await browser.close();}
