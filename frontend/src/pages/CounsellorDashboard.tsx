import React, { useState } from 'react';

type Session = { id:number; student:string; service:string; date:string; status:'scheduled'|'completed' };

export const CounsellorDashboard: React.FC = () => {
  const [sessions] = useState<Session[]>([
    { id:1, student:'Aarav', service:'Shortlisting', date:'2025-08-15', status:'scheduled' },
    { id:2, student:'Meera', service:'Visa Guidance', date:'2025-08-10', status:'completed' }
  ]);

  return (
    <main className="page container">
      <h1>Counsellor Dashboard</h1>
      <section style={{marginTop:'2rem'}}>
        <h2 style={{margin:'0 0 1rem'}}>Upcoming Sessions</h2>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
          {sessions.map(s => (
            <div key={s.id} className="card">
              <h3 style={{margin:'0 0 .4rem', fontSize:'1rem'}}>{s.service}</h3>
              <p style={{margin:'0 0 .25rem', fontSize:'.8rem'}}>Student: {s.student}</p>
              <p style={{margin:'0 0 .25rem', fontSize:'.8rem'}}>Date: {s.date}</p>
              <span style={{fontSize:'.65rem', padding:'.25rem .5rem', background:s.status==='scheduled'?'#dbeafe':'#e2e8f0', borderRadius:'6px', textTransform:'uppercase', letterSpacing:'1px'}}>{s.status}</span>
            </div>
          ))}
        </div>
      </section>
      <section style={{marginTop:'3rem'}}>
        <h2 style={{margin:'0 0 1rem'}}>Availability (Coming Soon)</h2>
        <p>Set times, manage calendar integrations, session history.</p>
      </section>
    </main>
  );
};
