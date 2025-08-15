import React, { useState, useEffect, FormEvent } from 'react';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';

const PAGE_SIZE = 20;
const COUNTRY_FILTERS = [
  'United States','Canada','United Kingdom','Germany','France','Australia','Singapore','India','Netherlands','Sweden'
];

interface CatalogUni {
  id: string;
  name: string;
  country: string;
  website?: string;
  rank?: number | null;
}

interface CatalogListResponse {
  items: CatalogUni[];
  page: number;
  limit: number;
  total: number;
}

interface CatalogDetail {
  id: string;
  name: string;
  country: string;
  website?: string;
  domains?: string[];
  state_province?: string;
  rankings?: {provider:string; year:number; world_rank:number}[];
  programs?: {id:number; name:string; discipline:string; level:string; annual_fee:number; currency:string}[];
  images?: {kind:string; original_url:string; r2_key:string}[];
  extra?: any;
}

interface ShortlistItem { university:string; country:string; tuition:number; programs:string[]; match_score:number }

export const UniversitiesPage: React.FC = () => {
  const api = useApi();
  const [items,setItems] = useState<CatalogUni[]>([]);
  const [total,setTotal] = useState(0);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string|null>(null);

  // Filters
  const [search,setSearch] = useState('');
  const [country,setCountry] = useState('');
  const [sort,setSort] = useState<'rank'|'name'|'updated'>('rank');
  const [page,setPage] = useState(1);

  // Program filter (client-side)
  const [program,setProgram] = useState('');
  const [allPrograms,setAllPrograms] = useState<string[]>([]);

  // Shortlist modal
  const [shortlistOpen,setShortlistOpen] = useState(false);
  const [prefs,setPrefs] = useState({ country:'', budget:'', program:'' });
  const [shortlist,setShortlist] = useState<ShortlistItem[]|null>(null);
  const [shortlistLoading,setShortlistLoading] = useState(false);
  const [shortlistError,setShortlistError] = useState<string|null>(null);

  // Detail modal
  const [detailId,setDetailId] = useState<string|null>(null);
  const [detail,setDetail] = useState<CatalogDetail|null>(null);
  const [detailLoading,setDetailLoading] = useState(false);

  const [refreshKey,setRefreshKey] = useState(0);

  // Fetch catalog list
  useEffect(() => {
    setLoading(true); setError(null);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    params.set('sort', sort);
    if (country) params.set('country', country);
    if (search) params.set('q', search);
    api.get<CatalogListResponse>(`/catalog/universities?${params.toString()}`)
      .then(res => {
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(e => setError(e.message || 'Failed loading universities'))
      .finally(()=>setLoading(false));
  }, [country, search, page, sort, refreshKey]);

  // Fetch all programs for filter (client-side, from details of first 30 unis on page)
  useEffect(() => {
    if (!items.length) { setAllPrograms([]); return; }
    let cancelled = false;
    Promise.all(
      items.slice(0, 30).map(u =>
        api.get<CatalogDetail>(`/catalog/universities/${u.id}`).catch(()=>null)
      )
    ).then(details => {
      if (cancelled) return;
      const set = new Set<string>();
      details.forEach(d => d?.programs?.forEach(p => set.add(p.discipline || p.name)));
      setAllPrograms(Array.from(set).filter(Boolean).sort());
    });
    return () => { cancelled = true; };
  }, [items]);

  // Reset page when filters change
  useEffect(()=>{ setPage(1); }, [country, search, sort]);

  // Program filter (client-side)
  const filteredItems = program
    ? items.filter(u => u.id && u.name && u.country) // only valid
        .filter(u => {
          // naive: fetch detail for each, but for perf, just filter by name match
          return u.name.toLowerCase().includes(program.toLowerCase());
        })
    : items;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  async function generateShortlist(e:FormEvent){
    e.preventDefault();
    setShortlistError(null); setShortlistLoading(true); setShortlist(null);
    try {
      const result = await api.post<ShortlistItem[]>('/shortlist', {
        country: prefs.country || null,
        budget: prefs.budget ? Number(prefs.budget) : null,
        program: prefs.program || null
      });
      setShortlist(result);
    } catch (err:any){
      setShortlistError(err.message || 'Failed generating shortlist');
    } finally {
      setShortlistLoading(false);
    }
  }

  // Detail modal fetch
  useEffect(() => {
    if (!detailId) { setDetail(null); return; }
    setDetailLoading(true);
    api.get<CatalogDetail>(`/catalog/universities/${detailId}`)
      .then(setDetail)
      .catch(()=>setDetail(null))
      .finally(()=>setDetailLoading(false));
  }, [detailId]);

  return (
    <main className="universities-page">
      <div className="universities-page__header">
        <h1 className="gradient-text" style={{margin:0}}>Universities</h1>
        <div className="uni-toolbar">
          <div className="uni-search">
            <input
              placeholder="Search universities..."
              value={search}
              onChange={e=>setSearch(e.target.value)}
              aria-label="Search universities"
            />
          </div>
          <div className="uni-filters" role="group" aria-label="Country filter">
            <button className={!country ? 'uni-filter--active' : ''} onClick={()=>setCountry('')}>All</button>
            {COUNTRY_FILTERS.map(c=>(
              <button
                key={c}
                className={country===c?'uni-filter--active':''}
                onClick={()=>setCountry(c)}
              >{c}</button>
            ))}
          </div>
          <div className="uni-sort">
            <span>Sort</span>
            <select value={sort} onChange={e=>setSort(e.target.value as any)} aria-label="Sort universities">
              <option value="rank">Rank</option>
              <option value="name">Name A–Z</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>
        </div>
        <div style={{display:'flex', flexWrap:'wrap', gap:'.6rem', marginTop:'.7rem'}}>
          <select value={program} onChange={e=>setProgram(e.target.value)} style={{padding:'.55rem .7rem', borderRadius:'10px', border:'1px solid var(--border)'}}>
            <option value="">Any Program</option>
            {allPrograms.map(p=> <option key={p}>{p}</option>)}
          </select>
          <button className="btn btn-small" type="button" onClick={()=>setShortlistOpen(true)}>Shortlist</button>
          <button
            className="btn btn-small"
            type="button"
            onClick={()=> setRefreshKey(k=>k+1)}
            style={{background:'#e2e8f0'}}
          >Reload</button>
        </div>
      </div>

      {loading && <div className="uni-empty">Loading universities...</div>}
      {error && <div className="uni-empty" style={{color:'#dc2626'}}>Error: {error}</div>}
      {!loading && !error && filteredItems.length===0 && (
        <div className="uni-empty">
          No universities found.<br />
          <button
            style={{marginTop:'1rem'}}
            className="btn btn-small"
            type="button"
            onClick={()=> {
              const params = new URLSearchParams({ page:'1', limit:String(PAGE_SIZE), sort:'rank', seed_if_empty:'true' });
              api.get<CatalogListResponse>(`/catalog/universities?${params.toString()}`)
                .then(r=> { setItems(r.items); setTotal(r.total); if(!r.items.length) alert('Seeding may have failed. Check backend logs.'); })
                .catch(()=>{})
                .finally(()=> setRefreshKey(k=>k+1));
            }}
          >Seed & Retry</button>
          <span style={{fontSize:'.6rem',display:'block',marginTop:'.75rem'}}>
            Ensure backend env FULL_AUTO_SEED=1 or run manual ingestion endpoints.
          </span>
        </div>
      )}

      {!loading && !error && filteredItems.length>0 && (
        <div className="unilist">
          {filteredItems.map(u => {
            const acronym = u.name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
            return (
              <div key={u.id} className="uni-card" role="article" aria-label={u.name}>
                {typeof u.rank === 'number' && <div className="uni-rank-badge"><span>#{u.rank}</span></div>}
                <div className="uni-head">
                  <div className="uni-logo" aria-hidden>{acronym}</div>
                  <div>
                    <h3 className="uni-name">{u.name}</h3>
                    <p className="uni-location">{u.country}</p>
                  </div>
                </div>
                <div style={{fontSize:'.55rem', letterSpacing:'.6px', opacity:.6}}>
                  ID: {u.id.slice(0,8)}
                </div>
                <div className="uni-actions">
                  <button className="btn btn-small" type="button" onClick={()=>setShortlistOpen(true)}>Shortlist</button>
                  <button className="btn btn-small" type="button" onClick={()=>setDetailId(u.id)}>View Details</button>
                  {u.website && (
                    <a
                      className="btn btn-small"
                      href={u.website.startsWith('http') ? u.website : `https://${u.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >Visit</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && totalPages>1 && (
        <div className="universities-page__paging" aria-label="Pagination">
          {Array.from({length: totalPages}, (_,i)=>i+1).map(p=>(
            <button
              key={p}
              className={p===page?'page--active':''}
              onClick={()=>setPage(p)}
              aria-current={p===page}
            >{p}</button>
          ))}
        </div>
      )}

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
                  {detail.rankings.map(r => (
                    <li key={r.provider+r.year}>{r.provider} {r.year}: #{r.world_rank}</li>
                  ))}
                </ul>
              </div>
            )}
            {detail.programs && detail.programs.length > 0 && (
              <div>
                <strong>Programs:</strong>
                <ul style={{margin:'.3rem 0 0', paddingLeft:'1.1rem', fontSize:'.9em'}}>
                  {detail.programs.map(p => (
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
                  {detail.images.map(img =>
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

      {/* Shortlist Modal */}
      <Modal open={shortlistOpen} onClose={()=>setShortlistOpen(false)} title="Generate Shortlist">
        <form onSubmit={generateShortlist} style={{display:'flex', flexDirection:'column', gap:'.7rem'}}>
          <select value={prefs.country} onChange={e=>setPrefs(p=>({...p, country:e.target.value}))}>
            <option value="">Preferred Country (optional)</option>
            {COUNTRY_FILTERS.map(c=> <option key={c}>{c}</option>)}
          </select>
          <input
            placeholder="Budget (USD)"
            value={prefs.budget}
            onChange={e=>setPrefs(p=>({...p, budget:e.target.value.replace(/\D/g,'')}))}
          />
          <input
            placeholder="Program (e.g. CS)"
            value={prefs.program}
            onChange={e=>setPrefs(p=>({...p, program:e.target.value}))}
          />
          <button className="btn btn-primary" type="submit" disabled={shortlistLoading}>
            {shortlistLoading? 'Generating...' : 'Generate'}
          </button>
        </form>
        {shortlistError && <div style={{marginTop:'1rem', color:'#dc2626'}}>Error: {shortlistError}</div>}
        {shortlist && (
          <div style={{marginTop:'1.2rem', maxHeight:'260px', overflow:'auto', display:'flex', flexDirection:'column', gap:'.55rem'}}>
            {shortlist.map(item => (
              <div key={item.university} style={{border:'1px solid var(--border)', padding:'.6rem .7rem', borderRadius:'12px'}}>
                <strong style={{fontSize:'.8rem'}}>{item.university}</strong>
                <div style={{display:'flex', gap:'.4rem', flexWrap:'wrap', marginTop:'.3rem'}}>
                  <span className="chip" style={{fontSize:'.55rem'}}>Score {item.match_score}</span>
                  <span className="chip" style={{fontSize:'.55rem'}}>{item.country}</span>
                  <span className="chip" style={{fontSize:'.55rem'}}>Tuition ${item.tuition.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </main>
  );
};
