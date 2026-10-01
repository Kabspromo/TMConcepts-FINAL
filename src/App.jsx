import { useEffect, useRef, useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { normalisePath } from './content';
import { updateSEO } from './seo';
import { Header, Footer, WhatsAppButton } from './components';
import { Home, ServicesPage, ServicePage, WorkPage, ProjectPage, AboutPage, RentalsPage, ContactPage, NotFound } from './pages';
import ProjectBuilder from './ProjectBuilder';

const browserPath=()=>normalisePath(window.location.hash.startsWith('#/')?window.location.hash.slice(1):window.location.pathname);
export default function App({ initialPath }) {
  const [path,setPath]=useState(()=>normalisePath(initialPath||browserPath()));
  const [selectedItems,setSelectedItems]=useState([]);
  const [toast,setToast]=useState('');
  const projectRef=useRef(null);const toastTimer=useRef(null);const progressRef=useRef(null);const previousPath=useRef(path);
  useEffect(()=>{
    const update=()=>{const next=browserPath();if(window.location.hash.startsWith('#/')||normalisePath(window.location.pathname)!==window.location.pathname.replace(/\/$/,'')&&window.location.pathname!=='/')history.replaceState(null,'',next);setPath(next);};
    update();
    const navigate=e=>{
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const a=e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;
      const url=new URL(a.href,window.location.href);if(url.origin!==window.location.origin||!['http:','https:'].includes(url.protocol)||url.hash&&!url.hash.startsWith('#/'))return;
      e.preventDefault();document.querySelectorAll('details[open]').forEach(el=>el.open=false);
      const next=normalisePath(url.hash.startsWith('#/')?url.hash.slice(1):url.pathname);
      if(window.location.pathname!==next)history.pushState(null,'',next);
      setPath(next);window.scrollTo({top:0,behavior:'instant'});
    };
    const hashUpdate=()=>{if(window.location.hash.startsWith('#/'))update();};
    document.addEventListener('click',navigate);window.addEventListener('popstate',update);window.addEventListener('hashchange',hashUpdate);
    return()=>{document.removeEventListener('click',navigate);window.removeEventListener('popstate',update);window.removeEventListener('hashchange',hashUpdate);};
  },[]);
  useEffect(()=>{
    updateSEO(path);
    if(previousPath.current!==path){document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('main')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});previousPath.current=path;}
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.section-intro,.intro-grid,.service-card,.experience-card').forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[path]);
  useEffect(()=>{
    let frame;
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-window.innerHeight;if(progressRef.current)progressRef.current.style.transform='scaleX('+(max>0?window.scrollY/max:0)+')';});};
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
    return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);cancelAnimationFrame(frame);clearTimeout(toastTimer.current);};
  },[]);
  const startProject=()=>projectRef.current?.showModal();
  const addItem=item=>{
    setSelectedItems(prev=>prev.some(x=>x.name===item.name)?prev.map(x=>x.name===item.name?{...x,quantity:Math.min(999,x.quantity+1)}:x):[...prev,{name:item.name,quantity:1}]);
    setToast(item.name+' added to your brief');clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),4200);
  };
  let page;
  const common={startProject};
  if(path==='/')page=<Home {...common}/>;
  else if(path==='/about')page=<AboutPage {...common}/>;
  else if(path==='/services')page=<ServicesPage {...common}/>;
  else if(path.startsWith('/services/'))page=<ServicePage key={path} slug={path.slice(10)} {...common}/>;
  else if(path==='/work')page=<WorkPage {...common}/>;
  else if(path.startsWith('/work/'))page=<ProjectPage slug={path.slice(6)} {...common}/>;
  else if(path==='/rentals')page=<RentalsPage {...common} selectedItems={selectedItems} addItem={addItem}/>;
  else if(path==='/contact')page=<ContactPage selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>;
  else page=<NotFound/>;
  return <><a className="skip-link" href="#main" onClick={()=>document.getElementById('main')?.focus()}>Skip to content</a><Header path={path} startProject={startProject}/><div className="scroll-progress" ref={progressRef} aria-hidden="true"/><main id="main" tabIndex={-1}>{page}</main><Footer/><WhatsAppButton/><ProjectBuilder dialogRef={projectRef} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/><div className={'toast '+(toast?'visible':'')} role="status">{toast&&<><Check size={18}/><span>{toast}</span><button onClick={startProject}>View brief <ArrowUpRight size={16}/></button></>}</div></>;
}
