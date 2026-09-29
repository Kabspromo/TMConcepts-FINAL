import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function SiteEntrance({ children }) {
  const [phase, setPhase] = useState('loading');
  const [logoFailed, setLogoFailed] = useState(false);
  const siteRef = useRef(null);
  const skipRef = useRef(null);
  const complete = phase === 'done';

  useEffect(() => {
    let started = false;
    let disposed = false;
    const timers = [];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const image = new Image();
    const later = (fn, delay) => timers.push(window.setTimeout(fn, delay));
    const finish = () => {
      started = true;
      timers.forEach(window.clearTimeout);
      setPhase('done');
    };
    const begin = () => {
      if (started || disposed) return;
      started = true;
      if (motion.matches) {
        setPhase('reduced');
        later(finish, 800);
      } else {
        setPhase('brand');
        later(() => setPhase('slogan'), 1750);
        later(() => setPhase('leaving'), 3000);
        later(finish, 3700);
      }
    };
    const escape = event => { if (event.key === 'Escape') finish(); };
    const preferenceChanged = () => { if (motion.matches) finish(); };
    const skip = skipRef.current;
    skip?.addEventListener('click', finish);
    skip?.focus({ preventScroll: true });
    document.addEventListener('keydown', escape);
    motion.addEventListener('change', preferenceChanged);
    image.onload = begin;
    image.onerror = () => { setLogoFailed(true); begin(); };
    image.src = '/images/tm-logo.png';
    if (image.complete) {
      if (!image.naturalWidth) setLogoFailed(true);
      begin();
    }
    // A slow or missing logo must never prevent someone entering the website.
    later(finish, 6000);
    return () => {
      disposed = true;
      timers.forEach(window.clearTimeout);
      image.onload = null;
      image.onerror = null;
      skip?.removeEventListener('click', finish);
      document.removeEventListener('keydown', escape);
      motion.removeEventListener('change', preferenceChanged);
    };
  }, []);

  useEffect(() => {
    if (complete) siteRef.current?.querySelector('main')?.focus({ preventScroll: true });
  }, [complete]);

  return <>
    <div ref={siteRef} className="entrance-site" inert={complete ? undefined : true}>
      {children}
    </div>
    {!complete && <div className={`site-entrance entrance-phase-${phase}`} role="dialog" aria-modal="true" aria-labelledby="entrance-title" data-phase={phase}>
      <span id="entrance-title" className="sr-only">Welcome to TM Concepts</span>
      <div className="entrance-ambient" aria-hidden="true"/>
      <div className="entrance-topline" aria-hidden="true"><span>TM CONCEPTS</span><span>KAMPALA, UGANDA</span></div>
      <div className="entrance-centre">
        <div className="entrance-brand" aria-hidden={phase === 'slogan' || phase === 'leaving'}>
          <div className="entrance-logo-mask">
            {logoFailed ? <div className="entrance-logo-fallback">TM<span>CONCEPTS</span></div> : <svg className="entrance-logo-art" viewBox="330 290 940 360" role="img" aria-label="TM Concepts"><image href="/images/tm-logo.png" x="0" y="0" width="1536" height="1024"/></svg>}
          </div>
          <div className="entrance-signature">
            {logoFailed ? <span>Toxic With Events</span> : <svg className="entrance-signature-art" viewBox="490 620 560 105" role="img" aria-label="Toxic With Events"><image href="/images/tm-logo.png" x="0" y="0" width="1536" height="1024"/></svg>}
          </div>
        </div>
        <div className="entrance-slogan" aria-hidden={phase !== 'slogan' && phase !== 'leaving' && phase !== 'reduced'}>
          <span className="entrance-slogan-kicker">THE VISION STARTS HERE.</span>
          <p><span>SEE IT.</span><span>BEFORE IT HAPPENS.</span></p>
        </div>
      </div>
      <div className="entrance-slash" aria-hidden="true"/>
      <div className="entrance-bottomline"><span>DESIGN. VISUALISE. PRODUCE.</span><button ref={skipRef} className="entrance-skip">SKIP INTRO <ArrowUpRight size={15}/></button></div>
      <div className="entrance-timeline" aria-hidden="true"><span/></div>
    </div>}
  </>;
}

