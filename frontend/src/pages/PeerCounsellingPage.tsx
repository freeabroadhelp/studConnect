import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const valuePoints = [
  { title:'Real Student Insights', text:'Current international students share up‑to‑date campus & lifestyle realities.' },
  { title:'Profile Alignment', text:'Get candid feedback on goals, competitiveness & strategic positioning.' },
  { title:'Country & Program Clarity', text:'Compare destinations on cost, outcomes, culture & career pathways.' },
  { title:'Actionable Next Steps', text:'Leave every session with prioritized, time‑bound tasks.' }
];

const flow = [
  { step:1, title:'Request Session', text:'Pick a slot & share quick intent notes.' },
  { step:2, title:'Match & Prep', text:'We pair you with a relevant mentor; you get a mini prep brief.' },
  { step:3, title:'Live Peer Call', text:'45–50 min structured conversation + open Q&A.' },
  { step:4, title:'Session Recap', text:'Key takeaways, links & next‑step checklist.' },
  { step:5, title:'Follow‑Up Window', text:'72h asynchronous clarification support.' }
];


const faqs = [
  { q:'Who are the peers?', a:'Vetted current international students / recent grads matched by destination & discipline.' },
  { q:'How fast is matching?', a:'Usually under 24 hours; niche profiles may take a bit longer.' },
  { q:'Can I change mentor?', a:'Yes—one complimentary rematch with reason provided.' },
  { q:'Do peers edit SOP/essays?', a:'They give directional feedback only; drafting sits in Application Assistance.' }
];

const testimonials = [
  { name:'Ishika • CS Canada', text:'Gave me realistic insight on co‑ops & budgeting I never saw on blogs.' },
  { name:'Daniel • MS Germany', text:'Helped me choose between two programs with a clear ROI perspective.' },
  { name:'Fatima • UK Health', text:'Left with a concrete 6‑week prep checklist. Removed uncertainty.' }
];

// --- New: Peer Counsellor Directory Template Data ---
const DUMMY_COUNSELLORS = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    university: 'MIT',
    course: 'Computer Science',
    year: '2024',
    areas: ['Admissions', 'Campus Life', 'Part-time Jobs'],
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Happy to share my MIT journey and tips for international students.',
    calendlyUrl: 'https://calendly.com/demo-counsellor/30min'
  },
  {
    id: 'c2',
    name: 'Sofia Lee',
    university: 'University of Toronto',
    course: 'Mechanical Engineering',
    year: '2025',
    areas: ['Scholarships', 'Living Costs', 'Internships'],
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Ask me about life in Canada and how to balance studies and work!',
    calendlyUrl: 'https://calendly.com/demo-counsellor2/30min'
  }
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'bank', label: 'Bank Transfer' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'stripe', label: 'Stripe' }
];

