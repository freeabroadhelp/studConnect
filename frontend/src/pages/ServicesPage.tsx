import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';
import { useAuth } from '../context/AuthContext';

interface Service { code:string; name:string; category:string; description:string }

const categoryLabels: Record<string,string> = {
  counselling:'Counselling', planning:'Planning', application:'Application', compliance:'Compliance', funding:'Funding'
};

export const ServicesPage: React.FC = () => {
  const { token } = useAuth(); // reserved for future booking action
  const api = useApi(token);
  const [data,setData] = useState<Service[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [category,setCategory] = useState('');
  const [selected,setSelected] = useState<Service | null>(null);

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
      <p>Choose the right level of support across every stage of your study abroad journey.</p>
      <div className="chips" style={{marginTop:'1.25rem'}}>
        <button className={`chip ${!category?'chip--active':''}`} onClick={()=>setCategory('')}>All</button>
        {categories.map(c => (
          <button key={c} className={`chip ${category===c?'chip--active':''}`} onClick={()=>setCategory(c)}>{categoryLabels[c] || c}</button>
        ))}
      </div>
      {loading && <div style={{marginTop:'2rem'}}>Loading services...</div>}
      {error && <div style={{marginTop:'2rem', color:'#dc2626'}}>Error: {error}</div>}
      {!loading && !error && (
        <div className="grid services__grid" style={{marginTop:'1.5rem'}}>
          {data.map(s => (
            <div key={s.code} className="card service" onClick={()=>setSelected(s)} style={{cursor:'pointer'}}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <span style={{fontSize:'.6rem', textTransform:'uppercase', letterSpacing:'1px', opacity:.65}}>{categoryLabels[s.category] || s.category}</span>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name}>
        <p style={{marginTop:0}}>{selected?.description}</p>
        <p style={{fontSize:'.7rem', letterSpacing:'1px', textTransform:'uppercase', opacity:.6}}>Category: {selected ? categoryLabels[selected.category] || selected.category : ''}</p>
      </Modal>
    </main>
  );
};
