import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Pause, Play } from 'lucide-react';
import { clientShowcase, impact, homepageServices, media, workVideos } from './homeContent';
import { projects, WHATSAPP } from './data';

function Label({ children, right }) {
  return <div className="section-label"><span><i/>{children}</span>{right&&<span className="demo-label">{right}</span>}</div>;
}

export function HeroFilm() {
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = videoRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = true;
    const update = () => {
      if (!inView || document.hidden || userPaused.current || motion.matches || navigator.connection?.saveData) element.pause();
      else element.play().catch(() => {});
    };
    update();
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); });
    observer.observe(element.closest('.hero'));
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); element.pause(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <>
    <div className="hero-backdrop hero-film-backdrop">
      <img src={media.hero.poster} alt="A concert stage filled with light above an audience" fetchPriority="high"/>
      <video ref={videoRef} className={playing?'is-playing':''} src={media.hero.src} muted loop playsInline preload="none" aria-hidden="true" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setFailed(true);setPlaying(false);}}/>
    </div>
    {!failed&&<button className="hero-film-toggle" onClick={()=>{const video=videoRef.current;if(video.paused){userPaused.current=false;video.play().catch(()=>setFailed(true));}else{userPaused.current=true;video.pause();}}} aria-label={playing?'Pause background video':'Play background video'}>{playing?<Pause size={12}/>:<Play size={12}/>}<span>{playing?'PAUSE FILM':'PLAY FILM'}</span></button>}
  </>;
}

function ClientLogo({ client }) {
  return <div className="client-logo"><img src={client.logo} alt={`${client.name} logo`} loading="lazy"/></div>;
}

