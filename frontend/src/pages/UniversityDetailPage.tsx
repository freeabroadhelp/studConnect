import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useParams, Link } from 'react-router-dom';

export const UniversityDetailPage: React.FC = () => {
  const api = useApi();
  const { id } = useParams<{ id: string }>();
  const [uni, setUni] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    api.get(`/api/universities/${id}`)
      .then(setUni)
      .catch(e => setError(e.message || 'Failed to load university'))
      .finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div style={{padding:'2rem'}}>Loading...</div>;
  if (error) return <div style={{padding:'2rem', color:'#dc2626'}}>Error: {error}</div>;
  if (!uni) return <div style={{padding:'2rem'}}>Not found.</div>;

  return (
    <main style={{maxWidth:700, margin:'2rem auto', background:'#fff', borderRadius:12, padding:'2rem'}}>
      <Link to="/universities" style={{fontSize:'.9rem', color:'#2563eb'}}>&larr; Back to list</Link>
      <h1 style={{marginTop:'1rem'}}>{uni.name}</h1>
      <div style={{display:'flex', gap:'1.5rem', alignItems:'center', margin:'1rem 0'}}>
        {uni.thumbnail_r2 && <img src={uni.thumbnail_r2} alt={uni.name} style={{width:90, height:90, borderRadius:16, objectFit:'cover'}} />}
        <div>
          <div><strong>Country:</strong> {uni.country}{uni.province ? `, ${uni.province}` : ''}</div>
          <div><strong>Type:</strong> {uni.type}</div>
          <div><strong>Tuition:</strong> {uni.average_tuition} {uni.average_tuition_currency}</div>
        </div>
      </div>
      <div style={{margin:'1rem 0'}}>
        <strong>Programs:</strong>
        <div style={{whiteSpace:'pre-wrap', fontSize:'.95em', marginTop:'.3rem'}}>{uni.programs}</div>
      </div>
      <div style={{margin:'1rem 0'}}>
        <strong>Features:</strong>
        <div style={{whiteSpace:'pre-wrap', fontSize:'.95em', marginTop:'.3rem'}}>{uni.features}</div>
      </div>
      <div style={{margin:'1rem 0'}}>
        <strong>Address:</strong>
        <div>{uni.address}</div>
      </div>
      <div style={{margin:'1rem 0'}}>
        <strong>Other Details:</strong>
        <pre style={{background:'#f5f7fb', padding:'.7em', borderRadius:'8px', fontSize:'.9em', overflow:'auto'}}>
          {JSON.stringify(uni, null, 2)}
        </pre>
      </div>
    </main>
  );
};
