import React, { FormEvent, useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Modal } from '../components/Modal';

interface Uni { id:number; name:string; country:string; tuition:number; programs:string[] }
interface ShortlistItem { university:string; country:string; tuition:number; programs:string[]; match_score:number }

export const UniversitiesPage: React.FC = () => {
  const api = useApi();
  const [list,setList] = useState<Uni[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);
  const [query,setQuery] = useState('');
  const [country,setCountry] = useState('');
  const [maxTuition,setMaxTuition] = useState('');
  const [shortlistOpen,setShortlistOpen] = useState(false);
  const [prefs,setPrefs] = useState({ country:'', budget:'', program:'' });
  const [shortlist,setShortlist] = useState<ShortlistItem[]|null>(null);
  const [shortlistLoading,setShortlistLoading] = useState(false);
  const [shortlistError,setShortlistError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    api.get<Uni[]>(`/universities${query||country?`?${[query?`q=${encodeURIComponent(query)}`:'', country?`country=${encodeURIComponent(country)}`:''].filter(Boolean).join('&')}`:''}`)
      .then(data=>{ setList(data); })
      .catch(e=>setError(e.message))
      .finally(()=>setLoading(false));
  }, [query, country]);

  const filtered = list.filter(u => (!maxTuition || u.tuition <= Number(maxTuition)));

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
    <main className="page container">
      <h1>Universities</h1>
      <div className="card" style={{marginTop:'1.5rem'}}>
        <div style={{display:'grid', gap:'1rem', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))'}}>
          <input placeholder="Search name" value={query} onChange={e=>setQuery(e.target.value)} />
          <select value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="">Country</option>
            <option>Canada</option>
            <option>Singapore</option>
            <option>Germany</option>
          </select>
          <input placeholder="Max Tuition" value={maxTuition} onChange={e=>setMaxTuition(e.target.value)} />
        </div>
        <div style={{marginTop:'1rem', display:'flex', justifyContent:'flex-end'}}>
          <button className="btn btn-small" type="button" onClick={()=>setShortlistOpen(true)}>Generate Shortlist</button>
        </div>
      </div>
      {loading && <div style={{marginTop:'2rem'}}>Loading universities...</div>}
      {error && <div style={{marginTop:'2rem', color:'#dc2626'}}>Error: {error}</div>}
      {!loading && !error && (
        <div className="grid" style={{marginTop:'2rem', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))'}}>
          {filtered.map(u => (
            <div key={u.id} className="card">
              <h3 style={{margin:'0 0 .5rem'}}>{u.name}</h3>
              <p style={{margin:'0 0 .25rem', fontSize:'.8rem', textTransform:'uppercase', letterSpacing:'1px', color:'var(--muted)'}}>{u.country}</p>
              <p style={{margin:'0 0 .5rem', fontSize:'.8rem'}}>Tuition: ${u.tuition.toLocaleString()}</p>
              <div style={{display:'flex', flexWrap:'wrap', gap:'.4rem'}}>
                {u.programs.map(p => <span key={p} className="chip" style={{fontSize:'.6rem'}}>{p}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={shortlistOpen} onClose={()=>setShortlistOpen(false)} title="Generate Shortlist">
        <form onSubmit={generateShortlist} style={{display:'flex', flexDirection:'column', gap:'.7rem'}}>
          <select value={prefs.country} onChange={e=>setPrefs(p=>({...p, country:e.target.value}))}>
            <option value="">Preferred Country (optional)</option>
            <option>Canada</option>
            <option>Singapore</option>
            <option>Germany</option>
          </select>
          <input placeholder="Budget (USD)" value={prefs.budget} onChange={e=>setPrefs(p=>({...p, budget:e.target.value}))} />
          <input placeholder="Program (e.g. CS)" value={prefs.program} onChange={e=>setPrefs(p=>({...p, program:e.target.value}))} />
          <button className="btn btn-primary" type="submit" disabled={shortlistLoading}>{shortlistLoading? 'Generating...' : 'Generate'}</button>
        </form>
        {shortlistError && <div style={{marginTop:'1rem', color:'#dc2626'}}>Error: {shortlistError}</div>}
        {shortlist && (
          <div style={{marginTop:'1.2rem', maxHeight:'240px', overflow:'auto'}}>
            {shortlist.map(item => (
              <div key={item.university} className="card" style={{marginBottom:'.6rem', padding:'.75rem .9rem'}}>
                <strong style={{fontSize:'.85rem'}}>{item.university}</strong>
                <div style={{display:'flex', gap:'.75rem', flexWrap:'wrap', marginTop:'.35rem'}}>
                  <span style={{fontSize:'.6rem', background:'var(--bg-alt)', padding:'.25rem .5rem', borderRadius:'6px'}}>Score {item.match_score}</span>
                  <span style={{fontSize:'.6rem', background:'var(--bg-alt)', padding:'.25rem .5rem', borderRadius:'6px'}}>{item.country}</span>
                  <span style={{fontSize:'.6rem', background:'var(--bg-alt)', padding:'.25rem .5rem', borderRadius:'6px'}}>Tuition ${item.tuition.toLocaleString()}</span>
                </div>
                <div style={{display:'flex', flexWrap:'wrap', gap:'.3rem', marginTop:'.4rem'}}>
                  {item.programs.map(p => <span key={p} className="chip" style={{fontSize:'.55rem'}}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </main>
  );
};
