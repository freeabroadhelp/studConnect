import React from 'react';
import { useReveal } from '../hooks/useReveal';

const universities = [
  { name: 'Harvard', country: 'USA' },
  { name: 'University of Toronto', country: 'Canada' },
  { name: 'ETH Zurich', country: 'Switzerland' },
  { name: 'University of Melbourne', country: 'Australia' },
  { name: 'National University of Singapore', country: 'Singapore' },
  { name: 'Oxford', country: 'UK' }
];

export const FeaturedUniversities: React.FC = () => {
  const ref = useReveal();
  return (
    <section className="section alt reveal" id="universities" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">Featured Universities</h2>
        <div className="uni__grid">
          {universities.map(u => (
            <div key={u.name} className="uni__item">
              <h3>{u.name}</h3>
              <span>{u.country}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
