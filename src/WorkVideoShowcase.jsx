import {useEffect,useId,useRef,useState} from 'react';
import {ArrowUpRight,Pause,Play,VolumeX,X} from 'lucide-react';
import {SectionLabel,Watermark} from './components';
import {featuredWorkVideos,workVideos} from './workVideos';
import './work-videos.css';

function useViewportPreviews(root,items){
  const [near,setNear]=useState(()=>new Set());
  const [candidate,setCandidate]=useState(null);
  const [canPreview,setCanPreview]=useState(false);
  const [hidden,setHidden]=useState(false);
  useEffect(()=>{
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const connection=navigator.connection;
    const preference=()=>setCanPreview(!motion.matches&&!connection?.saveData);
    const visibility=()=>setHidden(document.hidden);
    preference();visibility();
    motion.addEventListener('change',preference);
    connection?.addEventListener?.('change',preference);
    document.addEventListener('visibilitychange',visibility);
    return()=>{motion.removeEventListener('change',preference);connection?.removeEventListener?.('change',preference);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{
    const cards=[...root.current.querySelectorAll('[data-work-video]')];
    const ratios=new Map();
    const nearby=new IntersectionObserver(entries=>setNear(previous=>{
      const next=new Set(previous);
      entries.forEach(entry=>{const id=entry.target.dataset.workVideo;entry.isIntersecting?next.add(id):next.delete(id);});
      return next.size===previous.size&&[...next].every(id=>previous.has(id))?previous:next;
    }),{rootMargin:'350px 0px'});
    const visible=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const id=entry.target.dataset.workVideo;
        if(entry.isIntersecting)entry.target.classList.add('revealed');
        if(entry.isIntersecting&&entry.intersectionRatio>=.5)ratios.set(id,entry.intersectionRatio);else ratios.delete(id);
      });
      const ranked=[...ratios].sort((a,b)=>b[1]-a[1]);
      setCandidate(previous=>ratios.has(previous)&&ratios.get(previous)>=(ranked[0]?.[1]||0)-.05?previous:ranked[0]?.[0]||null);
    },{threshold:[0,.25,.5,.75,1]});
    cards.forEach(card=>{nearby.observe(card);visible.observe(card);});
    return()=>{nearby.disconnect();visible.disconnect();};
  },[root,items]);
  return {near,candidate,canPreview,hidden};
}

const durationLabel=seconds=>Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0');
function VideoCard({item,near,active,canPreview,onOpen}){
  const player=useRef(null);
  const [playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
  const load=near&&canPreview&&!failed;
  useEffect(()=>{
    const video=player.current;
    if(!load){video.pause();video.removeAttribute('src');video.load();return;}
    if(active){
      video.closest('.work-video-showcase').querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();});
      video.muted=true;
      video.play().catch(()=>{});
    }else video.pause();
    return()=>video.pause();
  },[load,active]);
  return <article className={'work-video-item is-'+item.orientation} data-work-video={item.id}>
    <button className={'work-video-card '+(playing?'is-playing':'')} type="button" aria-label={'Play '+item.title+' — TM Concepts event video'} aria-haspopup="dialog" onClick={e=>onOpen(item,e.currentTarget)}>
      <span className="motion-fallback" aria-hidden="true">TM<span>CONCEPTS</span></span>
      <img className="work-video-poster" src={item.poster} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" onError={e=>{e.currentTarget.style.visibility='hidden';}}/>
      <video className="work-video-preview" ref={player} src={load?item.src:undefined} muted playsInline loop preload="metadata" aria-hidden="true" tabIndex={-1} width={item.width} height={item.height} onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>
      <span className="work-video-shade" aria-hidden="true"/>
      <span className="work-video-category">{item.category}</span>
      <span className="work-video-play" aria-hidden="true"><Play size={26} fill="currentColor"/></span>
      <span className="work-video-duration" aria-hidden="true">{durationLabel(item.duration)}</span>
      {playing&&<span className="work-video-muted" aria-hidden="true"><VolumeX size={15}/> PREVIEW</span>}
    </button>
    <div className="work-video-caption"><h3>{item.title}</h3><span aria-hidden="true">WATCH FILM <ArrowUpRight size={17}/></span></div>
    <p className="sr-only">{item.description}</p>
  </article>;
}

