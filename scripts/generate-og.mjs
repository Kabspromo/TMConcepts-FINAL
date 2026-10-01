import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
import {routes,servicePages,slotMedia,media,projects} from '../src/content.js';
import {getSEO,ogName} from '../src/seo.js';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await mkdir('public/images/og',{recursive:true});
for(const route of routes) {
  const service=servicePages.find(s=>route==='/services/'+s.slug);
  const label=route==='/'?'SEE IT BEFORE IT HAPPENS.':getSEO(route).label.toUpperCase();
  const words=label.split(' '),lines=[];let line='';
  for(const word of words){if((line+' '+word).length>25){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);
  const project=projects.find(p=>route==='/work/'+p.slug);
  const photo=project?project.images[0]:route==='/'||route==='/work'?slotMedia['HOMEPAGE HERO']:(service?.photo || slotMedia[service?.slot]);
  const item=typeof photo==='string'?media[photo]:photo;
  const base=item?await sharp(item.src ? 'public'+item.src : 'public/images/projects/'+item.name+'-1280.webp').resize(1200,630,{fit:'cover'}).toBuffer():{create:{width:1200,height:630,channels:3,background:'#101114'}};
  const svg='<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="shade"><stop stop-color="#050505" stop-opacity=".97"/><stop offset="1" stop-color="#050505" stop-opacity=".35"/></linearGradient></defs><rect width="1200" height="630" fill="url(#shade)"/><path d="M1040 0L790 630" stroke="#319cff" stroke-width="2" opacity=".65"/><g fill="#fff" font-family="Arial,sans-serif"><text x="72" y="86" font-size="26" font-weight="700">TM CONCEPTS</text><text x="72" y="124" font-size="20" fill="#b7b7bd">TOXIC WITH EVENTS</text>'+lines.map((text,i)=>'<text x="72" y="'+(250+i*74)+'" font-size="62" font-weight="800" letter-spacing="-2">'+escape(text)+'</text>').join('')+'<rect x="72" y="516" width="55" height="3" fill="#319cff"/><text x="72" y="570" font-size="23">NTINDA · KAMPALA · UGANDA</text></g></svg>';
  await sharp(base).composite([{input:Buffer.from(svg)}]).jpeg({quality:85}).toFile('public/images/og/'+ogName(route)+'.jpg');
}
console.log('Generated '+routes.length+' unique social preview cards from real photographs and brand typography.');
