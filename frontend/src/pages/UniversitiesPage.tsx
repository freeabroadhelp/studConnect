import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';

interface Uni { id:number; name:string; country:string; tuition:number; programs:string[] }
interface ShortlistItem { university:string; country:string; tuition:number; programs:string[]; match_score:number }

const PAGE_SIZE = 12;
const COUNTRY_FILTERS = ['Canada','Germany','Singapore','United States','United Kingdom','Australia'];

export const UniversitiesPage: React.FC = () => {
  const api = useApi();
  const [list,setList] = useState<Uni[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);

  // Filters / UI state
  const [search,setSearch] = useState('');
  const [country,setCountry] = useState<string>('');
  const [program,setProgram] = useState('');
  const [maxFee,setMaxFee] = useState('');
  const [sort,setSort] = useState<'rank'|'name'|'tuition_asc'|'tuition_desc'>('rank');
  const [page,setPage] = useState(1);

  // Shortlist modal
  const [shortlistOpen,setShortlistOpen] = useState(false);
  const [prefs,setPrefs] = useState({ country:'', budget:'', program:'' });
  const [shortlist,setShortlist] = useState<ShortlistItem[]|null>(null);
  const [shortlistLoading,setShortlistLoading] = useState(false);
  const [shortlistError,setShortlistError] = useState<string|null>(null);

  // Fetch base list (country & search passed to backend for coarse filter)
  useEffect(() => {
    setLoading(true); setError(null);
    const qs = [country?`country=${encodeURIComponent(country)}`:'', search?`q=${encodeURIComponent(search)}`:''].filter(Boolean).join('&');
    api.get<Uni[]>(`/universities${qs?`?${qs}`:''}`)
      .then(data=>{ setList(data); setPage(1); })
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  }, [country, search]);

  // Derive all programs (client) for quick program filter suggestions
  const allPrograms = useMemo(() => {
    const s = new Set<string>();
    list.forEach(u => u.programs.forEach(p=>s.add(p)));
    return Array.from(s).sort().slice(0,30);
  }, [list]);

  // Filtering + sorting + pagination
  const processed = useMemo(() => {
    let rows = list.slice();
    if (program) rows = rows.filter(u => u.programs.includes(program));
    if (maxFee) {
      const mf = Number(maxFee);
      if(!Number.isNaN(mf)) rows = rows.filter(u => u.tuition <= mf);
    }
    // emulate "rank": simply order by tuition ascending then name (placeholder until real rank)
    if (sort === 'rank') rows.sort((a,b)=> a.tuition - b.tuition || a.name.localeCompare(b.name));
    if (sort === 'name') rows.sort((a,b)=> a.name.localeCompare(b.name));
    if (sort === 'tuition_asc') rows.sort((a,b)=> a.tuition - b.tuition);
    if (sort === 'tuition_desc') rows.sort((a,b)=> b.tuition - a.tuition);
    return rows;
  }, [list, program, maxFee, sort]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page-1)*PAGE_SIZE;
    return processed.slice(start, start+PAGE_SIZE);
  }, [processed, page]);

  useEffect(()=>{ if(page>totalPages) setPage(1); }, [totalPages, page]);

  async function generateShortlist(e:FormEvent){
    e.preventDefault();
    setShortlistError(null); setShortlistLoading(true); setShortlist(null);
    try {
      const result = await api.post<ShortlistItem[]>('/shortlist', {
        country: prefs.country || null,
        budget: prefs.budget? Number(prefs.budget): null,
        program: prefs.program || null
      });
      setShortlist(result);
    } catch (err:any){ setShortlistError(err.message); }
    finally { setShortlistLoading(false); }
  }

  return (
    <main className="universities-page">
      <div className="universities-page__header">
        <h1 className="gradient-text" style={{margin:'0'}}>Universities</h1>
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
            <button
              className={!country ? 'uni-filter--active' : ''}
              onClick={()=>setCountry('')}
            >All</button>
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
              <option value="rank">Rank (proxy)</option>
              <option value="name">Name A–Z</option>
              <option value="tuition_asc">Tuition Low</option>
              <option value="tuition_desc">Tuition High</option>
            </select>
          </div>
        </div>

        <div style={{display:'flex', flexWrap:'wrap', gap:'.6rem'}}>
          <select value={program} onChange={e=>setProgram(e.target.value)} style={{padding:'.55rem .7rem', borderRadius:'10px', border:'1px solid var(--border)'}}>
            <option value="">Any Program</option>
            {allPrograms.map(p=> <option key={p}>{p}</option>)}
          </select>
          <input
            style={{padding:'.55rem .7rem', borderRadius:'10px', border:'1px solid var(--border)'}}
            placeholder="Max Tuition"
            value={maxFee}
            onChange={e=>setMaxFee(e.target.value.replace(/\D/g,''))}
          />
          <button className="btn btn-small" type="button" onClick={()=>setShortlistOpen(true)}>Shortlist</button>
        </div>
      </div>

      {loading && <div className="uni-empty">Loading universities...</div>}
      {error && <div className="uni-empty" style={{color:'#dc2626'}}>Error: {error}</div>}
      {!loading && !error && pageItems.length===0 && <div className="uni-empty">No universities match your filters.</div>}

      {!loading && !error && pageItems.length>0 && (
        <div className="unilist">
          {pageItems.map((u, idx) => {
            // pseudo-rank based on global position in processed array
            const globalIndex = processed.findIndex(x=>x.id===u.id);
            const pseudoRank = globalIndex >=0 ? globalIndex + 1 : null;
            const acronym = u.name.split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
            return (
              <div key={u.id} className="uni-card" role="article" aria-label={u.name}>
                {pseudoRank && <div className="uni-rank-badge" aria-label="Rank (proxy)">
                  <span>#{pseudoRank}</span>
                </div>}
                <div className="uni-head">
                  <div className="uni-logo" aria-hidden>{acronym}</div>
                  <div>
                    <h3 className="uni-name">{u.name}</h3>
                    <p className="uni-location">{u.country}</p>
                  </div>
                </div>
                <div className="uni-program-tags" aria-label="Programs">
                  {u.programs.slice(0,4).map(p => <span key={p}>{p}</span>)}
                  {u.programs.length>4 && <span>+{u.programs.length-4}</span>}
                </div>
                <div style={{fontSize:'.65rem', marginTop:'.4rem', letterSpacing:'.5px', fontWeight:600, opacity:.7}}>
                  Tuition: ${u.tuition.toLocaleString()}
                </div>
                <div className="uni-actions">
                  <button className="btn btn-small" type="button" onClick={()=>setShortlistOpen(true)}>Shortlist</button>
                  <a
                    className="btn btn-small"
                    href={`https://www.google.com/search?q=${encodeURIComponent(u.name+' official site')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >Visit</a>
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

      <Modal open={shortlistOpen} onClose={()=>setShortlistOpen(false)} title="Generate Shortlist">
        {/* ...existing code replaced by improved form... */}
        <form onSubmit={generateShortlist} style={{display:'flex', flexDirection:'column', gap:'.7rem'}}>
          <select value={prefs.country} onChange={e=>setPrefs(p=>({...p, country:e.target.value}))}>
            <option value="">Preferred Country (optional)</option>
            {COUNTRY_FILTERS.map(c=> <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Budget (USD)" value={prefs.budget} onChange={e=>setPrefs(p=>({...p, budget:e.target.value.replace(/\D/g,'')}))} />
            <input placeholder="Program (e.g. CS)" value={prefs.program} onChange={e=>setPrefs(p=>({...p, program:e.target.value}))} />
          <button className="btn btn-primary" type="submit" disabled={shortlistLoading}>{shortlistLoading? 'Generating...' : 'Generate'}</button>
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