function VideoLightbox({item,onClose}){
  const dialog=useRef(null),player=useRef(null);
  const titleId=useId(),descriptionId=useId();
  const [failed,setFailed]=useState(false);
  useEffect(()=>{
    const modal=dialog.current,video=player.current;
    if(item){setFailed(false);if(!modal.open)modal.showModal();video.muted=true;video.play().catch(()=>{});}
    else if(modal.open)modal.close();
    return()=>{video?.pause();};
  },[item]);
  useEffect(()=>{
    const pause=()=>{if(document.hidden)player.current?.pause();};
    document.addEventListener('visibilitychange',pause);
    return()=>document.removeEventListener('visibilitychange',pause);
  },[]);
  const close=()=>dialog.current.close();
  return <dialog ref={dialog} className="work-video-lightbox" aria-labelledby={titleId} aria-describedby={descriptionId} onClose={()=>{player.current?.pause();onClose();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    {item&&<><div className="video-viewer-heading"><div><span className="eyebrow">{item.category}</span><h2 id={titleId}>{item.title}</h2></div><button type="button" className="icon-button video-viewer-close" aria-label="Close video" autoFocus onClick={close}><X size={24}/></button></div>
    <div className="video-viewer-stage" onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <video key={item.id} ref={player} className={'video-viewer-player is-'+item.orientation} src={item.src} poster={item.poster} width={item.width} height={item.height} controls muted playsInline loop preload="metadata" aria-label={item.title} onError={()=>setFailed(true)}/>
      {failed&&<div className="video-viewer-error" role="alert"><p>This film couldn’t load.</p><button className="text-button" onClick={()=>{setFailed(false);player.current.load();player.current.play().catch(()=>{});}}>TRY AGAIN <Play size={17}/></button><a className="text-link" href={item.src} target="_blank" rel="noreferrer">OPEN VIDEO <ArrowUpRight size={17}/></a></div>}
    </div><p className="video-viewer-description" id={descriptionId}>{item.description}</p></>}
  </dialog>;
}

export default function WorkVideoShowcase({page='home'}){
  const root=useRef(null),opener=useRef(null);
  const items=page==='home'?featuredWorkVideos:workVideos;
  const [selected,setSelected]=useState(null),[paused,setPaused]=useState(false);
  const {near,candidate,canPreview,hidden}=useViewportPreviews(root,items);
  const active=canPreview&&!hidden&&!paused&&!selected?candidate:null;
  const headingId=useId();
  const open=(item,button)=>{root.current.querySelectorAll('video').forEach(video=>video.pause());opener.current=button;setSelected(item);};
  const close=()=>{setSelected(null);opener.current?.focus({preventScroll:true});};
  return <section ref={root} id={page==='work'?'event-reels':undefined} className="work-video-showcase section-padding" aria-labelledby={headingId}>
    <Watermark>TM IN MOTION</Watermark>
    <SectionLabel>{page==='home'?'TM IN MOTION':'FILMS / EVENT REELS'}</SectionLabel>
    <div className="section-intro"><h2 id={headingId}>SEE THE EXPERIENCE<br/>IN ACTION.</h2><p>From setup to showtime, explore real moments from TM Concepts productions, installations and live events.</p></div>
    <div className="work-video-toolbar"><span className="eyebrow">REAL MOMENTS / TM CONCEPTS</span>{canPreview&&<button className="text-button" onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?<Play size={16}/>:<Pause size={16}/>} {paused?'PLAY PREVIEWS':'PAUSE PREVIEWS'}</button>}</div>
    <div className="work-video-grid">{items.map(item=><VideoCard key={item.id} item={item} near={near.has(item.id)} active={active===item.id} canPreview={canPreview} onOpen={open}/>)}</div>
    {page==='home'&&<a className="text-link work-video-more" href="/work#event-reels">EXPLORE ALL EVENT REELS <ArrowUpRight size={19}/></a>}
    <VideoLightbox item={selected} onClose={close}/>
  </section>;
}