const PeerCounsellingPage: React.FC = () => {
  const nav = useNavigate();
  // Directory state
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState<'profile'|'calendly'|'payment'|'confirmed'|null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Use dummy data for now
  useEffect(() => {
    setCounsellors(DUMMY_COUNSELLORS);
  }, []);

  // Booking workflow handlers
  const startBooking = (c: any) => {
    setSelected(c);
    setBookingStep('profile');
  };

  // Payment mock
  const handlePayment = async () => {
    setBookingLoading(true);
    // Dummy API call
    await new Promise(res => setTimeout(res, 1200));
    setBookingStep('confirmed');
    setBookingLoading(false);
  };

  const goContact = () => {
    nav('/contact');
    requestAnimationFrame(()=>document.querySelector('#contact')?.scrollIntoView({ behavior:'smooth'}));
  };
  return (
    <main className="peer-page">
      <section className="peer-hero">
        <div className="peer-hero__inner">
          <h1><span className="gradient-text">Peer Counselling</span> Connect With Current International Students</h1>
          <p className="peer-lead">Validate your plan, compare countries & programs, and avoid costly mistakes by speaking to students already living your next step.</p>
          <div className="peer-cta-group">
            <button className="btn btn-primary" onClick={goContact}>Book Session</button>
            <button className="btn btn-small" onClick={()=>nav('/services')}>All Services</button>
          </div>
          <div className="peer-stats">
            <div><strong>3k+</strong><span>Peer Sessions</span></div>
            <div><strong>40+</strong><span>Universities</span></div>
            <div><strong>32</strong><span>Countries</span></div>
          </div>
        </div>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Why It Works</h2>
        <div className="peer-grid">
          {valuePoints.map(v=>(
            <div key={v.title} className="peer-card">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Session Flow</h2>
        <ol className="peer-flow">
          {flow.map(f=>(
            <li key={f.step}>
              <div className="peer-flow__num">{f.step}</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="peer-section">
        <h2 className="peer-heading">Real Outcomes</h2>
        <div className="peer-testimonials">
          {testimonials.map(t=>(
            <div key={t.name} className="peer-testimonial">
              <p>"{t.text}"</p>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      

      {/* --- Peer Counsellor Directory --- */}
      <section className="peer-section">
        <h2 className="peer-heading">Meet Our Peer Counsellors</h2>
        <div className="peer-directory" style={{display:'flex', flexWrap:'wrap', gap:'2rem', justifyContent:'center'}}>
          {counsellors.map(c => (
            <div key={c.id} className="peer-profile-card" style={{
              background:'#fff', borderRadius:16, boxShadow:'0 2px 16px #e0e7ff', padding:'1.5rem', width:320, display:'flex', flexDirection:'column', alignItems:'center'
            }}>
              <img src={c.photo} alt={c.name} className="peer-profile-photo" style={{width:80, height:80, borderRadius:'50%', objectFit:'cover', marginBottom:'.8rem'}} />
              <h3 style={{marginBottom:'.2rem', color:'#6366f1'}}>{c.name}</h3>
              <div style={{fontSize:'.97rem', color:'#334155', marginBottom:'.2rem'}}>{c.university}</div>
              <div style={{fontSize:'.9rem', color:'#64748b', marginBottom:'.2rem'}}>{c.course} ({c.year})</div>
              <div className="peer-profile-areas" style={{display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.5rem'}}>
                {c.areas.map((a:string) => <span key={a} className="chip" style={{background:'#e0e7ff', color:'#6366f1', borderRadius:8, padding:'2px 8px', fontSize:'.8rem'}}>{a}</span>)}
              </div>
              <p style={{fontSize:'.95rem', color:'#475569', marginBottom:'.7rem', textAlign:'center'}}>{c.bio}</p>
              <div style={{width:'100%', marginBottom:'.7rem'}}>
                <strong style={{fontSize:'.93rem', color:'#6366f1'}}>Availability</strong>
                <div style={{marginTop:'.3rem', width:'100%', minHeight:60, background:'#f8fafc', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <iframe
                    src={c.calendlyUrl}
                    style={{width:'100%', minHeight:60, border:'none'}}
                    title="Calendly"
                  />
                </div>
              </div>
              <button className="btn btn-primary btn-small" onClick={()=>startBooking(c)}>
                Book Session
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- Booking Modal --- */}
      {selected && bookingStep && (
        <div className="modal-overlay" style={{
          position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.18)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'
        }} onClick={()=>{setSelected(null); setBookingStep(null);}}>
          <div className="modal" style={{
            background:'#fff', borderRadius:16, boxShadow:'0 2px 24px #e0e7ff', padding:'2rem', minWidth:320, maxWidth:400, position:'relative'
          }} onClick={e=>e.stopPropagation()}>
            {bookingStep === 'profile' && (
              <>
                <h3 style={{color:'#6366f1'}}>Book Session with {selected.name}</h3>
                <img src={selected.photo} alt={selected.name} style={{width:60, borderRadius:30, margin:'1rem auto'}} />
                <div style={{fontSize:'.97rem', color:'#334155'}}>{selected.university}, {selected.course} ({selected.year})</div>
                <div style={{margin:'1rem 0', color:'#475569'}}>{selected.bio}</div>
                <button className="btn btn-primary" onClick={()=>setBookingStep('calendly')}>Choose Time Slot</button>
              </>
            )}
            {bookingStep === 'calendly' && (
              <>
                <h3 style={{color:'#6366f1'}}>Select a Time Slot</h3>
                <iframe
                  src={selected.calendlyUrl}
                  style={{minWidth: '100%', width:'100%', height:'320px', border:'none', marginBottom:'1rem'}}
                  title="Calendly"
                />
                <button className="btn btn-primary" onClick={()=>setBookingStep('payment')}>Proceed to Payment</button>
              </>
            )}
            {bookingStep === 'payment' && (
              <>
                <h3 style={{color:'#6366f1'}}>Payment</h3>
                <p>Session Fee: <strong>₹999 / $20</strong></p>
                <div style={{display:'flex', flexDirection:'column', gap:'.7rem', margin:'1rem 0'}}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={()=>setPaymentMethod(m.id)}
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={handlePayment} disabled={bookingLoading}>
                  {bookingLoading ? 'Processing...' : 'Pay & Confirm'}
                </button>
                <div style={{fontSize:'.85rem', color:'#64748b', marginTop:'.7rem'}}>
                  Payment confirmation triggers a booking confirmation email and WhatsApp message.
                </div>
              </>
            )}
            {bookingStep === 'confirmed' && (
              <>
                <h3 style={{color:'#22c55e'}}>Booking Confirmed!</h3>
                <p>You will receive a confirmation email and WhatsApp message with your Zoom link and reminders.</p>
                <button className="btn btn-primary" onClick={()=>{setSelected(null); setBookingStep(null);}}>Done</button>
              </>
            )}
            <button className="btn btn-small" style={{marginTop:'1rem'}} onClick={()=>{setSelected(null); setBookingStep(null);}}>Close</button>
          </div>
        </div>
      )}

      <section className="peer-section">
        <h2 className="peer-heading">FAQs</h2>
        <div className="peer-faq">
          {faqs.map(f=>(
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PeerCounsellingPage;
