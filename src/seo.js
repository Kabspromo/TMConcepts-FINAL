import { servicePages, projects, SITE_URL, PHONE, normalisePath, routes } from './content.js';
const base = {
  '/': ['TM Concepts | Event Production, AV & Rentals in Kampala Uganda','Event design, technical production, sound, lighting, LED, power, branding and rentals from Ntinda, Kampala, Uganda. See it before it happens.','Home'],
  '/about': ['About TM Concepts | Event Production Team Kampala','Meet TM Concepts and CEO Tenywa Musa. Creative event design and technical production brought together on Semawata Road, Ntinda, Kampala.','About'],
  '/services': ['Event Design & Production Services Kampala | TM Concepts','Explore event design, AV, sound, LED, lighting, power, staging, trussing, branding, furniture and conference production in Kampala, Uganda.','Services'],
  '/work': ['Our Work | TM Concepts Event Production Uganda','Real setups, real events, real work. Explore project photographs, LED stage details, lighting and event branding from TM Concepts.','Our Work'],
  '/rentals': ['Event Equipment & Furniture Rentals Kampala | TM Concepts','Request audio, LED, lighting, generator, staging, trussing and event furniture rental availability from TM Concepts in Ntinda, Kampala.','Rentals'],
  '/contact': ['Contact TM Concepts | Event Quotes Kampala Uganda','Start an event project with TM Concepts. Visit Semawata Road, Ntinda, Kampala, or call and WhatsApp +256 704 282 211.','Contact'],
};
export const ogName = path => path==='/'?'home':path.slice(1).replaceAll('/','-');
export function getSEO(rawPath) {
  const path=normalisePath(rawPath);
  const service=servicePages.find(s=>path==='/services/'+s.slug);
  const project=projects.find(p=>path==='/work/'+p.slug);
  const info=service?[service.seoTitle,service.summary+' TM Concepts plans '+service.title.toLowerCase()+' for events in Kampala, Uganda.',service.title]:project?[project.title+' | TM Concepts Event Production',project.description,project.title]:base[path]||['Page Not Found | TM Concepts','Explore TM Concepts event design, production and rentals in Kampala, Uganda.','Page not found'];
  const canonical=SITE_URL+(path==='/'?'/':path);
  const organisation={'@type':['LocalBusiness','Organization'],'@id':SITE_URL+'/#organisation',name:'TM Concepts',slogan:'Toxic With Events',url:SITE_URL,telephone:PHONE,logo:SITE_URL+'/images/brand/tm-logo.webp',address:{'@type':'PostalAddress',streetAddress:'Semawata Road, Ntinda',addressLocality:'Kampala',addressCountry:'UG'},areaServed:[{'@type':'City',name:'Kampala'},{'@type':'Country',name:'Uganda'},{'@type':'Place',name:'East Africa'}]};
  const crumbs=[{name:'Home',item:SITE_URL+'/'}];
  if(service)crumbs.push({name:'Services',item:SITE_URL+'/services'});
  if(project)crumbs.push({name:'Our Work',item:SITE_URL+'/work'});
  if(path!=='/')crumbs.push({name:info[2],item:canonical});
  const graph=[organisation,{'@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,...c}))}];
  if(service)graph.push({'@type':'Service','@id':canonical+'#service',name:service.title,serviceType:service.title,description:service.intro,url:canonical,provider:{'@id':organisation['@id']},areaServed:organisation.areaServed});
  return {title:info[0],description:info[1],label:info[2],canonical,image:SITE_URL+'/images/og/'+ogName(routes.includes(path)?path:'/')+'.jpg',robots:routes.includes(path)?'index, follow':'noindex, follow',schema:{'@context':'https://schema.org','@graph':graph}};
}
export function updateSEO(path) {
  const meta=getSEO(path);document.title=meta.title;
  const set=(selector,attrs)=>{let el=document.head.querySelector(selector);if(!el){el=document.createElement(selector.startsWith('link')?'link':'meta');document.head.append(el);}Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));};
  set('meta[name="description"]',{name:'description',content:meta.description});
  set('meta[name="robots"]',{name:'robots',content:meta.robots});
  set('link[rel="canonical"]',{rel:'canonical',href:meta.canonical});
  for(const [key,value] of Object.entries({title:meta.title,description:meta.description,url:meta.canonical,image:meta.image,type:'website',site_name:'TM Concepts','image:width':'1200','image:height':'630','image:alt':meta.label+' — TM Concepts'}))set('meta[property="og:'+key+'"]',{property:'og:'+key,content:value});
  for(const [key,value] of Object.entries({card:'summary_large_image',title:meta.title,description:meta.description,image:meta.image}))set('meta[name="twitter:'+key+'"]',{name:'twitter:'+key,content:value});
  let schema=document.getElementById('site-schema');if(!schema){schema=document.createElement('script');schema.id='site-schema';schema.type='application/ld+json';document.head.append(schema);}schema.textContent=JSON.stringify(meta.schema);
}
