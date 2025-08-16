import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import programsData from './programs.json';
import countriesData from './countries.json';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Use http, not https, for local dev
const PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 200;

interface UniversityFull {
  id: number;
  name: string;
  state?: string;
  country?: string;
  location?: string | null;
  type?: string;
  networks?: string | null;
  established?: number;
  latest_rankings?: any;
  official_website?: string;
  official_email?: string;
  popular_for_international_students?: string[];
  levels_offered?: string[];
  intakes?: string[];
  mode_of_study?: string[];
  scholarships_highlight?: string[];
  tuition_fees_per_year?: any;
  living_costs_annual_aud?: number;
  application_fee_range_aud?: string;
  international_student_support?: string[];
  campus_life?: any;
  admission_requirements?: any;
  why_choose?: string[];
  logo_r2?: string | null;
  thumbnail_r2?: string | null;
  thumbnail_url?: string | null;
  logo_url?: string | null;
  // ...other fields as needed...
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

// Update API endpoint and thumbnail/logo usage
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
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  const [detailId,setDetailId] = useState<string|null>(null);

  const [refreshKey,setRefreshKey] = useState(0);

  // Remove static countryOptions and allPrograms
  // const [allPrograms] = useState<string[]>(...);
  // const [countryOptions] = useState<string[]>(...);

  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [allPrograms, setAllPrograms] = useState<string[]>([]);
  const [currencyOptions, setCurrencyOptions] = useState<string[]>([]);
  const [minFee, setMinFee] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(0);

  // Fetch all universities once to extract unique countries and programs
  useEffect(() => {
    fetch(`${BASE_URL}/api/universities/all?page=1&page_size=200`)
      .then(res => res.json())
      .then(res => {
        const items = res.items || [];
        // Unique countries
        const countriesSet = new Set<string>();
        // Unique programs
        const programsSet = new Set<string>();
        const currencySet = new Set<string>();
        let minFeeVal = Number.POSITIVE_INFINITY;
        let maxFeeVal = Number.NEGATIVE_INFINITY;

        items.forEach((u: any) => {
          if (u.country) countriesSet.add(u.country);
          if (Array.isArray(u.popular_for_international_students)) {
            u.popular_for_international_students.forEach((p: string) => programsSet.add(p));
          }
          // Tuition fee extraction (AUD, USD, etc.)
          if (u.tuition_fees_per_year && typeof u.tuition_fees_per_year === 'object') {
            Object.entries(u.tuition_fees_per_year).forEach(([key, val]) => {
              // Try to extract currency from key, e.g., UG_AUD, PG_USD
              const match = key.match(/_([A-Z]{3})$/);
              if (match) currencySet.add(match[1]);
              // Try to extract min/max from value string, e.g., "30,000-50,000 (typical)"
              if (typeof val === 'string') {
                const feeMatch = val.replace(/,/g, '').match(/(\d{4,6})\s*-\s*(\d{4,6})/);
                if (feeMatch) {
                  const min = parseInt(feeMatch[1], 10);
                  const max = parseInt(feeMatch[2], 10);
                  if (!isNaN(min) && min < minFeeVal) minFeeVal = min;
                  if (!isNaN(max) && max > maxFeeVal) maxFeeVal = max;
                } else {
                  // If only one value, treat as both min and max
                  const singleFee = val.replace(/,/g, '').match(/(\d{4,6})/);
                  if (singleFee) {
                    const fee = parseInt(singleFee[1], 10);
                    if (!isNaN(fee)) {
                      if (fee < minFeeVal) minFeeVal = fee;
                      if (fee > maxFeeVal) maxFeeVal = fee;
                    }
                  }
                }
              }
            });
          }
        });
        setCountryOptions(Array.from(countriesSet).sort());
        setAllPrograms(Array.from(programsSet).sort());
        setCurrencyOptions(Array.from(currencySet).sort());
        setMinFee(isFinite(minFeeVal) ? minFeeVal : 0);
        setMaxFee(isFinite(maxFeeVal) ? maxFeeVal : 0);
      });
  }, []);

