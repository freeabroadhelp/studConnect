import React from 'react';
import { useReveal } from '../hooks/useReveal';

const testimonials = [
  { name: 'Aarav', result: 'Admitted to UC Berkeley (MS CS) with scholarship', text: 'Their structured approach & essay reviews helped me stand out in a competitive pool.' },
  { name: 'Meera', result: 'Secured full tuition in Germany', text: 'Clear guidance on DAAD & timely document prep made it possible.' },
  { name: 'Yusuf', result: 'Visa Approved & Scholarship', text: 'They simplified everything: SOP, LORs, funding & mock visa interviews.' }
];

export const Testimonials: React.FC = () => {
  const ref = useReveal();
  return (
    <section className="section alt reveal" id="testimonials" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">Success Stories</h2>
        <div className="testimonials__grid">
          {testimonials.map(t => (
            <div key={t.name} className="testimonial card">
              <p className="testimonial__text">“{t.text}”</p>
              <div className="testimonial__meta">
                <strong>{t.name}</strong>
                <span>{t.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