export function ClientMarquee() {
  const [paused,setPaused]=useState(false);
  return <section className="clients-section" aria-labelledby="clients-heading">
    <div className="clients-heading"><div><span className="eyebrow" id="clients-heading">OUR CLIENTS & COLLABORATORS</span><p>Great experiences start with great company.</p></div>{clientShowcase.clients.length>1&&<div className="clients-controls"><button className="marquee-toggle icon-button" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Resume client logos':'Pause client logos'} aria-pressed={paused}>{paused?<Play size={14}/>:<Pause size={14}/>}</button></div>}</div>
    {clientShowcase.clients.length>0?<div className={`client-marquee ${paused?'is-paused':''}`} tabIndex={0} role="region" aria-label="Client logos"><div className="client-track">
      {[0,1].map(copy=><div className="client-set" key={copy} aria-hidden={copy===1?true:undefined}>{clientShowcase.clients.map(client=><ClientLogo key={client.name} client={client}/>)}</div>)}
    </div></div>:<div className="client-marquee client-marquee-empty" aria-hidden="true"/>}
  </section>;
}

function Counter({ stat, visible }) {
  const [count,setCount]=useState(0);
  useEffect(()=>{
    if(!visible)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setCount(stat.value);return;}
    let frame;
    const start=performance.now();
    const tick=(now)=>{const progress=Math.min((now-start)/1500,1);setCount(Math.round(stat.value*(1-Math.pow(1-progress,3))));if(progress<1)frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[visible,stat.value]);
  return <div className="impact-stat"><div className="counter-value" aria-hidden="true"><span>{count.toLocaleString()}</span><sup>{stat.suffix}</sup></div><span className="sr-only">{stat.value}{stat.suffix}</span><h3>{stat.label}</h3><p>{stat.detail}</p></div>;
}

export function ImpactCounters() {
  const ref=useRef(null); const [visible,setVisible]=useState(false);
  useEffect(()=>{if(!ref.current||!impact.stats.length)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{threshold:.25});observer.observe(ref.current);return()=>observer.disconnect();},[]);
  if(!impact.stats.length)return null;
  return <section className="impact-section" ref={ref} aria-label="TM Concepts in numbers"><Label>THE EXPERIENCE IN NUMBERS</Label><div className="impact-grid">{impact.stats.map(stat=><Counter key={stat.label} stat={stat} visible={visible}/>)}</div></section>;
}

export function ServicesBrief() {
  return <section className="services-brief section-padding" aria-labelledby="services-brief-heading"><Label>WHAT WE DO</Label><div className="section-intro"><h2 id="services-brief-heading">YOUR VISION.<br/><span className="muted">OUR COMPLETE TOOLKIT.</span></h2><div><p>From the first sketch to the final spotlight.<br/>One creative and technical partner.</p><a className="text-button" href="#/services">ALL OUR SERVICES <ArrowUpRight size={17}/></a></div></div><div className="brief-service-grid">{homepageServices.map((service,i)=><a className="brief-service-card" href={service.href} key={service.title}><div className="brief-service-image"><img src={`/images/${service.image}`} alt={service.alt} loading="lazy"/><span>0{i+1}</span><span className="service-link-arrow"><ArrowUpRight size={20}/></span></div><span className="eyebrow">{service.tags}</span><h3>{service.title}</h3><p>{service.description}</p><span className="brief-service-link">EXPLORE <ArrowRight size={14}/></span></a>)}</div></section>;
}

export function FeaturedEvents() {
  const featured=['after-dark','corporate-summit','wedding-reception'].map(slug=>projects.find(p=>p.slug===slug)).filter(Boolean);
  return <section className="featured-events section-padding" id="work" aria-labelledby="featured-heading"><Label>FEATURED EVENTS</Label><div className="section-intro"><h2 id="featured-heading">DIFFERENT STAGES.<br/><span className="muted">THE SAME AMBITION.</span></h2><div><p>Electric nights. Powerful conversations.<br/>Celebrations that stay with you.</p><a href="#/work" className="text-button">VIEW ALL EXPERIENCES <ArrowUpRight size={17}/></a></div></div><div className="featured-grid">{featured.map((project,i)=><a href={`#/work/${project.slug}`} className="featured-event" key={project.slug}><div className="featured-event-image"><img src={`/images/${project.image}`} alt={project.description} loading="lazy"/><span className="project-chip">{project.type}</span><span className="featured-index">0{i+1}</span><span className="round-arrow"><ArrowUpRight size={21}/></span></div><div className="featured-event-copy"><h3>{project.title}</h3><p>{project.services}</p><span>{project.description}</span></div></a>)}</div><p className="subtle-note">Featured event concepts with stock photography. Original event stories and images will replace these preview examples.</p></section>;
}

export function ExperienceFilm({ source = media.showreel, design = false }) {
  const ref=useRef(null); const [playing,setPlaying]=useState(false); const [error,setError]=useState(false);
  const play=()=>ref.current.play().catch(()=>setError(true));
  return <section className="experience-film section-padding" aria-labelledby={design?'design-film-heading':'film-heading'}><Label>{design?'DESIGN IN MOTION':'FEEL THE ATMOSPHERE'} <span className="film-hd">FULL HD</span></Label><div className="section-intro"><h2 id={design?'design-film-heading':'film-heading'}>{design?<>DESIGN COMES TO LIFE.<br/><span className="muted">BEFORE SHOWTIME.</span></>:<>SOME THINGS<br/><span className="muted">HAVE TO BE FELT.</span></>}</h2><p>{design?'See an event vision move from concept into a live experience.':<>Light. Sound. Energy.<br/>A glimpse of the experiences we build for.</>}</p></div><div className={`experience-film-player ${playing?'is-playing':''}`}><video ref={ref} src={source.src} poster={source.poster} controls={playing} muted playsInline preload="none" aria-label={design?'TM Concepts design video':'Illustrative event showreel'} onPlay={()=>{setPlaying(true);setError(false);}} onEnded={()=>setPlaying(false)} onError={()=>setError(true)}/>{!playing&&<button className="film-play-overlay" onClick={play} aria-label={design?'Play Design page video':'Play event showreel'}><span className="film-play-circle"><Play size={31} fill="currentColor"/></span><span>PLAY THE EXPERIENCE <ArrowUpRight size={15}/></span></button>}{error&&<p className="video-error" role="status">This video could not play. <a href={source.src}>Open the video directly</a>.</p>}<span className="film-corner-label" aria-hidden="true">TM / IN MOTION</span></div><div className="film-caption"><span>{design?'TM CONCEPTS / DESIGN FILM':'STOCK FOOTAGE / PREVIEW SHOWREEL'}</span><span>YOUR VISION. BROUGHT TO LIFE.</span></div></section>;
}

export function VideoShowcase({ heading = 'TM IN MOTION', intro = 'From setup to showtime, explore real moments from TM Concepts productions, installations and live events.' }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const shouldAutoplay = () => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    return !reduceMotion && !saveData;
  };

  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setActiveVideo(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeVideo]);

  return <section className="video-showcase" aria-labelledby="video-showcase-heading">
    <div className="section-label"><span><i/>{'TM IN MOTION'}</span></div>
    <div className="section-intro video-intro"><h2 id="video-showcase-heading">SEE THE EXPERIENCE<br/><span className="muted">IN ACTION.</span></h2><div><p>{intro}</p></div></div>
    <div className="video-grid">{workVideos.slice(0, 6).map((video, index) => <VideoCard key={video.id} video={video} index={index} onOpen={setActiveVideo} canAutoplay={shouldAutoplay()}/>)}</div>
    {activeVideo && <div className="video-lightbox" role="dialog" aria-modal="true" aria-label={activeVideo.title} onClick={() => setActiveVideo(null)}><div className="video-lightbox-panel" onClick={(event) => event.stopPropagation()}><button type="button" className="video-close" onClick={() => setActiveVideo(null)} aria-label="Close video">×</button><video controls playsInline autoPlay muted src={activeVideo.src} aria-label={activeVideo.title}/></div></div>}
  </section>;
}

