import React, { useState } from 'react';

type Booking = { id:number; service:string; date:string; status:'upcoming'|'completed' };

export const StudentDashboard: React.FC = () => {
  const [bookings,setBookings] = useState<Booking[]>([
    { id:1, service:'Peer Counselling', date:'2025-08-20', status:'upcoming' },
    { id:2, service:'Visa Guidance', date:'2025-08-05', status:'completed' }
  ]);

  return (
    <main className="page container">
      <h1>Student Dashboard</h1>
      <section style={{marginTop:'2rem'}}>
        <h2 style={{margin:'0 0 1rem'}}>Bookings</h2>
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
          {bookings.map(b => (
            <div key={b.id} className="card">
              <h3 style={{margin:'0 0 .4rem', fontSize:'1rem'}}>{b.service}</h3>
              <p style={{margin:'0 0 .25rem', fontSize:'.8rem'}}>Date: {b.date}</p>
              <span style={{fontSize:'.65rem', padding:'.25rem .5rem', background:b.status==='upcoming'?'#dbeafe':'#e2e8f0', borderRadius:'6px', textTransform:'uppercase', letterSpacing:'1px'}}>{b.status}</span>
            </div>
          ))}
        </div>
      </section>
      <section style={{marginTop:'3rem'}}>
        <h2 style={{margin:'0 0 1rem'}}>Profile (Coming Soon)</h2>
        <p>Academic background, preferences, progress tracking.</p>
      </section>
    </main>
  );
};
