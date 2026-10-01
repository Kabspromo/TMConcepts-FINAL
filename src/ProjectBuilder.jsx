import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, X, Upload, Download, Plus, Minus } from 'lucide-react';
import { WHATSAPP } from './data';

const types = ['Conference', 'Concert', 'Wedding', 'Corporate event', 'Night experience', 'Product launch', 'Other'];
const options = ['3D Design', 'Technical Production', 'Stage', 'Lighting', 'LED', 'Audio', 'AV', 'Power & Generators', 'Rigging', 'Branding & Signage', 'Furniture', 'Full Production'];
const initial = { type: '', venue: '', guests: '', date: '', name: '', company: '', email: '', phone: '', notes: '' };

export default function ProjectBuilder({ dialogRef, selectedItems, setSelectedItems, embedded = false }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [selected, setSelected] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const titleId = useId();
  const [minimumDate,setMinimumDate] = useState('');
  useEffect(()=>{const date=new Date();setMinimumDate(date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0'));},[]);
  const Container = embedded ? 'div' : 'dialog';
  useEffect(() => { if(step > 0) { const heading = formRef.current?.querySelector('h2'); heading?.focus({preventScroll:true}); if(embedded)heading?.scrollIntoView({block:'center',behavior:'instant'}); else if(dialogRef.current)dialogRef.current.scrollTop=0; } },[step,embedded,dialogRef]);
  const field = (name) => ({ value: data[name], onChange: e => setData(prev => ({ ...prev, [name]: e.target.value })) });
  const toggle = (item) => setSelected(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  const next = (e) => {
    e.preventDefault();
    if (step === 0 && !data.type) { setError('Choose an event type to continue.'); return; }
    if (step === 1 && selected.length === 0 && selectedItems.length === 0) { setError('Choose at least one service, or select Full Production.'); return; }
    setError(''); setStep(s => Math.min(3, s + 1));
  };
  const brief = [
    'Hello TM Concepts! I’d like to discuss an event.', '',
    `Event: ${data.type}`, `Venue / location: ${data.venue}`, `Guests: ${data.guests || 'To be confirmed'}`, `Date: ${data.date || 'To be confirmed'}`,
    `Services: ${selected.join(', ') || 'Equipment hire'}`,
    selectedItems.length ? `Equipment requests: ${selectedItems.map(x => `${x.name} × ${x.quantity}`).join(', ')}` : '',
    '', `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone || 'This WhatsApp number'}`,
    data.company ? "Company: " + data.company : "",
    data.notes ? `Notes: ${data.notes}` : '',
    files.length ? `Files I will attach in this chat: ${files.map(x => x.name).join(', ')}` : '',
  ].filter((line,i,arr) => line || arr[i-1]).join('\n');
  const download = () => {
    const url = URL.createObjectURL(new Blob([brief], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'TM-Concepts-event-brief.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const close = () => dialogRef?.current?.close();
  return <Container ref={embedded ? undefined : dialogRef} className={embedded ? "builder-embedded" : "project-dialog"} aria-labelledby={titleId} onClick={e => { if (!embedded && e.target === e.currentTarget) close(); }}>
    <div className="builder-shell">
      <div className="builder-top"><span className="eyebrow">TM CONCEPTS / YOUR NEXT EXPERIENCE</span>{!embedded && <button className="icon-button" onClick={close} aria-label="Close project builder"><X /></button>}</div>
      <div className="step-track">{['The event', 'The production', 'About you', 'Your brief'].map((s,i)=><div key={s} className={i<=step?'active':''}><span>{i<step?<Check size={12}/>:String(i+1).padStart(2,'0')}</span><small>{s}</small></div>)}</div>
      <form ref={formRef} onSubmit={next}>
        {step === 0 && <div className="builder-step"><span className="eyebrow">01 / THE START OF SOMETHING</span><h2 id={titleId} tabIndex={-1}>What are we creating?</h2><p>Start with an idea. We’ll help you see the possibilities.</p><fieldset className="choice-grid"><legend className="sr-only">Event type</legend>{types.map(type=><button key={type} type="button" className={`choice ${data.type===type?'selected':''}`} aria-pressed={data.type===type} onClick={()=>setData(p=>({...p,type}))}>{type}{data.type===type?<Check size={17}/>:<Plus size={17}/>}</button>)}</fieldset><div className="fields"><label className="full">Venue or location <span>*</span><input required maxLength={160} placeholder="Venue name, city, or somewhere you have in mind" {...field('venue')}/></label><label>Number of guests<input type="number" min="1" max="1000000" placeholder="An estimate is fine" {...field('guests')}/></label><label>Event date<input type="date" min={minimumDate} {...field('date')}/></label></div></div>}
        {step === 1 && <div className="builder-step"><span className="eyebrow">02 / MAKE IT YOURS</span><h2 id={titleId} tabIndex={-1}>What brings it to life?</h2><p>Choose what you need, or let us shape the whole production.</p><fieldset className="choice-grid"><legend className="sr-only">Production services</legend>{options.map(option=><button key={option} type="button" className={`choice ${selected.includes(option)?'selected':''}`} aria-pressed={selected.includes(option)} onClick={()=>toggle(option)}>{option}{selected.includes(option)?<Check size={17}/>:<Plus size={17}/>}</button>)}</fieldset>{selectedItems.length>0&&<div className="brief-items"><span className="eyebrow">YOUR EQUIPMENT REQUESTS</span>{selectedItems.map(item=><div className="brief-item" key={item.name}><span>{item.name}</span><div className="quantity-control"><button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={()=>setSelectedItems(prev=>prev.flatMap(x=>x.name===item.name?(x.quantity>1?[{...x,quantity:x.quantity-1}]:[]):[x]))}><Minus size={14}/></button><span>{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.quantity>=999} onClick={()=>setSelectedItems(prev=>prev.map(x=>x.name===item.name?{...x,quantity:x.quantity+1}:x))}><Plus size={14}/></button></div></div>)}</div>}<label className="file-drop"><Upload size={24}/><strong>Add venue photos or a floor plan</strong><span>JPG, PNG, WebP or PDF · up to 5 files · 10 MB each</span><input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={e=>{const picked=Array.from(e.target.files);if(picked.length>5||picked.some(f=>f.size>10*1024*1024||!['image/jpeg','image/png','image/webp','application/pdf'].includes(f.type))){setError('Choose up to 5 JPG, PNG, WebP or PDF files, no larger than 10 MB each.');e.target.value='';return;}setFiles(picked);setError('');}}/></label>{files.map((file,i)=><div className="file-row" key={`${file.name}-${i}`}><span>{file.name}</span><button type="button" className="icon-button" aria-label={`Remove ${file.name}`} onClick={()=>setFiles(prev=>prev.filter((_,n)=>n!==i))}><X size={15}/></button></div>)}<p className="form-note">Files stay on your device. Attach them in WhatsApp after opening your brief.</p></div>}
        {step === 2 && <div className="builder-step"><span className="eyebrow">03 / LET’S CONNECT</span><h2 id={titleId} tabIndex={-1}>Who’s behind the vision?</h2><p>A few details to start the conversation.</p><div className="fields"><label className="full">Your name <span>*</span><input autoComplete="name" required maxLength={100} placeholder="First and last name" {...field('name')}/></label><label>Email <span>*</span><input type="email" autoComplete="email" required maxLength={160} placeholder="you@company.com" {...field('email')}/></label><label>Phone<input type="tel" autoComplete="tel" maxLength={30} placeholder="+256 …" {...field('phone')}/></label><label className="full">Company<input autoComplete="organization" maxLength={160} placeholder="Company or organisation (optional)" {...field('company')}/></label><label className="full">Message<textarea rows="4" maxLength={1500} placeholder="Your idea, preferred atmosphere, budget range, or questions…" {...field('notes')}/></label></div><p className="form-note">Your details are included in the WhatsApp message. Nothing is submitted until you send it.</p></div>}
        {step === 3 && <div className="builder-step"><span className="eyebrow">04 / READY WHEN YOU ARE</span><h2 id={titleId} tabIndex={-1}>A vision worth building.</h2><p>Review your brief, then open a conversation with TM Concepts.</p><dl className="review-grid"><div><dt>THE EVENT</dt><dd>{data.type}</dd></div><div><dt>THE SPACE</dt><dd>{data.venue}</dd></div><div><dt>THE AUDIENCE</dt><dd>{data.guests?`${Number(data.guests).toLocaleString()} guests`:'To be confirmed'}</dd></div><div><dt>THE DATE</dt><dd>{data.date||'To be confirmed'}</dd></div><div className="full"><dt>THE PRODUCTION</dt><dd>{selected.join(' / ')||'Equipment hire'}</dd></div>{selectedItems.length>0&&<div className="full"><dt>REQUESTED EQUIPMENT</dt><dd>{selectedItems.map(x=>`${x.name} × ${x.quantity}`).join(' / ')}</dd></div>}<div className="full"><dt>YOUR DETAILS</dt><dd>{data.name} · {data.email}{data.phone&&` · ${data.phone}`}</dd></div>{data.company&&<div className="full"><dt>COMPANY</dt><dd>{data.company}</dd></div>}{data.notes&&<div className="full"><dt>MESSAGE</dt><dd>{data.notes}</dd></div>}{files.length>0&&<div className="full"><dt>FILES TO ATTACH IN WHATSAPP</dt><dd>{files.map(x=>x.name).join(', ')}</dd></div>}</dl><p className="form-note">This opens WhatsApp with your brief prepared. Review and press Send there. Equipment, availability and pricing are confirmed by quotation.</p><div className="review-actions"><a className="button white" href={`${WHATSAPP}?text=${encodeURIComponent(brief)}`} target="_blank" rel="noreferrer">Open brief in WhatsApp <ArrowUpRight size={18}/></a><button type="button" className="text-button" onClick={download}><Download size={16}/> Download brief</button></div></div>}
        {error&&<p className="form-error" role="alert">{error}</p>}
        <div className="builder-bottom">{step>0?<button className="text-button" type="button" onClick={()=>{setStep(s=>s-1);setError('');}}><ArrowLeft size={16}/> Back</button>:<span className="form-note">LET’S MAKE SOMETHING EXTRAORDINARY.</span>}{step<3&&<button type="submit" className="button white">{step===2?'Review your brief':'Continue'}<ArrowRight size={17}/></button>}</div>
      </form>
    </div>
  </Container>;
}
