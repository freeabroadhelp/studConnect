import React, { useEffect, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useApi } from '../hooks/useApi';

interface ApiUni { id:string; name:string; country:string; rank?:number|null }

const fallback = [
  { name: 'Harvard University', country: 'United States' },
  { name: 'University of Toronto', country: 'Canada' },
  { name: 'ETH Zurich', country: 'Switzerland' },
  { name: 'University of Melbourne', country: 'Australia' },
  { name: 'National University of Singapore', country: 'Singapore' },
  { name: 'University of Oxford', country: 'United Kingdom' }
];

export const FeaturedUniversities: React.FC = () => {
  const ref = useReveal();
  const api = useApi();
  const [unis,setUnis] = useState<typeof fallback>(fallback);
  useEffect(() => {
    api.get<{items:ApiUni[]}>('/catalog/universities?limit=6&sort=rank')
      .then(r => {
        if (r.items?.length) {
          setUnis(r.items.map(u => ({ name:u.name, country:u.country })));
        }
      })
      .catch(()=>{/* ignore, keep fallback */});
  }, []);
  return (
    <section className="section alt reveal" id="universities" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">Featured Universities</h2>
        <div className="uni__grid">
          {unis.map(u => (
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
