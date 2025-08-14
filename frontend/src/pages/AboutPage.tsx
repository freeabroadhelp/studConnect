import React, { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';

// Simple count-up component that animates when visible
const CountUp: React.FC<{ value: number; duration?: number; suffix?: string; label: string }> = ({ value, duration = 1400, suffix = '', label }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting && !started.current){
          started.current = true;
          const start = performance.now();
          const animate = (t: number) => {
            const prog = Math.min(1, (t - start) / duration);
            setDisplay(Math.round(value * prog));
            if(prog < 1) requestAnimationFrame(animate); else setDisplay(value);
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);
  return (
    <div ref={ref} className="about-counter" aria-label={label} title={label}>
      <strong>{display.toLocaleString()}{display === value ? suffix : ''}</strong>
      <span>{label}</span>
    </div>
  );
};

export const AboutPage: React.FC = () => {
  // Tabs for mission / vision / values
  const [tab, setTab] = useState<'mission' | 'vision' | 'values'>('mission');
  // Accordion open items (why choose us)
  const [openAcc, setOpenAcc] = useState<string | null>('support');
  // Timeline active index
  const [timelineIndex, setTimelineIndex] = useState(0);
  // Team filter
  const [teamFilter, setTeamFilter] = useState<'all' | 'counsellors' | 'alumni' | 'support'>('all');

  const aboutRef = useReveal();

  const tabContent: Record<typeof tab, JSX.Element> = {
    mission: <p>Empower every aspiring international student with transparent guidance, actionable data, and ethical mentorship so they can make confident decisions and unlock global opportunities.</p>,
    vision: <p>Become the most trusted global companion for study-abroad journeys—seamlessly blending human empathy and intelligence with powerful, adaptive technology.</p>,
    values: <ul className="values-list"><li>Transparency first</li><li>Student success over shortcuts</li><li>Diversity & inclusion</li><li>Continuous learning</li><li>Data with empathy</li></ul>
  };

  const accordionItems = [
    { key: 'support', title: 'End-to-end Support', body: 'Guidance across discovery, shortlisting, tests, applications, scholarships, visa, and pre-departure.' },
    { key: 'verified', title: 'Verified Experts', body: 'Curated counsellors, alumni mentors, and university liaisons—quality & integrity checked.' },
    { key: 'data', title: 'Data-Driven Decisions', body: 'Smart shortlists and strategy using success patterns, admissions trends, and scholarship insights.' },
    { key: 'ethics', title: 'Transparent & Ethical', body: 'No hidden agendas—just honest advice that aligns with your goals and financial realities.' }
  ];

  const timeline = [
    { year: 'Discovery', detail: 'Understand aspirations, budget, eligibility & timelines.' },
    { year: 'Shortlist', detail: 'Curated matches balancing dream, competitive & safe universities.' },
    { year: 'Applications', detail: 'SOP/LOR refinement, documentation tracking, and deadline management.' },
    { year: 'Scholarships', detail: 'Identify & apply to merit / need-based / location-specific funding.' },
    { year: 'Visa & Prep', detail: 'Interview prep, document checks, accommodation & orientation.' }
  ];

  const team = [
    { name: 'Aisha Khan', role: 'Senior Counsellor', type: 'counsellors', exp: 8 },
    { name: 'Rohan Patel', role: 'Alumni Mentor (Canada)', type: 'alumni', exp: 4 },
    { name: 'Emily Chen', role: 'Scholarship Advisor', type: 'support', exp: 5 },
    { name: 'Liam O\'Connor', role: 'Visa Specialist', type: 'support', exp: 6 },
    { name: 'Sofia Martinez', role: 'Alumni Mentor (UK)', type: 'alumni', exp: 3 },
  ];

  const filteredTeam = team.filter(m => teamFilter === 'all' || m.type === teamFilter);

  return (
    <main className="page container about" ref={aboutRef as any}>
      <h1 className="gradient-text">About Us</h1>

      {/* Tabs */}
      <section className="about-section about-section--tabs">
        <div className="about-tabs" role="tablist" aria-label="About navigation">
          {['mission','vision','values'].map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={"about-tab" + (tab === t ? ' about-tab--active' : '')}
              onClick={() => setTab(t as any)}
            >{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        <div className="about-tabpanel" role="tabpanel">{tabContent[tab]}</div>
      </section>

      {/* Counters */}
      <section className="about-section">
        <h2>Impact Stats</h2>
        <div className="about-counters">
          <CountUp value={12000} label="Students Guided" />
          <CountUp value={97} label="Visa Success %" suffix="%" />
          <CountUp value={850} label="Scholarships Won" />
          <CountUp value={32} label="Countries Covered" />
        </div>
      </section>

      {/* Accordion */}
      <section className="about-section">
        <h2>Why Choose Us</h2>
        <div className="accordion" role="list">
          {accordionItems.map(item => {
            const open = openAcc === item.key;
            return (
              <div key={item.key} className={"accordion__item" + (open ? ' accordion__item--open' : '')}>
                <button
                  className="accordion__trigger"
                  aria-expanded={open}
                  onClick={() => setOpenAcc(open ? null : item.key)}
                >
                  <span>{item.title}</span>
                  <span className="accordion__icon" aria-hidden>▾</span>
                </button>
                <div className="accordion__panel" role="region" aria-hidden={!open}>{item.body}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="about-section">
        <h2>Student Journey</h2>
        <div className="timeline" role="list">
          <div className="timeline__rail" />
          {timeline.map((step, idx) => {
            const active = idx === timelineIndex;
            return (
              <button
                key={step.year}
                role="listitem"
                className={"timeline__item" + (active ? ' timeline__item--active' : '')}
                onClick={() => setTimelineIndex(idx)}
              >
                <span className="timeline__dot" />
                <span className="timeline__label">{step.year}</span>
              </button>
            );
          })}
        </div>
        <div className="timeline__detail">
          <p>{timeline[timelineIndex].detail}</p>
        </div>
      </section>

      {/* Team Filter */}
      <section className="about-section">
        <h2>Our Team</h2>
        <div className="chips" style={{ marginBottom: '.9rem' }}>
          {([
            { key:'all', label:'All' },
            { key:'counsellors', label:'Counsellors' },
            { key:'alumni', label:'Alumni Mentors' },
            { key:'support', label:'Support & Advisors' },
          ] as const).map(c => (
            <span
              key={c.key}
              role="button"
              tabIndex={0}
              onClick={() => setTeamFilter(c.key)}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key===' ') { e.preventDefault(); setTeamFilter(c.key);} }}
              className={"chip" + (teamFilter === c.key ? ' chip--active' : '')}
            >{c.label}</span>
          ))}
        </div>
        <div className="team-grid">
          {filteredTeam.map(m => (
            <div key={m.name} className="team-card" role="article">
              <div className="team-avatar" aria-hidden>{m.name.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
              <h3>{m.name}</h3>
              <p className="muted">{m.role}</p>
              <span className="team-exp" aria-label={`Experience ${m.exp} years`}>{m.exp} yrs</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

