import { useId } from 'react';

export default function StageScene({ mode = 'lit', step = 4, angle = 0 }) {
  const id = useId().replaceAll(':', '');
  const wire = mode === 'wire';
  return <svg className={`stage-scene ${wire ? 'wire' : ''}`} viewBox="0 0 1000 560" role="img" aria-label={wire ? 'Wireframe concept of a stage with seating and truss' : 'Illustrated stage lighting concept with LED screen, beams and seating'} style={{ transform: `perspective(1200px) rotateY(${angle}deg)` }}>
    <defs>
      <linearGradient id={`${id}floor`} x2="0" y2="1"><stop stopColor="#15171c"/><stop offset="1" stopColor="#050607"/></linearGradient>
      <linearGradient id={`${id}screen`} x2="1" y2="1"><stop stopColor="#b6c8da"/><stop offset=".5" stopColor="#4c5878"/><stop offset="1" stopColor="#e2b7a8"/></linearGradient>
      <linearGradient id={`${id}beam`} x2="0" y2="1"><stop stopColor="#e4edff" stopOpacity=".55"/><stop offset="1" stopColor="#bccfff" stopOpacity="0"/></linearGradient>
      <pattern id={`${id}grid`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke={wire ? '#788898' : '#4a5059'} strokeWidth=".6" opacity=".3"/></pattern>
    </defs>
    <rect width="1000" height="560" fill={wire ? '#0a1015' : '#08090c'}/>
    <path d="M0 0L190 125H810L1000 0M190 125V335L0 560M810 125V335L1000 560" stroke="#373b45" fill="none"/>
    <path d="M190 335H810L1000 560H0Z" fill={`url(#${id}floor)`} stroke="#444b56"/>
    <rect width="1000" height="560" fill={`url(#${id}grid)`}/>
    {[0,1,2,3,4].map(i => <path key={i} d={`M${70+i*52} ${45+i*20}H${930-i*52}`} stroke="#363d49" strokeWidth="1"/>) }
    {step >= 1 && <g fill={wire ? 'none' : '#21242b'} stroke={wire ? '#9aaebb' : '#555a63'} strokeWidth="1">
      <path d="M250 307H750L804 364H197Z"/><path d="M197 364H804V382H197Z" fill={wire ? 'none' : '#111318'}/>
      {[0,1,2,3].map(row => Array.from({length:10},(_,col)=> <g key={`${row}-${col}`} transform={`translate(${220+col*57-row*12},${405+row*32})`}><path d="M0 0H29L34 12H-5Z"/><path d="M-5 12V23M34 12V23M0 0V-17H29V0"/></g>))}
    </g>}
    {step >= 2 && <g stroke={wire ? '#bdd0dc' : '#696d79'}>
      <rect x="324" y="175" width="352" height="135" fill={wire ? 'none' : `url(#${id}screen)`}/>
      {!wire && <g fill="white" stroke="none"><text x="500" y="238" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="34" letterSpacing="9">TM CONCEPTS</text><text x="500" y="264" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="5">SEE IT. BEFORE IT HAPPENS.</text></g>}
      <rect x="265" y="177" width="35" height="133" fill={wire ? 'none' : '#69768d'}/><rect x="700" y="177" width="35" height="133" fill={wire ? 'none' : '#69768d'}/>
    </g>}
    {step >= 3 && <g fill="none" stroke={wire ? '#b9cedb' : '#747984'} strokeWidth="2">
      <path d="M227 322V141H775V322M243 322V156H759V322"/>
      {Array.from({length:18},(_,i)=><path key={i} d={`M${233+i*30} 141l15 15 15-15`}/>)}
      {Array.from({length:6},(_,i)=><path key={i} d={`M227 ${158+i*27}l16 13-16 14M759 ${158+i*27}l16 13-16 14`}/>)}
      {[277,365,453,547,635,723].map(x=><g key={x}><rect x={x-8} y="155" width="16" height="15" fill="#373d48"/><path d={`M${x-5} 170h10l5 8h-20z`} fill="#bbc5d2"/></g>)}
      <path d="M212 243h-27v80h27zM788 243h27v80h-27z" fill={wire ? 'none' : '#14161c'}/>
    </g>}
    {step >= 4 && !wire && <g style={{mixBlendMode:'screen'}}>{[277,365,453,547,635,723].map((x,i)=><path key={x} d={`M${x} 175L${x+(i%2?-140:-40)} 550L${x+(i%2?40:140)} 550Z`} fill={`url(#${id}beam)`} opacity=".7"/>)}</g>}
    <g fill={wire ? '#9aabb8' : '#656d7b'} fontFamily="monospace" fontSize="8" letterSpacing="2"><text x="35" y="35">TM / SPATIAL DESIGN STUDY</text><text x="35" y="535">{wire ? 'CONCEPT WIREFRAME' : 'LIGHTING VISUALISATION'}</text><text x="965" y="535" textAnchor="end">ILLUSTRATIVE CONCEPT / 001</text></g>
  </svg>;
}

export function EquipmentArt({ kind }) {
  const common = { fill: '#17191c', stroke: '#84888f', strokeWidth: 1.3 };
  return <svg viewBox="0 0 360 270" className="equipment-art" aria-hidden="true">
    <ellipse cx="180" cy="225" rx="88" ry="10" fill="#000" opacity=".8"/>
    {kind === 'light' && <g {...common}><path d="M127 204h107l-8 19h-93z"/><path d="M141 200V143h17v45h44v-45h17v57z"/><g transform="rotate(-25 180 125)"><rect x="151" y="78" width="59" height="94" rx="18"/><ellipse cx="180" cy="81" rx="25" ry="11" fill="#b0bac7"/><ellipse cx="180" cy="81" rx="17" ry="7" fill="#d4dbe7"/><path d="M158 113h45M158 122h45M158 131h45" stroke="#45494e"/></g></g>}
    {kind === 'led' && <g {...common}><path d="M90 61l182 18v124L90 185z" fill="#373e4b"/>{[0,1,2,3,4,5].map(i=><path key={i} d={`M${90+i*30} ${61+i*3}v124M90 ${61+i*25}l182 18`} stroke="#79808b" opacity=".5"/>)}<path d="M109 189v32m142-21v23M99 223h31m110 0h27"/></g>}
    {kind === 'audio' && <g {...common}>{[0,1,2,3].map(i=><g key={i} transform={`translate(${i*3} ${i*37})`}><path d="M141 43l73 7-4 34-70-5z"/><path d="M149 50l55 5-3 20-52-4z" fill="#060708"/><path d="M153 58l46 5M152 64l46 5" stroke="#393d43"/></g>)}<path d="M152 200h72v25h-72z"/></g>}
    {kind === 'truss' && <g {...common} fill="none" strokeWidth="3"><path d="M72 167l208-89v33L72 200zm0 0 21 15 207-89-20-15M93 182v33l207-89V93M72 200l21 15"/>{[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${74+i*29} ${168-i*12.4}l28 21-28 12m20-19 28 20-28 12`}/>)}</g>}
    {kind === 'stage' && <g {...common}><path d="M67 156l145-49 88 62-153 53z" fill="#303237"/><path d="M67 156v17l80 65 153-53v-16M147 222v16M77 181v30m65 24v18m143-64v21M212 108v20"/><path d="M140 132l82 64M110 186l151-51" stroke="#595c62"/></g>}
    {kind === 'sofa' && <g {...common}><rect x="89" y="112" width="183" height="83" rx="12"/><path d="M100 151h159v49H100z" fill="#35373a"/><rect x="80" y="148" width="28" height="60" rx="7"/><rect x="255" y="148" width="28" height="60" rx="7"/><path d="M94 207v15m177-15v15M181 116v81"/></g>}
    {kind === 'chair' && <g {...common}><path d="M121 87h116v84H121z"/><path d="M112 160h134v48H112z" fill="#303236"/><path d="M124 207v18m110-18v18M112 167l-13 44m147-44 13 44" fill="none" strokeWidth="5"/><path d="M129 97h100v64H129z" fill="#25272a"/></g>}
    {kind === 'conference' && <g {...common}><path d="M132 204h94l-13 19h-72z"/><path d="M177 204V95l37-33" fill="none" strokeWidth="5"/><rect x="207" y="52" width="32" height="11" rx="5" transform="rotate(-40 215 62)"/></g>}
    {kind === 'table' && <g {...common}><ellipse cx="180" cy="104" rx="65" ry="18" fill="#3c3d40"/><path d="M115 104v7c10 24 122 24 130 0v-7M179 125v87" strokeWidth="3"/><ellipse cx="180" cy="216" rx="37" ry="8" fill="#25272a"/></g>}
  </svg>;
}
