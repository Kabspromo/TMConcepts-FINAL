import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
await mkdir('public/images/design',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:1800,height:1080}});
 page.on('pageerror',e=>console.error(e));
 await page.goto('http://127.0.0.1:5173/scripts/event-scene.html', {waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>window.sceneReady,{},{timeout:120000});
 for(const [mode,name]of [['final','event-visualised'],['wire','event-wireframe']]){
  await page.evaluate(mode=>window.renderScene(mode),mode);
  const png=await page.locator('canvas').screenshot();
  for(const width of [480,800,1600])await sharp(png).resize(width).webp({quality:90}).toFile('public/images/design/'+name+'-'+width+'.webp');
  await sharp(png).resize(1200).jpeg({quality:85}).toFile('artifacts/polish/'+name+'.jpg');
  console.log('Rendered '+name);
 }
}finally{await browser.close();}
