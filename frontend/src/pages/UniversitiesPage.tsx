import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import programsData from './programs.json';
import countriesData from './countries.json';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 200;

interface UniversityFull {
  id: string;
  name: string;
  country: string;
  url?: string;
  province?: string;
  thumbnail?: string;
  average_tuition?: string;
  average_tuition_currency?: string;
  logo?: string;
  type?: string;
  number_of_students?: string;
  international_students?: string;
  university_type?: string;
  number_of_academician?: string;
  erasmus?: string;
  scholarship_ratio?: string;
  urap_standings?: string;
  placement_rate?: string;
  technology_office?: string;
  student_academician?: string;
  entrepreneurship_index_score?: string;
  library_area?: string;
  ar_ge_expense?: string;
  programs?: string;
  features?: string;
  address?: string;
  thumbnail_r2?: string;
  logo_r2?: string;
}

interface ShortlistItem { university:string; country:string; tuition:number; programs:string[]; match_score:number }

function UniversitiesGlobe() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.13,
        transition: 'background 0.3s'
      }}
      className="dark:bg-[#0a1624]"
    >
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <mesh rotation={[0.3, 0.7, 0]}>
          <sphereGeometry args={[7, 64, 48]} />
          <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[0.2, 0.2, 0]}>
          <torusKnotGeometry args={[9, 0.22, 180, 16]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.15} metalness={0.8} transparent opacity={0.18} />
        </mesh>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

