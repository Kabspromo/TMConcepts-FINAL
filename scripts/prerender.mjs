import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {render} from '../.prerender/entry-server.js';
import {routes,SITE_URL} from '../src/content.js';
import {getSEO} from '../src/seo.js';
import {workVideos} from '../src/workVideos.js';
const template=await readFile('dist/index.html','utf8');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const path of [...routes,'/404']) {
  const seo=getSEO(path);
  const head='<title>'+escape(seo.title)+'</title><meta name="description" content="'+escape(seo.description)+'"/><meta name="robots" content="'+seo.robots+'"/><link rel="canonical" href="'+seo.canonical+'"/>'+
    Object.entries({title:seo.title,description:seo.description,url:seo.canonical,image:seo.image,type:'website',site_name:'TM Concepts','image:width':'1200','image:height':'630','image:alt':seo.label+' — TM Concepts'}).map(([key,value])=>'<meta property="og:'+key+'" content="'+escape(value)+'"/>').join('')+
    Object.entries({card:'summary_large_image',title:seo.title,description:seo.description,image:seo.image}).map(([key,value])=>'<meta name="twitter:'+key+'" content="'+escape(value)+'"/>').join('')+
    '<script id="site-schema" type="application/ld+json">'+JSON.stringify(seo.schema).replaceAll('<','\\u003c')+'</script>';
  const html=template.replace('<!--page-meta-->',head).replace('<html lang="en">','<html lang="en" data-page="'+path+'">').replace('<div id="root"></div>','<div id="root">'+render(path)+'</div>');
  const file=path==='/'?'dist/index.html':join('dist',path.slice(1)+'.html');
  await mkdir(dirname(file),{recursive:true});await writeFile(file,html);
}
for(const folder of ['fonts','images/projects','images/hero','images/clients/optimized','images/services','images/equipment','images/team','images/about','images/design','images/brand','images/og'])await cp('public/'+folder,'dist/'+folder,{recursive:true});
for(const video of workVideos){
  for(const src of [video.src,video.poster]){
    const asset=decodeURIComponent(src);
    await mkdir(dirname('dist'+asset),{recursive:true});
    await cp('public'+asset,'dist'+asset);
  }
}
await cp('public/favicon.svg','dist/favicon.svg');
await writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: '+SITE_URL+'/sitemap.xml\n');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(path=>'<url><loc>'+SITE_URL+(path==='/'?'/':path)+'</loc></url>').join('')+'</urlset>');
console.log('Pre-rendered '+routes.length+' pages plus 404. Production assets include approved images, selected real event videos and required fonts.');
