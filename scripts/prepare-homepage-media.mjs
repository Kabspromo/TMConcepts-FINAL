import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import {clientShowcase} from '../src/homeContent.js';
const origin=process.env.TM_MEDIA_ORIGIN||'http://127.0.0.1:5173';
const sources=[
 {name:'corporate-dinner',file:'WhatsApp Video 2026-09-30 at 2.24.57 PM (2).mp4',ratio:.3},
 {name:'conference-presentation',file:'WhatsApp Video 2026-09-30 at 2.24.57 PM.mp4',ratio:.3},
 {name:'paediatric-conference',file:'WhatsApp Video 2026-09-30 at 2.24.58 PM.mp4',ratio:.3},
];
await mkdir('public/images/hero',{recursive:true});
await mkdir('public/images/clients/optimized',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
for(const source of sources){
 await page.goto(origin);
 await page.setContent('<video src="'+origin+'/videos/'+encodeURIComponent(source.file)+'" muted preload="auto"></video>');
 await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
 const result=await page.locator('video').evaluate(async(v,ratio)=>{
   await new Promise(resolve=>{v.addEventListener('seeked',resolve,{once:true});v.currentTime=v.duration*ratio;});
   const canvas=document.createElement('canvas');canvas.width=v.videoWidth;canvas.height=v.videoHeight;canvas.getContext('2d').drawImage(v,0,0);
   return {width:v.videoWidth,height:v.videoHeight,data:canvas.toDataURL('image/png').split(',')[1]};
 },source.ratio);
 const original=Buffer.from(result.data,'base64');
 for(const width of [480,800,1280])await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:85}).toFile('public/images/projects/'+source.name+'-'+width+'.webp');
 console.log(source.name,result.width,result.height);
}
await browser.close();
for(const [i,name] of ['rotary-stage','corporate-dinner','conference-presentation','paediatric-conference'].entries()){
 for(const width of [480,800,1280]){
  const input='public/images/projects/'+name+'-'+width+'.webp';
  const output='public/images/hero/hero-0'+(i+1)+(width===1280?'':'-'+width)+'.webp';
  await writeFile(output,await readFile(input));
 }
}
for(const client of clientShowcase.clients){
 const name=client.logo.split('/').pop().split('.')[0];
 await sharp('public'+client.logo).trim({threshold:15}).resize({width:320,height:150,fit:'inside',withoutEnlargement:true}).webp({quality:88}).toFile('public/images/clients/optimized/'+name+'.webp');
}
console.log('Prepared real video stills, four hero slides and six client logos.');