  // Add filter state
  const [programType, setProgramType] = useState('');
  const [tuitionMin, setTuitionMin] = useState('');
  const [tuitionMax, setTuitionMax] = useState('');
  const [currencyType, setCurrencyType] = useState('');

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
    if (programType) params.program = programType;
    if (tuitionMin) params.tuition_min = tuitionMin;
    if (tuitionMax) params.tuition_max = tuitionMax;
    if (currencyType) params.currency = currencyType;
    fetch(`${BASE_URL}/api/universities/all?${new URLSearchParams(params as any).toString()}`)
      .then(res => res.json())
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
  }, [refreshKey, country, search, programType, tuitionMin, tuitionMax, currencyType]);

  const filteredItems = items;

  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      setDetailLoading(false);
      return;
    }
    setDetailLoading(true);
    fetch(`/api/universities/${detailId}`)
      .then(res => res.json())
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [detailId]);

  return (
    <main style={{background:'#f8fafc', minHeight:'100vh', paddingBottom:'2rem', position:'relative', zIndex:1}}>
      {/* 3D Globe background */}
      <UniversitiesGlobe />
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        marginTop: '2.5rem',
        borderRadius: '2.2rem',
        background: '#fff',
        boxShadow: '0 8px 32px 0 rgba(31,41,55,0.10), 0 1.5px 8px 0 #c7d2fe',
        padding: '2.2rem 2.2rem 1.5rem 2.2rem',
        position: 'relative',
        zIndex: 2
      }}>
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
            <select value={programType} onChange={e=>setProgramType(e.target.value)}
              style={{
                padding:'.55rem 1.1rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:120,
                background:'#f8fafc'
              }}>
              <option value="">Any Program Type</option>
              {allPrograms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select value={currencyType} onChange={e=>setCurrencyType(e.target.value)}
              style={{
                padding:'.55rem 1.1rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:100,
                background:'#f8fafc'
              }}>
              <option value="">Any Currency</option>
              {currencyOptions.map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder={`Min Tuition (${currencyType || (currencyOptions[0] || 'AUD')})`}
              min={minFee}
              max={maxFee}
              value={tuitionMin}
              onChange={e=>setTuitionMin(e.target.value)}
              style={{
                padding:'.55rem .9rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:100,
                background:'#f8fafc'
              }}
            />
            <input
              type="number"
              placeholder={`Max Tuition (${currencyType || (currencyOptions[0] || 'AUD')})`}
              min={minFee}
              max={maxFee}
              value={tuitionMax}
              onChange={e=>setTuitionMax(e.target.value)}
              style={{
                padding:'.55rem .9rem',
                borderRadius:'10px',
                border:'1px solid #e5e7eb',
                fontWeight:500,
                minWidth:100,
                background:'#f8fafc'
              }}
            />
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
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',
          gap:'1.7rem'
        }}>
          {loading && <div style={{gridColumn:'1/-1', textAlign:'center', color:'#64748b'}}>Loading universities...</div>}
          {error && <div style={{gridColumn:'1/-1', color:'#dc2626', textAlign:'center'}}>Error: {error}</div>}
          {!loading && !error && filteredItems.length===0 && (
            <div style={{gridColumn:'1/-1', textAlign:'center', color:'#64748b'}}>No universities found.</div>
          )}
          {!loading && !error && filteredItems.slice(0, showCount).map(u => (
            <div
              key={u.id}
              className="uni-card"
              role="article"
              aria-label={u.name}
              style={{
                cursor:'pointer',
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                padding:'1.2rem 1.2rem 1.2rem 1.2rem',
                borderRadius:'18px',
                background:'rgba(255,255,255,0.85)',
                boxShadow:'0 2px 12px 0 #e5e7eb',
                border:'1px solid #e0e7ef',
                transition:'box-shadow .18s, transform .18s',
                minHeight: '180px',
                position:'relative',
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
              onClick={()=>navigate(`/universityDetailPage/${u.id}`)}
            >
              <div style={{
                width:96, height:96, borderRadius:16, background:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'0 1px 8px #e0e7eb', marginBottom:'1.1rem'
              }}>
                {u.logo_url || u.logo_r2
                  ? <img src={u.logo_url || u.logo_r2 || ''} alt={u.name} style={{width:'100%', height:'100%', objectFit:'contain'}} />
                  : <span style={{fontSize:'2.2rem', color:'#888'}}>{u.name[0]}</span>
                }
              </div>
              <div style={{
                fontWeight:800,
                fontSize:'1.13rem',
                color:'#1e293b',
                textAlign:'center',
                marginBottom:'.3rem',
                letterSpacing:'-.5px'
              }}>{u.name}</div>
              <div style={{
                fontSize:'.97rem',
                color:'#2563eb',
                textAlign:'center'
              }}>
                {u.state}, {u.country}
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