import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Modal } from '../components/Modal';
import { useNavigate } from 'react-router-dom'; // added

// Enriched service model
interface Service {
  code: string;
  title: string;
  category: 'counselling' | 'planning' | 'application' | 'compliance' | 'funding';
  tagline: string;
  desc: string;
  benefits: string[];
  cta?: string;
}

const categoryLabels: Record<Service['category'], string> = {
  counselling: 'Counselling',
  planning: 'Planning',
  application: 'Application',
  compliance: 'Compliance',
  funding: 'Funding'
};

const services: Service[] = [
  {
    code: 'peer',
    title: 'Peer Counselling',
    category: 'counselling',
    tagline: 'Talk to real international students',
    desc: 'Get authentic insights from current international students who recently navigated the same journey.',
    benefits: [
      'Profile & goal alignment chat',
      'Country & course comparisons',
      'Realistic admit probability perspective',
      'Lifestyle & campus experience insights',
      'Strategic next steps after call'
    ],
    cta: 'Book Peer Session'
  },
  {
    code: 'rep',
    title: 'University Representative',
    category: 'counselling',
    tagline: 'Official program clarity',
    desc: 'Clarify academic structure, faculty strengths & unique tracks directly via vetted representative guidance.',
    benefits: [
      'Program structure breakdown',
      'Faculty / research focus areas',
      'Placement & outcome narratives',
      'Scholarship opportunity pointers',
      'Common applicant mistakes to avoid'
    ],
    cta: 'Book Rep Session'
  },
  {
    code: 'shortlist',
    title: 'University Shortlisting',
    category: 'planning',
    tagline: 'Strategic dream / match / safe mix',
    desc: 'Data-informed shortlisting balancing ambition, feasibility & funding exposure.',
    benefits: [
      'Academic & goals evaluation',
      'Dream / match / safe segmentation',
      'Scholarship probability alignment',
      'Application workload optimization',
      'Actionable shortlist brief PDF'
    ],
    cta: 'Build My Shortlist'
  },
  {
    code: 'application',
    title: 'Application Assistance',
    category: 'application',
    tagline: 'Polish & differentiate your profile',
    desc: 'Structured support to craft compelling, authentic applications that stand out.',
    benefits: [
      'SOP brainstorming & drafts',
      'LOR positioning guidance',
      'Resume structuring optimization',
      'Document version tracking',
      'Deadline & submission checklist'
    ],
    cta: 'Start Application Support'
  },
  {
    code: 'visa',
    title: 'Visa Guidance',
    category: 'compliance',
    tagline: 'Confident, compliant filings',
    desc: 'Reduce risk with structured document prep, mock interview practice & timeline alerts.',
    benefits: [
      'Personalized document checklist',
      'DS / form walkthrough (where applicable)',
      'Financial proof review tips',
      'Mock interview simulations',
      'Pre‑departure compliance reminders'
    ],
    cta: 'Get Visa Support'
  },
  {
    code: 'scholarship',
    title: 'Scholarship Assistance',
    category: 'funding',
    tagline: 'Maximize funding outcomes',
    desc: 'Targeted identification & refinement for merit, need & niche awards.',
    benefits: [
      'Scholarship eligibility mapping',
      'Essay / statement refinement',
      'Timeline & batching strategy',
      'Stacking / alternative funding tips',
      'Progress & submission tracking'
    ],
    cta: 'Boost Funding Chances'
  }
];

export const Services: React.FC = () => {
  const ref = useReveal();
  const [filter, setFilter] = useState<string>(''); // category filter
  const [selected, setSelected] = useState<Service | null>(null);
  const nav = useNavigate(); // added

  const filtered = filter ? services.filter(s => s.category === filter) : services;

  function scrollToContact() {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="section reveal" id="services" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">Services</h2>

        {/* Filter Chips */}
        <div className="chips" style={{justifyContent:'center', marginBottom:'1.25rem'}}>
          <button
            className={'chip ' + (!filter ? 'chip--active' : '')}
            onClick={() => setFilter('')}
            aria-pressed={!filter}
          >All</button>
          {(['counselling','planning','application','compliance','funding'] as Service['category'][]).map(cat => (
            <button
              key={cat}
              className={'chip ' + (filter === cat ? 'chip--active' : '')}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
            >{categoryLabels[cat]}</button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="grid services__grid">
          {filtered.map(s => {
            const isPeer = s.code === 'peer';
            return (
              <div
                key={s.code}
                className="card service"
                style={{display:'flex', flexDirection:'column', gap:'.55rem', cursor:isPeer?'pointer':'auto'}}
                onClick={() => { if (isPeer) nav('/services/peer-counselling'); else setSelected(s); }} // changed
              >
                <div>
                  <h3 style={{margin:'0 0 .3rem'}}>{s.title}</h3>
                  <p style={{margin:'0 0 .4rem', fontSize:'.72rem', textTransform:'uppercase', letterSpacing:'1px', fontWeight:600, opacity:.7}}>
                    {categoryLabels[s.category]}
                  </p>
                  <p style={{margin:'0 0 .6rem', fontSize:'.85rem'}}>{s.tagline}</p>
                  <p style={{margin:'0 0 .75rem', fontSize:'.75rem', color:'var(--muted)'}}>{s.desc}</p>
                </div>
                <div style={{marginTop:'auto', display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
                  <button
                    className="btn btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPeer) nav('/services/peer-counselling'); else setSelected(s);
                    }} // changed
                    aria-label={`View details for ${s.title}`}
                  >Details</button>
                  <button
                    className="btn btn-small btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPeer) nav('/services/peer-counselling'); else setSelected(s);
                    }} // changed
                  >{s.cta || 'Learn More'}</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal only for non-peer services */}
        <Modal
          open={!!selected && selected.code !== 'peer'} // ensure peer never triggers modal
          onClose={() => setSelected(null)}
          title={selected?.title || 'Service'}
        >
          {selected && selected.code !== 'peer' && (
            <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              <div>
                <span style={{
                  display:'inline-block',
                  background:'var(--bg-alt)',
                  padding:'.3rem .6rem',
                  borderRadius:'999px',
                  fontSize:'.55rem',
                  letterSpacing:'1px',
                  textTransform:'uppercase',
                  fontWeight:600
                }}>{categoryLabels[selected.category]}</span>
              </div>
              <p style={{margin:'0', fontSize:'.85rem', lineHeight:1.5}}>{selected.desc}</p>
              <div>
                <h4 style={{margin:'0 0 .5rem', fontSize:'.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>Included</h4>
                <ul style={{margin:0, padding:'0 0 0 1rem', fontSize:'.8rem', lineHeight:1.45}}>
                  {selected.benefits.map(b => <li key={b} style={{marginBottom:'.35rem'}}>{b}</li>)}
                </ul>
              </div>
              <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap'}}>
                <button
                  className="btn btn-primary"
                  onClick={() => { scrollToContact(); setSelected(null); }}
                >{selected.cta || 'Book Now'}</button>
                <button className="btn btn-small" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};
