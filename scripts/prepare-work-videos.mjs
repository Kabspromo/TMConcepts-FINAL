import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir,stat,writeFile} from 'node:fs/promises';
import {workVideoSources} from './work-video-sources.mjs';
const origin=process.env.TM_MEDIA_ORIGIN||'http://127.0.0.1:5173';
await mkdir('public/images/video-posters',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const videos=[];
try{
 await page.goto(origin);
 for(const source of workVideoSources){
  const src='/videos/'+encodeURIComponent(source.file);
  await page.setContent('<video muted preload="auto" src="'+origin+src+'"></video>');
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  const metadata=await page.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration}));
  await page.locator('video').evaluate((v,time)=>{v.currentTime=Math.min(time,v.duration-.1);},source.posterTime);
  await page.waitForFunction(()=>{const v=document.querySelector('video');return !v.seeking&&v.readyState>=2;});
  const frame=await page.locator('video').evaluate(v=>{const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/png').split(',')[1];});
  const poster='/images/video-posters/'+source.id+'.webp';
  await sharp(Buffer.from(frame,'base64')).resize({width:1280,withoutEnlargement:true}).webp({quality:85,effort:5}).toFile('public'+poster);
  const {file,posterTime,...copy}=source;
  videos.push({...copy,src,poster,...metadata,orientation:metadata.height>metadata.width?'portrait':'landscape',bytes:(await stat('public/videos/'+file)).size});
  console.log(source.id,metadata.width+'x'+metadata.height,metadata.duration.toFixed(2)+'s');
 }
 await writeFile('src/workVideos.js','// Only inspected, client-supplied event footage. Original video filenames are preserved.\n// Metadata and matching real-frame posters: npm run media:videos.\nexport const workVideos = '+JSON.stringify(videos,null,2)+';\nexport const featuredWorkVideos = workVideos.filter(video=>video.featured);\n');
}finally{await browser.close();}