export const UniversitiesPage: React.FC = () => {
  const api = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const loadedRef = useRef(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [items,setItems] = useState<UniversityFull[]>([]);
  const [total,setTotal] = useState(0);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  const [search,setSearch] = useState('');
  const [country,setCountry] = useState('');
  // const [sort,setSort] = useState<'rank'|'name'|'updated'>('rank');
  // const [program,setProgram] = useState('');
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  // Detail modal
  const [detailId,setDetailId] = useState<string|null>(null);
  const [detail,setDetail] = useState<any>(null);
  const [detailLoading,setDetailLoading] = useState(false);

  const [refreshKey,setRefreshKey] = useState(0);

  // Use static JSON for programs and countries
  const [allPrograms] = useState<string[]>(
    Array.isArray(programsData)
      ? programsData
      : (programsData.program_names || [])
  );
  const [countryOptions] = useState<string[]>(
    Array.isArray(countriesData)
      ? countriesData
      : (countriesData.countries || [])
  );

  useEffect(() => {
    // Only fetch if not already loaded in this session and not a refresh
    if (loadedRef.current && location.action === 'POP' && !refreshKey) return;
    setLoading(true); setError(null);
    const params: Record<string, string|number> = {
      page: 1,
      page_size: MAX_PAGE_SIZE,
    };
    if (country) params.country = country;
    if (search) params.q = search;
    api.get<{items: UniversityFull[], total: number}>(
      '/api/universities/all?' + new URLSearchParams(params as any).toString()
    )
      .then(res => {
        setItems(res.items);
        setTotal(res.total);
        setShowCount(PAGE_SIZE);
        loadedRef.current = true;
        setHasFetched(true);
      })
      .catch(e => setError(e.message || 'Failed loading universities'))
      .finally(()=>setLoading(false));
  // eslint-disable-next-line
  }, [refreshKey, country, search]);

  const filteredItems = items;

  return (
    <main
      style={{
        background: 'var(--uni-bg, #f8fafc)',
        minHeight: '100vh',
        paddingBottom: '2rem',
        position: 'relative',
        zIndex: 1,
        transition: 'background 0.3s'
      }}
      className="dark:bg-[#0a1624]"
    >
      {/* 3D Globe background */}
      <UniversitiesGlobe />
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          marginTop: '2.5rem',
          borderRadius: '2.2rem',
          background: 'var(--uni-card-bg, #fff)',
          boxShadow: '0 8px 32px 0 rgba(31,41,55,0.10), 0 1.5px 8px 0 #c7d2fe',
          padding: '2.2rem 2.2rem 1.5rem 2.2rem',
          position: 'relative',
          zIndex: 2,
          transition: 'background 0.3s'
        }}
        className="dark:bg-[#162032] dark:text-slate-100"
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.2rem',
            gap: '1.5rem'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                margin: 0,
                letterSpacing: '-1px',
                color: 'var(--uni-title, #1e293b)',
                transition: 'color 0.3s'
              }}
              className="dark:text-white"
            >
              Universities
            </h1>
            <div
              style={{
                fontSize: '1.05rem',
                color: 'var(--uni-desc, #64748b)',
                marginTop: '.3rem',
                transition: 'color 0.3s'
              }}
              className="dark:text-slate-300"
            >
              Find and compare universities worldwide.
            </div>
          </div>
          <div style={{display:'flex', gap:'.9rem', flexWrap:'wrap', alignItems:'center'}}>
            <input
              placeholder="Search universities..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              aria-label="Search universities"
              style={{
                padding:'.7rem 1.1rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontSize:'1rem',
                minWidth:220,
                background:'#f8fafc'
              }}
            />
            <select value={country} onChange={e=>setCountry(e.target.value)}
              style={{
                padding:'.55rem 1.1rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:140,
                background:'#f8fafc'
              }}>
              <option value="">All Countries</option>
              {countryOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {/* <select value={sort} onChange={e=>setSort(e.target.value as any)}
              style={{
                padding:'.55rem 1.1rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:120,
                background:'#f8fafc'
              }}>
              <option value="rank">Sort by Rank</option>
              <option value="name">Sort by Name</option>
            </select> */}
            {/* <select value={program} onChange={e=>setProgram(e.target.value)}
              style={{
                padding:'.55rem .9rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:180,
                background:'#f8fafc'
              }}>
              <option value="">Any Program</option>
              {allPrograms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select> */}
            <button
              className="btn btn-small"
              type="button"
              onClick={()=> setRefreshKey(k=>k+1)}
              style={{
                background:'#e2e8f0',
                borderRadius:'8px',
                padding:'.6rem 1.2rem',
                fontWeight:600,
                border:'none'
              }}
            >Reload</button>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.7rem'
          }}
        >
          {loading && <div style={{gridColumn:'1/-1', textAlign:'center', color:'#64748b'}}>Loading universities...</div>}
          {error && <div style={{gridColumn:'1/-1', color:'#dc2626', textAlign:'center'}}>Error: {error}</div>}
          {!loading && !error && filteredItems.length===0 && (
            <div style={{gridColumn:'1/-1', textAlign:'center', color:'#64748b'}}>No universities found.</div>
          )}
          {!loading && !error && filteredItems.slice(0, showCount).map(u => (
            <div
              key={u.id}
              className="uni-card dark:bg-[#1e293b] dark:text-slate-100"
              role="article"
              aria-label={u.name}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.2rem 1.2rem 1.2rem 1.2rem',
                borderRadius: '18px',
                background: 'var(--uni-card-bg, rgba(255,255,255,0.85))',
                boxShadow: '0 2px 12px 0 #e5e7eb',
                border: '1px solid #e0e7ef',
                transition: 'box-shadow .18s, transform .18s, background 0.3s',
                minHeight: '180px',
                position: 'relative',
                zIndex: 2
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03) rotateY(3deg)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px 0 #2563eb, 0 2px 12px 0 #fbbf24';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px 0 #e5e7eb';
              }}
              onClick={() => navigate(`/universities/${u.id}`)}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 16,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 1px 8px #e0e7eb',
                  marginBottom: '1.1rem'
                }}
                className="dark:bg-[#334155]"
              >
                {u.logo_r2 || u.thumbnail_r2
                  ? <img src={u.logo_r2 || u.thumbnail_r2} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : <span style={{ fontSize: '2.2rem', color: '#888' }}>{u.name[0]}</span>
                }
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.13rem',
                  color: 'var(--uni-title, #1e293b)',
                  textAlign: 'center',
                  marginBottom: '.3rem',
                  letterSpacing: '-.5px',
                  transition: 'color 0.3s'
                }}
                className="dark:text-white"
              >
                {u.name}
              </div>
              <div
                style={{
                  fontSize: '.97rem',
                  color: '#2563eb',
                  textAlign: 'center'
                }}
                className="dark:text-blue-300"
              >
                {u.province ? `${u.province}, ` : ''}{u.country}
              </div>
            </div>
          ))}
        </div>
        {/* Show More Button */}
        {showCount < filteredItems.length && (
          <div style={{textAlign:'center', margin:'2.5rem 0 0 0'}}>
            <button
              className="btn btn-primary"
              style={{
                padding:'0.9rem 2.7rem',
                fontSize:'1.13rem',
                borderRadius:'12px',
                background:'#2563eb',
                color:'#fff',
                fontWeight:700,
                border:'none',
                boxShadow:'0 1px 8px #e0e7eb'
              }}
              onClick={() => setShowCount(c => Math.min(c + PAGE_SIZE, filteredItems.length))}
            >
              Show More
            </button>
          </div>
        )}
      </div>
      {/* Detail Modal */}
      <Modal open={!!detailId} onClose={()=>setDetailId(null)} title={detail?.name || 'University Details'}>
        {detailLoading && <div>Loading...</div>}
        {detail && (
          <div style={{display:'flex', flexDirection:'column', gap:'.7rem'}}>
            <div>
              <strong>{detail.name}</strong>
              <div style={{fontSize:'.8rem', opacity:.7}}>{detail.country}{detail.state_province ? `, ${detail.state_province}` : ''}</div>
              {detail.website && (
                <div style={{marginTop:'.3rem'}}>
                  <a href={detail.website.startsWith('http') ? detail.website : `https://${detail.website}`} target="_blank" rel="noopener noreferrer">
                    {detail.website}
                  </a>
                </div>
              )}
            </div>
            {detail.rankings && detail.rankings.length > 0 && (
              <div>
                <strong>Rankings:</strong>
                <ul style={{margin:'.3rem 0 0', paddingLeft:'1.1rem', fontSize:'.9em'}}>
                  {detail.rankings.map((r:any) => (
                    <li key={r.provider+r.year}>{r.provider} {r.year}: #{r.world_rank}</li>
                  ))}
                </ul>
              </div>
            )}
            {detail.programs && detail.programs.length > 0 && (
              <div>
                <strong>Programs:</strong>
                <ul style={{margin:'.3rem 0 0', paddingLeft:'1.1rem', fontSize:'.9em'}}>
                  {detail.programs.map((p:any) => (
                    <li key={p.id}>
                      {p.name} ({p.level}) {p.discipline && `- ${p.discipline}`} {p.annual_fee && `- $${p.annual_fee} ${p.currency || ''}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {detail.images && detail.images.length > 0 && (
              <div>
                <strong>Images:</strong>
                <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap', marginTop:'.3rem'}}>
                  {detail.images.map((img:any) =>
                    img.r2_key
                      ? <img key={img.r2_key} src={img.r2_key} alt={detail.name} style={{width:48, height:48, borderRadius:8}} />
                      : null
                  )}
                </div>
              </div>
            )}
            {detail.extra && (
              <details>
                <summary>Raw Data</summary>
                <pre style={{fontSize:'.7em', background:'#f5f7fb', padding:'.7em', borderRadius:'8px', overflow:'auto'}}>{JSON.stringify(detail.extra, null, 2)}</pre>
              </details>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
};