import React from 'react';

export const FinancialServicesPage: React.FC = () => (
  <main className="page container">
    <h1>Financial Services</h1>
    <section style={{marginTop:'1.5rem'}}>
      <h2>Education Loans</h2>
      <p>Compare partner lenders, check eligibility & track application status (API integration coming in Phase 2).</p>
    </section>
    <section style={{marginTop:'2rem'}}>
      <h2>Scholarship Guidance</h2>
      <p>We help shortlist relevant scholarships and refine applications to maximize success probability.</p>
    </section>
    <section style={{marginTop:'2rem'}}>
      <h2>Cost Planning Tools (Coming Soon)</h2>
      <p>Budget calculators, tuition vs living cost estimator, currency conversion helpers.</p>
    </section>
  </main>
);
