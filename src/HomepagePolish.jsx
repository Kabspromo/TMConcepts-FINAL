import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowDown,MapPin,Pause,Play} from 'lucide-react';
import {heroSlides,homeStats,clientLogos,productionLinks,whyTM} from './homepageContent';
import {projects,servicePages} from './content';
import {SectionLabel,Watermark,ServiceGrid,Photo,ProjectCard,BeforeAfterSlider,CTASection} from './components';
import {aboutCompany} from './aboutContent';
import StageLightAmbient from './StageLightAmbient';

function useReducedMotion(){
  const [reduced,setReduced]=useState(true);
  useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
  return reduced;
}
function useVisible(ref,threshold=.15){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect();},[ref,threshold]);
  return visible;
}
export function HeroSlider({startProject}){
  const [active,setActive]=useState(0),[ready,setReady]=useState(false),[paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[hidden,setHidden]=useState(false);
  const root=useRef(null),gesture=useRef(null),reduced=useReducedMotion(),visible=useVisible(root);
  const running=!paused&&!hovered&&!hidden&&!reduced&&visible;
  useEffect(()=>{const timer=setTimeout(()=>setReady(true),1600);const onVisibility=()=>setHidden(document.hidden);onVisibility();document.addEventListener('visibilitychange',onVisibility);return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',onVisibility);};},[]);
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setActive(index=>(index+1)%heroSlides.length),6000);return()=>clearInterval(timer);},[running]);
  const select=index=>{setReady(true);setPaused(true);setActive((index+heroSlides.length)%heroSlides.length);};
  const swipeStart=e=>{if(e.target.closest('a,button'))return;gesture.current={x:e.clientX,y:e.clientY};};
  const swipeEnd=e=>{if(!gesture.current)return;const dx=e.clientX-gesture.current.x,dy=e.clientY-gesture.current.y;gesture.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)select(active+(dx<0?1:-1));};
  return <section ref={root} className={'hero hero-slider '+(running?'is-playing':'is-paused')} aria-label="TM Concepts event photography" aria-roledescription="carousel" onPointerEnter={e=>{if(e.pointerType==='mouse')setHovered(true);}} onPointerLeave={()=>{setHovered(false);gesture.current=null;}} onPointerDown={swipeStart} onPointerUp={swipeEnd} onPointerCancel={()=>gesture.current=null} onFocusCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(true);}} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1));}}} data-active-slide={active}>
    <div className="hero-slides">{heroSlides.map((slide,i)=><div className={'hero-slide '+(i===active?'is-active':'')} key={slide.id} aria-hidden={i!==active} style={{'--photo-position':slide.position,'--mobile-photo-position':slide.mobilePosition}}>{(i===0||ready||i===active)&&<img src={'/images/hero/'+slide.file+'.webp'} srcSet={slide.width>800?'/images/hero/'+slide.file+'-480.webp 480w, /images/hero/'+slide.file+'-800.webp 800w, /images/hero/'+slide.file+'.webp 1280w':'/images/hero/'+slide.file+'-480.webp 480w, /images/hero/'+slide.file+'.webp 640w'} sizes="100vw" width={slide.width} height={slide.height} alt={slide.alt} fetchPriority={i===0?'high':'low'} loading={i===0?'eager':'lazy'} decoding="async" onError={e=>{e.currentTarget.style.opacity=0;}}/>}</div>)}</div>
    <div className="hero-shade"/><StageLightAmbient/>
    <div className="hero-content"><span className="eyebrow hero-kicker"><i/> DESIGN / PRODUCTION / TECHNOLOGY</span><h1>SEE IT<br/>BEFORE IT<br/><span>HAPPENS.</span></h1><p>Event Design <b>•</b> Technical Production <b>•</b> AV <b>•</b> LED <b>•</b> Lighting <b>•</b> Audio <b>•</b> Power <b>•</b> Rentals</p><div className="hero-actions"><a href="/work" className="button white">VIEW OUR WORK <ArrowUpRight size={20}/></a><button className="button glass" onClick={startProject}>START A PROJECT <ArrowUpRight size={20}/></button></div></div>
    <div className="hero-slider-footer"><div className="hero-position"><MapPin size={17}/><span>KAMPALA, UGANDA</span></div><div className="hero-controls" role="group" aria-label="Hero slideshow controls">{heroSlides.map((slide,i)=><button key={slide.id} className={'hero-indicator '+(active===i?'active':'')} onClick={()=>select(i)} aria-label={'Show slide '+(i+1)+': '+slide.title} aria-pressed={active===i}><span>{String(i+1).padStart(2,'0')}</span><i key={active===i?'active':'inactive'} aria-hidden="true"/></button>)}<button className="hero-play icon-button" aria-label={reduced?'Slideshow paused for reduced motion':paused?'Play slideshow':'Pause slideshow'} aria-pressed={paused} disabled={reduced} onClick={()=>setPaused(value=>!value)}>{paused||reduced?<Play size={17}/>:<Pause size={17}/>}</button></div><a className="hero-explore" href="#clients"><ArrowDown size={17}/> EXPLORE</a></div>
    <a className="slide-caption" href={heroSlides[active].href}><span>IN THE FRAME / {String(active+1).padStart(2,'0')}</span><strong>{heroSlides[active].title}</strong><span>{heroSlides[active].subtitle} <ArrowUpRight size={17}/></span></a>
  </section>;
}
export function ClientMarquee(){
  const [paused,setPaused]=useState(false);
  const viewport=useRef(null),drag=useRef(null);
  const pointerDown=e=>{if(e.pointerType==='mouse'){drag.current={x:e.clientX,scroll:viewport.current.scrollLeft};e.currentTarget.setPointerCapture(e.pointerId);}setPaused(true);};
  return <section id="clients" className={'client-strip '+(paused?'is-paused':'')} aria-label="Clients and partners"><div className="client-strip-heading"><span className="eyebrow">CLIENTS & PARTNERS</span><button className="icon-button" aria-label={paused?'Resume client logos':'Pause client logos'} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div><div ref={viewport} className="client-viewport" tabIndex={0} role="region" aria-label="Client logos, scroll to explore" onPointerDown={pointerDown} onPointerMove={e=>{if(drag.current)viewport.current.scrollLeft=drag.current.scroll-(e.clientX-drag.current.x);}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><div className="client-track">{[0,1].map(copy=><div className="client-group" key={copy} aria-hidden={copy===1?true:undefined}>{clientLogos.map(client=><div className="client-logo" key={client.name}><img src={client.src} alt={copy===1?'':client.name} loading="lazy" width="180" height="90" draggable="false"/></div>)}</div>)}</div></div></section>;
}
export function ImpactStats(){
  const root=useRef(null),hasPlayed=useRef(false),reduced=useReducedMotion();
  const [progress,setProgress]=useState(1),visible=useVisible(root,.3);
  useEffect(()=>{if(!visible||reduced||hasPlayed.current)return;hasPlayed.current=true;let frame,start;const animate=now=>{if(start===undefined)start=now;const t=Math.min(1,(now-start)/1800);setProgress(1-Math.pow(1-t,3));if(t<1)frame=requestAnimationFrame(animate);};frame=requestAnimationFrame(animate);return()=>{cancelAnimationFrame(frame);setProgress(1);};},[visible,reduced]);
  return <section ref={root} className="impact-stats" aria-label="TM Concepts in numbers">{homeStats.map(stat=><div className="impact-stat" key={stat.label}><span className="sr-only">{stat.value}{stat.suffix} {stat.label}</span><strong aria-hidden="true">{Math.round(stat.value*progress)}<span>{stat.suffix}</span></strong><p aria-hidden="true">{stat.label}</p></div>)}</section>;
}
export function VisionStatement(){
  const root=useRef(null);
  useEffect(()=>{const nodes=root.current.querySelectorAll('.vision-line');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.8,rootMargin:'0px 0px -8% 0px'});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect();},[]);
  return <section ref={root} className="vision-section section-padding"><StageLightAmbient/><Watermark>TM CONCEPTS</Watermark><SectionLabel number="01">OUR VISION</SectionLabel><h2><span className="vision-line">PROVIDING</span><span className="vision-line">UNFORGETTABLE</span><span className="vision-line">EVENT EXPERIENCES</span><span className="vision-line">ACROSS AFRICA.</span></h2><div className="vision-bottom"><p>Creative thinking. Technical precision.<br/>One team, from the idea to the event.</p><a className="text-link" href="/about">THIS IS TM CONCEPTS <ArrowUpRight size={19}/></a></div></section>;
}
export function BuildYourEvent({startProject}){
  return <section className="build-event section-padding"><Watermark>SEE IT FIRST</Watermark><SectionLabel number="03">BUILD YOUR EVENT</SectionLabel><div className="section-intro"><h2>BUILD YOUR EVENT.<br/><span>SEE THE POSSIBILITIES.</span></h2><p>See the space before we build it. TM Concepts can translate your venue, brief and event requirements into layouts, 3D impressions and walkthroughs before production begins.</p></div><BeforeAfterSlider/><div className="build-actions"><button className="button white" onClick={startProject}>START YOUR EVENT DESIGN <ArrowUpRight size={19}/></button><a className="text-link" href="/services/event-design-3d-visualisation">EXPLORE 3D VISUALISATION <ArrowUpRight size={19}/></a></div></section>;
}
export function FeaturedWork(){
  return <section className="featured-work section-padding light"><SectionLabel number="04">SELECTED WORK</SectionLabel><div className="section-intro"><h2>REAL WORK.<br/>REAL EXPERIENCES.</h2><div><p>Real setups. Real events.<br/>The details that bring it together.</p><a className="text-link" href="/work">VIEW ALL PROJECTS <ArrowUpRight size={19}/></a></div></div><div className="featured-projects">{projects.slice(0,3).map(project=><ProjectCard key={project.slug} project={project}/>)}</div></section>;
}
export function ProductionCapabilities(){
 return <section className="production-section section-padding"><Watermark>TM 360</Watermark><div className="production-intro"><SectionLabel number="05">PRODUCTION CAPABILITIES</SectionLabel><h2>EVERY ELEMENT.<br/>ONE COMPLETE<br/><span>EXPERIENCE.</span></h2><p>From the first microphone to the final light cue. The equipment, people and planning behind your event.</p><a className="button white" href="/rentals">EXPLORE RENTALS <ArrowUpRight size={19}/></a></div><div className="production-list">{productionLinks.map(([description,title,slug],i)=><a key={slug} href={'/services/'+slug}><span className="production-index">0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={25}/></a>)}</div></section>;
}
export function WhyTM(){
 return <section className="why-section section-padding light"><div className="why-intro"><SectionLabel number="06">WHY TM CONCEPTS</SectionLabel><h2>WE DESIGN<br/>THE EXPERIENCE.<br/><span>BEFORE WE BUILD IT.</span></h2><p className="home-company-intro">{aboutCompany.introduction}</p><a className="text-link" href="/about">MEET YOUR PRODUCTION PARTNER <ArrowUpRight size={19}/></a></div><div className="why-list">{whyTM.map((item,i)=><article key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div><div className="about-home-images"><figure><Photo photo="stage" sizes="(max-width:700px) 100vw, 60vw"/><figcaption>THE COMPLETE EVENT ENVIRONMENT</figcaption></figure><figure><Photo photo="awards" sizes="(max-width:700px) 100vw, 40vw"/><figcaption>THE LIVE MOMENT / ROTARY INSTALLATION</figcaption></figure></div></section>;
}
export default function PolishedHome({startProject}){
 return <><HeroSlider startProject={startProject}/><ClientMarquee/><ImpactStats/><VisionStatement/><section className="services-section homepage-services section-padding light"><SectionLabel number="02">OUR SERVICES</SectionLabel><div className="section-intro"><h2>DESIGN. BUILD.<br/>POWER. DELIVER.</h2><p>Creative ideas meet technical expertise.<br/>Every part of your production, considered.</p></div><ServiceGrid items={servicePages.slice(0,11)}/><a className="button dark section-end-link" href="/services">EXPLORE ALL SERVICES <ArrowUpRight size={19}/></a></section><BuildYourEvent startProject={startProject}/><FeaturedWork/><ProductionCapabilities/><WhyTM/><CTASection startProject={startProject}/></>;
}
