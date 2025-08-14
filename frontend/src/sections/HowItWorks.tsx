import React from 'react';
import { useReveal } from '../hooks/useReveal';

const steps = [
  { step: 1, title: 'Book Consultation', text: 'Share goals, background & timeline.' },
  { step: 2, title: 'Strategize & Shortlist', text: 'We tailor a smart application roadmap.' },
  { step: 3, title: 'Craft Applications', text: 'Documents, essays, forms & submissions.' },
  { step: 4, title: 'Secure Funding', text: 'Scholarship & assistantship guidance.' },
  { step: 5, title: 'Visa & Departure', text: 'Interview prep & relocation readiness.' },
  { step: 6, title: 'Ongoing Support', text: 'We stay with you till you start abroad.' }
];

export const HowItWorks: React.FC = () => {
  const ref = useReveal();
  return (
    <section className="section reveal" id="how-it-works" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">How It Works</h2>
        <ol className="steps">
          {steps.map(s => (
            <li key={s.step} className="step">
              <div className="step__number">{s.step}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
