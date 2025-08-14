import React from 'react';
import { useReveal } from '../hooks/useReveal';

const services = [
  { title: 'Profile Evaluation', desc: 'Assess academics, test scores & goals to craft a target list.' },
  { title: 'University Shortlisting', desc: 'Data-driven curation of reach, match & safe universities.' },
  { title: 'Application Strategy', desc: 'Timeline planning, document guidance & differentiation.' },
  { title: 'SOP & Essays', desc: 'Brainstorming, structuring, reviewing & polishing narratives.' },
  { title: 'Scholarships & Funding', desc: 'Identify & apply for grants, assistantships & aid.' },
  { title: 'Visa & Pre-Departure', desc: 'Interview prep, documentation & relocation readiness.' }
];

export const Services: React.FC = () => {
  const ref = useReveal();
  return (
    <section className="section reveal" id="services" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">Services</h2>
        <div className="grid services__grid">
          {services.map(s => (
            <div key={s.title} className="card service">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
