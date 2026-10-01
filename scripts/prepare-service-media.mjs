import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const records=JSON.parse(await readFile('scripts/service-media-sources.json','utf8'));
const candidates=JSON.parse(await readFile('scripts/service-stock-sources.json','utf8'));
await mkdir('artifacts/service-audit/stock',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const imagery={},credits=[];
try{
 for(const entry of records){
  let input,source;
  if(entry.stock){
   const stock=candidates.find(i=>i.key===entry.stock);
   if(!stock)throw Error('Missing approved stock '+entry.stock);
   try{input=await readFile('artifacts/service-audit/stock/'+entry.stock+'.jpg');}catch{const response=await fetch(stock.url);if(!response.ok)throw Error('Stock download failed: '+entry.stock);input=Buffer.from(await response.arrayBuffer());await writeFile('artifacts/service-audit/stock/'+entry.stock+'.jpg',input);}
   source={kind:'stock',caption:'SERVICE ILLUSTRATION',author:stock.author,provider:stock.provider,url:stock.page,license:stock.license};
   credits.push({service:entry.slug,...stock,usage:'Service illustration only; not a TM Concepts project'});
  }else if(entry.video){
   await page.goto('http://127.0.0.1:5173/');
   await page.setContent('<video src="http://127.0.0.1:5173/videos/'+encodeURIComponent(entry.video)+'" muted preload="auto"></video>');
   await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
   const data=await page.locator('video').evaluate(async(v,ratio)=>{await new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=v.duration*ratio;});const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/png').split(',')[1];},entry.ratio);
   input=Buffer.from(data,'base64');source={kind:entry.kind,caption:entry.caption,original:entry.video,frameRatio:entry.ratio};
  }else{input=await readFile(entry.local);source={kind:entry.kind,caption:entry.caption,original:entry.local};}
  let pipeline=sharp(input);if(entry.crop)pipeline=pipeline.extract(entry.crop);const base=await pipeline.toBuffer();const meta=await sharp(base).metadata();
  const dir='public/images/services/'+entry.folder;await mkdir(dir,{recursive:true});
  const widths=[...new Set([480,800,1280].map(w=>Math.min(w,meta.width)))];
  for(const w of widths)await sharp(base).resize(w).webp({quality:85,effort:5}).toFile(dir+'/'+entry.file+'-'+w+'.webp');
  const max=widths.at(-1),prefix='/images/services/'+entry.folder+'/'+entry.file;
  imagery[entry.slug]={src:prefix+'-'+max+'.webp',srcSet:widths.map(w=>prefix+'-'+w+'.webp '+w+'w').join(', '),width:max,height:Math.round(meta.height*max/meta.width),alt:entry.alt,position:entry.position,mobilePosition:entry.mobilePosition||entry.position,source};
  console.log(entry.slug,max,Math.round(meta.height*max/meta.width),source.kind);
 }
 await writeFile('src/serviceImagery.js','// Service imagery shared by cards, detail pages and social previews.\n// Sources and licenses are documented in SERVICE-IMAGE-AUDIT.md.\nexport const serviceImagery = '+JSON.stringify(imagery,null,2)+';\n');
 await writeFile('public/images/services/credits.json',JSON.stringify(credits,null,2));
}finally{await browser.close();}
