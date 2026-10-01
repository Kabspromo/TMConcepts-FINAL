import {ArrowUpRight,MapPin} from 'lucide-react';
import {Photo,SectionLabel,Watermark,Process,CTASection,CompanyProfileLink} from './components';
import {conceptPair} from './content';
import {serviceImagery} from './serviceImagery';
import {aboutCompany,aboutJourney,aboutPillars} from './aboutContent';
import StageLightAmbient from './StageLightAmbient';

export default function AboutStory({startProject}){
  const pillarImages={design:conceptPair.after,wedding:serviceImagery.weddings,awards:'awards'};
  return <div className="about-story">
    <header className="about-story-hero section-padding">
      <Watermark>TM CONCEPTS</Watermark>
      <div className="about-hero-copy"><SectionLabel>ABOUT TM CONCEPTS</SectionLabel><h1>WE DESIGN<br/>THE EXPERIENCE.<br/><span>BEFORE WE<br/>BUILD IT.</span></h1><p>{aboutCompany.introduction}</p><span className="about-location"><MapPin size={17}/> NTINDA / KAMPALA / UGANDA</span></div>
      <figure className="about-hero-photo"><Photo photo="stage" eager sizes="(max-width:900px) 100vw, 48vw"/><figcaption>ROTARY MUYENGA BUKASA / THE FINISHED STAGE</figcaption></figure>
    </header>
    <section className="about-company section-padding light"><div><SectionLabel number="01">WHO WE ARE</SectionLabel><h2>CREATIVE IDEAS.<br/><span>A WORKABLE PLAN.</span></h2><p>From our base on Semawata Road in Ntinda, we bring the creative and technical sides of an event into the same conversation.</p><p>The way the stage faces the audience. How sound reaches the room. Where screens sit, how light shapes the atmosphere and how guests move through the space. Each decision becomes part of one coordinated production.</p><CompanyProfileLink/></div><figure><Photo photo="conference" sizes="(max-width:900px) 100vw, 48vw"/><figcaption>THE SPACE. THE SYSTEMS. THE PROGRAMME.<span>A supplied TM Concepts conference setup.</span></figcaption></figure></section>
    <section className="about-pillars section-padding"><SectionLabel number="02">OUR POINT OF VIEW</SectionLabel><div className="section-intro"><h2>THE IDEA IS ONLY<br/>THE BEGINNING.</h2><p>Good design has to work in the room.<br/>That is where our disciplines meet.</p></div><div className="about-pillar-grid">{aboutPillars.map((pillar,i)=><article key={pillar.title}><figure><Photo photo={pillarImages[pillar.image]} sizes="(max-width:700px) 100vw, 33vw"/><figcaption>{pillar.caption}</figcaption></figure><span className="about-pillar-number">0{i+1}</span><h3>{pillar.title}</h3><p>{pillar.text}</p></article>)}</div></section>
    <Process number="03" steps={aboutJourney} label="ONE COORDINATED PROCESS" title={<>FROM THE FIRST IDEA.<br/>TO THE LIVE EVENT.</>}/>
    <section className="about-mission section-padding light"><SectionLabel number="04">OUR MISSION</SectionLabel><h2>{aboutCompany.mission}</h2><div className="about-mission-baseline"><span>CREATIVE THINKING</span><span>INTELLIGENT PLANNING</span><span>DEPENDABLE PRODUCTION</span></div></section>
    <section className="about-vision section-padding"><StageLightAmbient/><Watermark>ACROSS AFRICA</Watermark><SectionLabel number="05">OUR VISION</SectionLabel><div className="section-intro"><h2><span>PROVIDING</span><span>UNFORGETTABLE</span><span>EVENT EXPERIENCES</span><span>ACROSS AFRICA.</span></h2></div></section>
    <section className="about-leadership section-padding light"><figure><Photo slot="CEO PORTRAIT" sizes="(max-width:700px) 100vw, 40vw"/></figure><div><SectionLabel number="06">LEADERSHIP</SectionLabel><h2>{aboutCompany.leadership.name.toUpperCase()}</h2><span className="eyebrow">{aboutCompany.leadership.role.toUpperCase()}</span><p>{aboutCompany.leadership.statement}</p><div className="about-leadership-line">Creative direction.<br/>Technical coordination.<br/>One production process.</div><a className="text-link" href="/contact">LET’S TALK ABOUT YOUR EVENT <ArrowUpRight size={19}/></a></div></section>
    <CTASection startProject={startProject}/>
  </div>;
}
