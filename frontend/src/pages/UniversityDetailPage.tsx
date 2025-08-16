import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useParams, Link } from 'react-router-dom';

function parseJSONField(field: string | null | undefined) {
  if (!field) return [];
  try {
    const cleaned = typeof field === 'string' && field.startsWith('"') && field.endsWith('"')
      ? JSON.parse(field)
      : field;
    return typeof cleaned === 'string' ? JSON.parse(cleaned) : cleaned;
  } catch {
    return [];
  }
}

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

  const features: string[] = parseJSONField(uni.features);
  const programs: any[] = parseJSONField(uni.programs);

  return (
    <main style={{background: '#f8fafc', minHeight: '100vh', paddingBottom: '2rem'}}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        marginTop: '2.5rem',
        borderRadius: '2.2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.13), 0 1.5px 8px 0 #c7d2fe',
        background: '#fff',
        padding: '0',
        position: 'relative',
        overflow: 'visible'
      }}>
        {/* Banner */}
        <div style={{
          width: '100%',
          height: 220,
          background: uni.thumbnail_r2 ? `url(${uni.thumbnail_r2}) center/cover no-repeat` : '#e0e7ff',
          borderTopLeftRadius: '2.2rem',
          borderTopRightRadius: '2.2rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            borderTopLeftRadius: '2.2rem',
            borderTopRightRadius: '2.2rem',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0, left: 0
          }} />
          <div style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2.2rem 2.7rem 1.2rem 2.7rem',
            width: '100%'
          }}>
            <div style={{
              width: 110,
              height: 110,
              borderRadius: '18px',
              background: '#fff',
              boxShadow: '0 2px 16px #e0e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginRight: '2.2rem'
            }}>
              {uni.logo_r2
                ? <img src={uni.logo_r2} alt={uni.name} style={{width: '90%', height: '90%', objectFit: 'contain'}} />
                : <span style={{fontSize:'2.5rem', color:'#888'}}>{uni.name[0]}</span>
              }
            </div>
            <div>
              <div style={{
                fontWeight: 800,
                fontSize: '2.1rem',
                marginBottom: '.2rem',
                letterSpacing: '-1px',
                color: '#1e293b'
              }}>{uni.name}</div>
              <div style={{display:'flex', gap:'1.2rem', flexWrap:'wrap', alignItems:'center', marginBottom:'.2rem'}}>
                {uni.type && <span style={{
                  background:'#f1f5f9',
                  borderRadius:'8px',
                  padding:'.3rem .8rem',
                  fontSize:'.97rem',
                  fontWeight:500
                }}>{uni.type}</span>}
                {uni.urap_standings && !isNaN(Number(uni.urap_standings)) && (
                  <span style={{
                    background:'#e0e7ff',
                    color:'#3730a3',
                    borderRadius:'8px',
                    padding:'.3rem .8rem',
                    fontSize:'.97rem',
                    fontWeight:600
                  }}>
                    World Rank: #{uni.urap_standings}
                  </span>
                )}
                {uni.average_tuition && (
                  <span style={{
                    background:'#fef9c3',
                    color:'#b45309',
                    borderRadius:'8px',
                    padding:'.3rem .8rem',
                    fontSize:'.97rem',
                    fontWeight:500
                  }}>
                    Average Tuition Fees: {uni.average_tuition} {uni.average_tuition_currency}
                  </span>
                )}
              </div>
              <div style={{
                fontSize: '1.1rem',
                color: '#334155',
                fontWeight: 600,
                marginBottom: '.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '.7rem'
              }}>
                <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2" style={{marginRight:'.2rem'}}><circle cx="11" cy="11" r="10" stroke="#2563eb" strokeWidth="2"/><circle cx="11" cy="11" r="3" fill="#2563eb"/></svg>
                {uni.address}
              </div>
              <div style={{fontSize:'.97rem', color:'#2563eb', fontWeight:600}}>
                {uni.country}{uni.province ? `, ${uni.province}` : ''}
              </div>
              {uni.url && (
                <a href={uni.url.startsWith('http') ? uni.url : `https://${uni.url}`} target="_blank" rel="noopener noreferrer"
                  style={{
                    color:'#2563eb',
                    fontWeight:600,
                    fontSize:'1.05rem',
                    textDecoration:'underline',
                    marginTop:'.5rem',
                    display:'inline-block'
                  }}>
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div style={{
          display:'flex',
          gap:'2.5rem',
          padding:'1.2rem 2.7rem 0 2.7rem',
          borderBottom:'1px solid #e5e7eb',
          background:'#fff',
          borderTopLeftRadius:0,
          borderTopRightRadius:0
        }}>
          <Link to="/universities" style={{color:'#2563eb', fontWeight:500, fontSize:'.97rem', textDecoration:'none'}}>&larr; All Universities</Link>
        </div>
        {/* Main Content */}
        <div style={{
          display:'flex',
          flexWrap:'wrap',
          gap:'2.5rem',
          padding:'2.2rem 2.7rem 2.2rem 2.7rem',
          justifyContent: 'space-between', // <-- spread children evenly
        }}>
          {/* Left: Features & Stats */}
          <div style={{
            flex: '1 1 340px',
            minWidth: 320,
            margin: '0 auto'
          }}>
            {/* Features */}
            {features && features.length > 0 && (
              <div style={{marginBottom:'2rem'}}>
                <div style={{fontWeight:700, fontSize:'1.13rem', marginBottom:'.5rem', color:'#1e293b'}}>Campus Features</div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'.5rem'}}>
                  {features.map((f, i) => (
                    <span key={i} style={{
                      background: 'linear-gradient(90deg, #e0e7ff 60%, #f1f5f9 100%)',
                      color: '#3730a3',
                      borderRadius: '8px',
                      padding: '.32rem .85rem',
                      fontSize: '.97rem',
                      fontWeight: 500,
                      boxShadow: '0 1px 4px #e0e7eb'
                    }}>{f}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Stats */}
            <div style={{
              background:'#f9fafb',
              borderRadius:'12px',
              padding:'1.2rem 1.2rem .7rem 1.2rem',
              marginBottom:'2rem',
              boxShadow:'0 1px 6px #e5e7eb'
            }}>
              <div style={{fontWeight:700, fontSize:'1.13rem', marginBottom:'.7rem', color:'#1e293b'}}>Quick Facts</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'.7rem'}}>
                <div><b>Type:</b> {uni.university_type || uni.type || 'N/A'}</div>
                <div><b>Students:</b> {uni.number_of_students || 'N/A'}</div>
                <div><b>International Students:</b> {uni.international_students || 'N/A'}</div>
                <div><b>Scholarship Ratio:</b> {uni.scholarship_ratio || 'N/A'}</div>
                <div><b>Placement Rate:</b> {uni.placement_rate || 'N/A'}</div>
                <div><b>Technology Office:</b> {uni.technology_office || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Section: Raw Data */}
        <details style={{margin:'2.2rem 2.7rem 0 2.7rem'}}>
          <summary style={{cursor:'pointer', fontWeight:600, fontSize:'.97rem'}}>Show Raw Data</summary>
          <pre style={{fontSize:'.85em', background:'#f5f7fb', padding:'.7em', borderRadius:'8px', overflow:'auto', marginTop:'.7rem'}}>{JSON.stringify(uni, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
};

