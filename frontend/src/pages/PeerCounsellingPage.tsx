import React from 'react';
import { useNavigate } from 'react-router-dom';

const valuePoints = [
  { title:'Real Student Insights', text:'Current international students share up‑to‑date campus & lifestyle realities.' },
  { title:'Profile Alignment', text:'Get candid feedback on goals, competitiveness & strategic positioning.' },
  { title:'Country & Program Clarity', text:'Compare destinations on cost, outcomes, culture & career pathways.' },
  { title:'Actionable Next Steps', text:'Leave every session with prioritized, time‑bound tasks.' }
];

const flow = [
  { step:1, title:'Request Session', text:'Pick a slot & share quick intent notes.' },
  { step:2, title:'Match & Prep', text:'We pair you with a relevant mentor; you get a mini prep brief.' },
  { step:3, title:'Live Peer Call', text:'45–50 min structured conversation + open Q&A.' },
  { step:4, title:'Session Recap', text:'Key takeaways, links & next‑step checklist.' },
  { step:5, title:'Follow‑Up Window', text:'72h asynchronous clarification support.' }
];

const packages = [
  { id:'starter', name:'Starter', price:'$29', blurb:'Single focused peer session.', features:['1 × 45m peer call','Session recap notes','7‑day booking window'], accent:false },
  { id:'growth', name:'Growth', price:'$79', blurb:'Deep exploration + iterative clarity.', features:['3 × 45m peer calls','Priority matching','Profile positioning pointers','Email follow‑up (72h each)'], accent:true },
  { id:'strategy', name:'Strategy', price:'$149', blurb:'Structured pathway & shortlist direction.', features:['5 × 45m peer calls','Goal refinement framework','Country / program comparison matrix','Light shortlist feedback','Extended follow‑up (5 days)'], accent:false }
];

const faqs = [
  { q:'Who are the peers?', a:'Vetted current international students / recent grads matched by destination & discipline.' },
  { q:'How fast is matching?', a:'Usually under 24 hours; niche profiles may take a bit longer.' },
  { q:'Can I change mentor?', a:'Yes—one complimentary rematch with reason provided.' },
  { q:'Do peers edit SOP/essays?', a:'They give directional feedback only; drafting sits in Application Assistance.' }
];

const testimonials = [
  { name:'Ishika • CS Canada', text:'Gave me realistic insight on co‑ops & budgeting I never saw on blogs.' },
  { name:'Daniel • MS Germany', text:'Helped me choose between two programs with a clear ROI perspective.' },
  { name:'Fatima • UK Health', text:'Left with a concrete 6‑week prep checklist. Removed uncertainty.' }
];

const PeerCounsellingPage: React.FC = () => {
  const nav = useNavigate();
  const goContact = () => {
    nav('/contact');
    requestAnimationFrame(()=>document.querySelector('#contact')?.scrollIntoView({ behavior:'smooth'}));
  };
  return (
    <main className="peer-page">
      <section className="peer-hero">
        <div className="peer-hero__inner">
          <h1><span className="gradient-text">Peer Counselling</span> Connect With Current International Students</h1>
          <p className="peer-lead">Validate your plan, compare countries & programs, and avoid costly mistakes by speaking to students already living your next step.</p>
          <div className="peer-cta-group">
            <button className="btn btn-primary" onClick={goContact}>Book Session</button>
            <button className="btn btn-small" onClick={()=>nav('/services')}>All Services</button>
          </div>
          <div className="peer-stats">
            <div><strong>3k+</strong><span>Peer Sessions</span></div>
            <div><strong>40+</strong><span>Universities</span></div>
            <div><strong>32</strong><span>Countries</span></div>
          </div>
        </div>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Why It Works</h2>
        <div className="peer-grid">
          {valuePoints.map(v=>(
            <div key={v.title} className="peer-card">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Session Flow</h2>
        <ol className="peer-flow">
          {flow.map(f=>(
            <li key={f.step}>
              <div className="peer-flow__num">{f.step}</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Packages</h2>
        <div className="peer-packages">
          {packages.map(p=>(
            <div key={p.id} className={'peer-package'+(p.accent?' peer-package--accent':'')}>
              <h3>{p.name}</h3>
              <p className="peer-package__price">{p.price}<span>/one‑time</span></p>
              <p className="peer-package__blurb">{p.blurb}</p>
              <ul>
                {p.features.map(f=> <li key={f}>{f}</li>)}
              </ul>
              <button className="btn btn-primary btn-small" onClick={goContact}>Choose {p.name}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Real Outcomes</h2>
        <div className="peer-testimonials">
          {testimonials.map(t=>(
            <div key={t.name} className="peer-testimonial">
              <p>"{t.text}"</p>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">FAQs</h2>
        <div className="peer-faq">
          {faqs.map(f=>(
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="peer-section peer-final-cta">
        <h2>Ready To Talk To Someone Who’s Already There?</h2>
        <p>Book a peer session and turn uncertainty into a plan.</p>
        <button className="btn btn-primary" onClick={goContact}>Book Peer Counselling</button>
      </section>
    </main>
  );
};

export default PeerCounsellingPage;
