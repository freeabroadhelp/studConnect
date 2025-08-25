import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Service { code:string; name:string; category:string; description:string }

const categoryLabels: Record<string,string> = {
  counselling:'Counselling', planning:'Planning', application:'Application', compliance:'Compliance', funding:'Funding'
};

// Define all unique services as per requirements
const services = [
  {
    code: 'peer-counselling',
    name: 'Main Counsellor Counselling & Peer Counselling',
    desc: 'Talk to experienced counsellors and real international students for authentic guidance.',
    path: '/services/peer-counselling'
  },
  {
    code: 'university-representative',
    name: 'University Representative Counselling',
    desc: 'Official sessions with university representatives for program clarity.',
    path: '/services/university-representative'
  },
  {
    code: 'accommodation-assistance',
    name: 'Accommodation Assistance',
    desc: 'Find and secure student accommodation in your destination country.',
    path: '/services/accommodation-assistance'
  },
  {
    code: 'airport-pickup',
    name: 'Airport Pickup',
    desc: 'Book airport pickup and arrival support for a smooth landing.',
    path: '/services/airport-pickup'
  },
  {
    code: 'financial',
    name: 'Financial Services / Education Loans',
    desc: 'Get help with education loans, scholarships, and funding options.',
    path: '/financial-services'
  }
];

export const ServicesPage: React.FC = () => {
  const { token } = useAuth();
  const api = useApi(token);
  const [data,setData] = useState<Service[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [category,setCategory] = useState('');
  const [selected,setSelected] = useState<Service | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true); setError(null);
    api.get<Service[]>(`/services${category?`?category=${category}`:''}`)
      .then(setData)
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  }, [category]);

  const categories = useMemo(() => Array.from(new Set(data.map(s=>s.category))), [data]);

  return (
    <main className="page container">
      <h1>Services</h1>
      <p>Explore our full range of support for your study abroad journey.</p>
      <div className="grid services__grid" style={{marginTop:'2rem'}}>
        {services.map(s => (
          <div
            key={s.code}
            className="card service"
            style={{cursor:'pointer'}}
            onClick={()=>nav(s.path)}
            role="button"
            aria-label={s.name}
          >
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
};
