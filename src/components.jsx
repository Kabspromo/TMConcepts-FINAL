import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, ChevronDown, Menu, X, MapPin, MoveHorizontal, Pause, Play, Check, Download } from 'lucide-react';
import StageLightAmbient from './StageLightAmbient';
import { media, slotMedia, servicePages, projects, processSteps, conceptPair, PHONE, WHATSAPP, ADDRESS } from './content';

export function Logo() {
  return <a href="/" className="brand" aria-label="TM Concepts home"><img src="/images/brand/tm-logo.webp" alt="TM Concepts — Toxic With Events" width="310" height="145"/></a>;
}
export function SectionLabel({ children, number }) {
  return <div className="section-label"><span><i aria-hidden="true"/>{children}</span>{number && <span className="section-number">{number} / TM</span>}</div>;
}
export function Watermark({ children = 'TM 360' }) {
  return <span className="watermark" aria-hidden="true">{children}</span>;
}
export function Photo({ photo, slot = 'PROJECT IMAGE', className = '', eager = false, sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw', decorative = false }) {
  const configured = photo || slotMedia[slot];
  const item = typeof configured === 'string' ? media[configured] : configured;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [configured]);
  if (!item || failed) return <div className={'photo-placeholder brand-panel '+className} aria-hidden="true"><span className="brand-panel-grid"/><span className="brand-panel-mark">TM</span><span className="brand-panel-signature">CONCEPTS / TOXIC WITH EVENTS</span></div>;
  const src = item.src || '/images/projects/' + item.name + '-1280.webp';
  const srcSet = item.srcSet || (item.name ? [480,800,1280].map(w=>'/images/projects/' + item.name + '-' + w + '.webp ' + Math.min(w,item.width) + 'w').filter((v,i,a)=>a.findIndex(x=>x.split(' ').pop()===v.split(' ').pop())===i).join(', ') : undefined);
  return <img className={'photo ' + className} src={src} srcSet={srcSet} sizes={sizes} width={item.width} height={item.height} alt={decorative ? '' : item.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" style={{objectPosition:item.position}} onError={()=>setFailed(true)}/>;
}
const nav = [['Home','/'],['About','/about'],['Our Work','/work'],['Rentals','/rentals'],['Contact','/contact']];
const groups = ['Design','Production','Technology','Experiences','Support'];
export function Header({ path, startProject }) {
  const [open,setOpen] = useState(false);
  const mobile = useRef(null);
  const servicesMenu = useRef(null);
  useEffect(()=>{setOpen(false); if(servicesMenu.current) servicesMenu.current.open=false;},[path]);
  useEffect(()=>{if(open) mobile.current.showModal(); else mobile.current.close();},[open]);
  useEffect(()=>{
    const close = e => {
      if(e.type==='keydown' && e.key==='Escape' && servicesMenu.current?.open) {servicesMenu.current.open=false;servicesMenu.current.querySelector('summary').focus();}
      else if(e.type==='pointerdown' && !servicesMenu.current?.contains(e.target) && servicesMenu.current) servicesMenu.current.open=false;
    };
    document.addEventListener('keydown',close);document.addEventListener('pointerdown',close);
    return ()=>{document.removeEventListener('keydown',close);document.removeEventListener('pointerdown',close);};
  },[]);
  const navLink = ([label,url]) => <a key={url} href={url} aria-current={path===url?'page':undefined}>{label}</a>;
  return <>
    <header className="site-header"><Logo/><nav className="desktop-nav" aria-label="Main navigation">
      {nav.slice(0,2).map(navLink)}
      <details ref={servicesMenu} className="services-nav"><summary className={path.startsWith('/services')?'current':''}>Services <ChevronDown size={15}/></summary>
        <div className="mega-menu"><div className="mega-intro"><span className="eyebrow">DESIGN / PRODUCTION / TECHNOLOGY</span><a href="/services">Everything behind<br/>the experience. <ArrowUpRight/></a></div><div className="mega-columns">{groups.map(group=><div key={group}><span className="eyebrow">{group}</span>{servicePages.filter(s=>s.group===group).map(s=><a key={s.slug} href={'/services/'+s.slug}>{s.title}<ArrowUpRight size={14}/></a>)}</div>)}</div></div>
      </details>{nav.slice(2).map(navLink)}
    </nav><div className="header-actions"><button className="button header-project" onClick={startProject}>START A PROJECT <ArrowUpRight size={18}/></button><button className="icon-button menu-toggle" aria-label="Open navigation menu" aria-expanded={open} onClick={()=>setOpen(true)}><Menu/></button></div></header>
    <dialog ref={mobile} className="menu-dialog" aria-label="Site navigation" onClose={()=>setOpen(false)}><div className="mobile-menu-top"><Logo/><button className="icon-button" aria-label="Close navigation menu" onClick={()=>setOpen(false)}><X/></button></div><nav aria-label="Mobile navigation">{[...nav.slice(0,2),['Services','/services'],...nav.slice(2)].map(([label,url],i)=><a href={url} key={url} aria-current={path===url?'page':undefined} onClick={()=>setOpen(false)}><span>0{i+1}</span>{label}<ArrowUpRight/></a>)}</nav><details className="mobile-services"><summary>Explore services <ChevronDown size={18}/></summary>{servicePages.map(s=><a href={'/services/'+s.slug} key={s.slug} onClick={()=>setOpen(false)}>{s.title}<ArrowUpRight size={16}/></a>)}</details><button className="button white" onClick={()=>{setOpen(false);startProject();}}>START A PROJECT <ArrowUpRight size={18}/></button><p>Ntinda · Kampala · Uganda<br/><a href={'tel:'+PHONE}>+256 704 282 211</a></p></dialog>
  </>;
}
export function PageHeading({ label, title, description }) {
  return <header className="page-heading section-padding"><Watermark>TM CONCEPTS</Watermark><SectionLabel>{label}</SectionLabel><h1>{title}</h1>{description && <p>{description}</p>}</header>;
}
export function ServiceCard({ service, index = 0 }) {
  return <a className="service-card" href={'/services/'+service.slug}><div className="card-media"><Photo photo={service.photo} slot={service.slot || service.short.toUpperCase()}/><span className="card-index">{String(index+1).padStart(2,'0')}</span><span className="round-arrow"><ArrowUpRight size={23}/></span></div><div className="service-card-copy"><h3>{service.short}</h3><p>{service.summary}</p><span className="text-link">EXPLORE SERVICE <ArrowRight size={17}/></span></div></a>;
}
export function ServiceGrid({ items = servicePages }) {
  return <div className="service-grid">{items.map((s,i)=><ServiceCard key={s.slug} service={s} index={i}/>)}</div>;
}
export function ProjectCard({ project }) {
  return <a href={'/work/'+project.slug} className="project-card"><div className="card-media"><Photo photo={project.images[0]} sizes="(max-width: 700px) 100vw, 75vw"/><span className="project-chip">{project.category} / {project.location}</span><span className="round-arrow"><ArrowUpRight/></span></div><div className="project-caption"><div><span className="eyebrow">{project.subtitle}</span><h3>{project.title}</h3></div><p>{project.services.join(' · ')}</p></div></a>;
}
export function ProjectMarquee() {
  const [paused,setPaused] = useState(false);
  const photos = projects.flatMap(p=>p.images);
  return <section className={'project-marquee '+(paused?'is-paused':'')} aria-label="TM Concepts event photography"><div className="marquee-heading"><span className="eyebrow">ON THE EVENT FLOOR.</span><button className="text-button" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?<Play size={17}/>:<Pause size={17}/>} {paused?'Resume gallery':'Pause gallery'}</button></div>{[photos.slice(0,Math.ceil(photos.length/2)),photos.slice(Math.ceil(photos.length/2))].map((row,i)=><div className={'marquee-viewport row-'+i} key={i} tabIndex={0} role="region" aria-label={'Event photography row '+(i+1)}><div className="marquee-track">{[0,1].map(copy=><div className="marquee-group" key={copy} aria-hidden={copy===1?true:undefined}>{row.map(key=><div className="marquee-photo" key={key}><Photo photo={key} decorative={copy===1} sizes="(max-width:700px) 75vw, 35vw"/></div>)}</div>)}</div></div>)}</section>;
}
export function BeforeAfterSlider() {
  const [position,setPosition] = useState(50);
  const move = e => { const bounds=e.currentTarget.getBoundingClientRect();setPosition(Math.round(Math.max(0,Math.min(100,(e.clientX-bounds.left)/bounds.width*100)))); };
  return <div className="comparison-wrap"><div className="comparison-labels"><span>DESIGN / PRE-VISUALISATION</span><ArrowRight size={20}/><span>FINAL VISUALISATION</span></div><div className="comparison"><div className="comparison-layer"><Photo photo={conceptPair.after} sizes="(max-width:700px) 100vw, 90vw"/></div><div className="comparison-layer comparison-before" style={{clipPath:'inset(0 '+(100-position)+'% 0 0)'}}><Photo photo={conceptPair.before} sizes="(max-width:700px) 100vw, 90vw"/></div><div className="comparison-handle" style={{left:position+'%'}} aria-hidden="true"><span><MoveHorizontal/></span></div><input type="range" min="0" max="100" value={position} onChange={e=>setPosition(Number(e.target.value))} onPointerDown={e=>{e.preventDefault();e.currentTarget.focus({preventScroll:true});e.currentTarget.setPointerCapture(e.pointerId);move(e);}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))move(e);}} onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}} aria-label="Compare event design and final visualisation" aria-valuetext={position+'% design visible'}/></div><div className="comparison-note"><p>One event concept. Two perspectives. Explore the layout, furniture and production before the build.</p><span><MoveHorizontal size={18}/> DRAG TO COMPARE</span></div></div>;
}
export function Process() {
  const [active,setActive] = useState(0);
  return <section className="process-section section-padding"><SectionLabel number="04">THE WAY WE WORK</SectionLabel><div className="section-intro"><h2>FROM EMPTY SPACE<br/>TO EXPERIENCE.</h2><p>One process connects the idea, the technical plan and the event.</p></div><div className="process-tabs" role="tablist" aria-label="Our production process">{processSteps.map((s,i)=><button key={s.title} id={'process-tab-'+i} type="button" role="tab" aria-selected={active===i} aria-controls="process-panel" tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?4:(active+(e.key==='ArrowRight'?1:4))%5;setActive(next);document.getElementById('process-tab-'+next)?.focus();}}}><span>0{i+1}</span>{s.title}<ArrowUpRight size={19}/></button>)}</div><div className="process-panel" id="process-panel" role="tabpanel" aria-labelledby={'process-tab-'+active}><span className="process-number" aria-hidden="true">0{active+1}</span><div><h3>{processSteps[active].line}</h3><p>{processSteps[active].detail}</p></div></div></section>;
}
export function CTASection({ startProject }) {
  return <section className="cta-section section-padding"><StageLightAmbient/><Watermark>TOXIC WITH EVENTS</Watermark><SectionLabel>YOUR NEXT EVENT STARTS HERE</SectionLabel><div className="cta-content"><h2><span className="cta-prompt">HAVE A SPACE?</span>LET’S TURN IT INTO<br/>AN EXPERIENCE.</h2><div><p>Start with a venue, an idea or an event brief. We’ll help shape the concept and production.</p><button className="button white" onClick={startProject}>START A PROJECT <ArrowUpRight size={20}/></button><a className="text-link" href={WHATSAPP} target="_blank" rel="noreferrer">WHATSAPP US <ArrowUpRight size={18}/></a></div></div></section>;
}
export function Footer() {
  return <footer className="footer"><div className="footer-main"><div><Logo/><p className="tagline">Toxic With Events</p></div><div><span className="eyebrow">BUILT IN KAMPALA.</span><p>Design. Production. Technology.<br/>Ready for the show.</p></div><div><span className="eyebrow">FIND US</span><address>Semawata Road, Ntinda<br/>Kampala, Uganda</address><a href={'tel:'+PHONE}>+256 704 282 211 <ArrowUpRight size={16}/></a></div><nav aria-label="Footer navigation"><a href="/services">Services</a><a href="/work">Our Work</a><a href="/rentals">Rentals</a><a href="/contact">Contact</a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} TM CONCEPTS</span><span>KAMPALA / UGANDA</span><a href={WHATSAPP} target="_blank" rel="noreferrer">LET’S TALK <ArrowUpRight size={16}/></a></div></footer>;
}
export function WhatsAppButton() {
  return <a className="whatsapp-float" href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Chat with TM Concepts on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.9 11.9 0 0 0 1.8 17.8L.2 23.7l6-1.6A11.9 11.9 0 0 0 20.5 3.5ZM12 21.1a9.7 9.7 0 0 1-5-1.4l-.4-.2-3.6.9 1-3.5-.3-.4A9.8 9.8 0 1 1 12 21.1Zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2l-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 0 1-3.9-3.4c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.6l-.9-2.1c-.2-.5-.4-.4-.6-.4H8c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.1.2 2 3.2 5 4.5 1.9.8 2.7.9 3.7.7.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3Z"/></svg><span>WhatsApp</span></a>;
}
export function CompanyProfileLink() {
  const [status,setStatus]=useState('');
  const download=async()=>{
    setStatus('Preparing profile…');
    try {
      const {jsPDF}=await import('jspdf');
      const pdf=new jsPDF({unit:'pt',format:'a4'});
      pdf.setFont('helvetica','bold');pdf.setFontSize(28);pdf.text('TM CONCEPTS',48,65);
      pdf.setFontSize(13);pdf.text('Toxic With Events',48,92);let y=140;
      for(const [heading,body] of [
        ['THE COMPANY','TM Concepts brings event design, technical production, AV, sound, lighting, LED, power, branding and rentals together in Kampala, Uganda.'],
        ['OUR PROCESS',processSteps.map(s=>s.title).join(' / ')],
        ['SERVICES',servicePages.map(s=>s.title).join(' / ')],
        ['LEADERSHIP','Tenywa Musa, Chief Executive Officer'],
        ['CONTACT',ADDRESS+' | +256 704 282 211 | www.tmconceptz.com'],
      ]) {pdf.setFontSize(12);pdf.setFont('helvetica','bold');pdf.text(heading,48,y);y+=24;pdf.setFont('helvetica','normal');const lines=pdf.splitTextToSize(body,490);pdf.text(lines,48,y,{lineHeightFactor:1.5});y+=lines.length*18+28;}
      pdf.save('tm-concepts-company-profile.pdf');setStatus('Profile downloaded.');
    } catch {setStatus('The download could not be prepared. Please try again.');}
  };
  return <div className="profile-download"><button className="text-button" onClick={download}><Download size={18}/> COMPANY PROFILE PDF <ArrowUpRight size={17}/></button><span role="status">{status}</span></div>;
}