function VideoCard({ video, index, onOpen, canAutoplay }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting && canAutoplay) {
        element.muted = true;
        element.play().catch(() => {});
      } else {
        element.pause();
      }
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [canAutoplay]);

  return <button type="button" className={`video-card ${video.orientation}`} onClick={() => onOpen(video)} aria-label={`Play ${video.title}`} style={{'--video-index': index}}>
    <video ref={ref} muted playsInline loop preload="metadata" onLoadedData={() => setReady(true)} src={video.src} aria-hidden="true"/>
    {!ready && <span className="video-fallback" aria-hidden="true"><span className="video-fallback-mark">TM</span></span>}
    <span className="video-overlay"><span className="video-category">{video.category}</span><span className="video-play"><Play size={18} fill="currentColor"/></span></span>
  </button>;
}

export function DesignFilm() {
  return <ExperienceFilm source={media.design} design/>;
}

export function WhatsAppButton() {
  return <a className="whatsapp-float" href={`${WHATSAPP}?text=${encodeURIComponent('Hello TM Concepts! I would like to discuss an event.')}`} target="_blank" rel="noreferrer" aria-label="Chat with TM Concepts on WhatsApp"><span className="whatsapp-tooltip">Let’s talk about your event</span><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .8A15.1 15.1 0 0 0 3 23.7L.8 31.2l7.7-2A15.1 15.1 0 1 0 16 .8Zm0 27.7a12.5 12.5 0 0 1-6.4-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5A12.6 12.6 0 1 1 16 28.5Zm6.9-9.4c-.4-.2-2.2-1.1-2.5-1.2-.4-.1-.6-.2-.9.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.1-2.1-2.5-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.2 0-.5 0-.7l-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.4 5.5.9.3 1.6.6 2.2.7.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5Z"/></svg><span className="sr-only">WhatsApp</span></a>;
}

