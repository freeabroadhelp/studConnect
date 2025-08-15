import React, { useEffect, useState } from 'react';

export const AdminPayoutDashboard: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/payouts').then(r=>r.json()).then(setRows);
  }, []);
  return (
    <main style={{maxWidth:600, margin:'2rem auto', background:'#fff', borderRadius:12, boxShadow:'0 2px 16px #e0e7ff', padding:'2rem'}}>
      <h2 style={{color:'#6366f1'}}>Payout Dashboard</h2>
      <table style={{width:'100%', marginTop:'1.5rem', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Counsellor</th>
            <th>University</th>
            <th>Sessions</th>
            <th>Total Due</th>
            <th>Paid</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.counsellor}>
              <td>{r.counsellor}</td>
              <td>{r.university}</td>
              <td>{r.completedSessions}</td>
              <td>${r.totalDue}</td>
              <td>${r.paid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};
