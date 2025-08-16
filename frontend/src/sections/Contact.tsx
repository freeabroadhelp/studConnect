import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { API_BASE_URL } from '../apiBase'; // <-- use global API base

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});
  const [phone, setPhone] = useState("");
  const ref = useReveal();

  // Add state for form fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dial_code: '+91',
    nationality: 'India'
  });

  async function submitConsultationToExcel(data: Record<string, any>) {
    const apiUrl = `${API_BASE_URL}/api/consultation-excel`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })
    });
    if (!res.ok) throw new Error('Failed to submit consultation');
    return await res.json();
  }

  function validateEmail(email: string){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function validatePhone(phone: string, dial: string){
    const digits = phone.replace(/\D/g,'');
    if(dial === '+91') {
      return /^[6-9]\d{9}$/.test(digits);
    }
    return digits.length >= 7;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(status !== 'idle') return;
    const form = e.currentTarget;
    const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
    const dialInput = form.elements.namedItem('dial_code') as HTMLSelectElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    const firstNameInput = form.elements.namedItem('first_name') as HTMLInputElement;
    const lastNameInput = form.elements.namedItem('last_name') as HTMLInputElement;
    const nationalityInput = form.elements.namedItem('nationality') as HTMLSelectElement;

    const phoneVal = phoneInput.value.trim();
    const emailVal = emailInput.value.trim();
    const dialVal = dialInput.value;
    const firstNameVal = firstNameInput.value.trim();
    const lastNameVal = lastNameInput.value.trim();
    const nationalityVal = nationalityInput.value;

    const nextErrors: { phone?: string; email?: string } = {};
    if(!validatePhone(phoneVal, dialVal)) {
      nextErrors.phone = dialVal === '+91' ? 'Enter a valid 10-digit Indian mobile starting 6-9' : 'Enter a valid phone number';
    }
    if(!validateEmail(emailVal)) {
      nextErrors.email = 'Enter a valid email address';
    }
    setErrors(nextErrors);
    if(Object.keys(nextErrors).length) return; // abort

    setStatus('submitting');
    // Send to backend for Excel storage
    submitConsultationToExcel({
      first_name: firstNameVal,
      last_name: lastNameVal,
      email: emailVal,
      phone: phoneVal,
      dial_code: dialVal,
      nationality: nationalityVal
    })
      .then(() => setStatus('submitted'))
      .catch(() => setStatus('idle'));
  }

  return (
    <section className="section reveal" id="contact" ref={ref as any}>
      <div className="container">
        <h2 className="section__title">Book Your Consultation</h2>
        <form className="consultation" onSubmit={handleSubmit} noValidate>
          <div className="consultation__grid">
            <div className="field">
              <label>First Name<span>*</span></label>
              <input required name="first_name" placeholder="John" />
            </div>
            <div className="field">
              <label>Last Name<span>*</span></label>
              <input required name="last_name" placeholder="Doe" />
            </div>
            <div className="field phone">
              <label>Phone Number<span>*</span></label>
              <div className="phone__inner">
                <select name="dial_code" defaultValue="+91" aria-label="Country code">
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+65">+65</option>
                  <option value="+49">+49</option>
                  <option value="+33">+33</option>
                  <option value="+31">+31</option>
                  <option value="+46">+46</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                  <option value="+82">+82</option>
                  <option value="+7">+7</option>
                  <option value="+39">+39</option>
                  <option value="+34">+34</option>
                  <option value="+351">+351</option>
                  <option value="+41">+41</option>
                  <option value="+43">+43</option>
                  <option value="+32">+32</option>
                  <option value="+420">+420</option>
                  <option value="+48">+48</option>
                  <option value="+358">+358</option>
                  <option value="+47">+47</option>
                  <option value="+45">+45</option>
                  <option value="+36">+36</option>
                  <option value="+386">+386</option>
                  <option value="+420">+420</option>
                  <option value="+421">+421</option>
                  <option value="+353">+353</option>
                  <option value="+380">+380</option>
                  <option value="+90">+90</option>
                  <option value="+971">+971</option>
                  <option value="+966">+966</option>
                  <option value="+62">+62</option>
                  <option value="+63">+63</option>
                  <option value="+60">+60</option>
                  <option value="+64">+64</option>
                  <option value="+27">+27</option>
                  <option value="+234">+234</option>
                  <option value="+254">+254</option>
                  <option value="+20">+20</option>
                  <option value="+55">+55</option>
                  <option value="+52">+52</option>
                  <option value="+54">+54</option>
                  <option value="+353">+353</option>
                  <option value="+380">+380</option>
                  <option value="+351">+351</option>
                  <option value="+386">+386</option>
                  <option value="+420">+420</option>
                  <option value="+421">+421</option>
                  {/* ...add more as needed */}
                </select>
                <input
                  required
                  name="phone"
                  placeholder="99999 99999"
                  aria-invalid={!!errors.phone}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phone}
                  onChange={(e)=>{
                    let digits = e.target.value.replace(/\D/g,'');
                    if(digits.length === 1 && digits === '0') return; 
                    if(digits.length > 10) digits = digits.slice(0,10);
                    setPhone(digits);
                    setErrors(prev => ({...prev, phone: undefined}));
                  }}
                />
              </div>
              {errors.phone && <span className="field-error" role="alert">{errors.phone}</span>}
            </div>
            <div className="field">
              <label>Email<span>*</span></label>
              <input required name="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
              {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
            </div>
            <div className="field">
              <label>Nationality<span>*</span></label>
              <select required name="nationality" defaultValue="India">
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Sweden">Sweden</option>
                <option value="Sweden">Sweden</option>
                <option value="Japan">Japan</option>
                <option value="China">China</option>
                <option value="South Korea">South Korea</option>
                <option value="Russia">Russia</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Portugal">Portugal</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Austria">Austria</option>
                <option value="Belgium">Belgium</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Poland">Poland</option>
                <option value="Finland">Finland</option>
                <option value="Norway">Norway</option>
                <option value="Denmark">Denmark</option>
                <option value="Hungary">Hungary</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Ireland">Ireland</option>
                <option value="Ukraine">Ukraine</option>
                <option value="Turkey">Turkey</option>
                <option value="UAE">UAE</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Philippines">Philippines</option>
                <option value="Malaysia">Malaysia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="South Africa">South Africa</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="Egypt">Egypt</option>
                <option value="Brazil">Brazil</option>
                <option value="Mexico">Mexico</option>
                <option value="Argentina">Argentina</option>
              </select>
            </div>
          </div>
          <div className="consultation__actions" style={{display:'flex', justifyContent:'center', marginTop:'1.2rem'}}>
            <button
              className="btn btn-primary"
              disabled={status !== 'idle'}
              type="submit"
              onClick={async (e) => {
                if (status !== 'idle') return;
                const form = (e.target as HTMLElement).closest('form');
                if (!form) return;
                e.preventDefault();
                const formDataObj: Record<string, any> = {};
                Array.from(form.elements).forEach((el: any) => {
                  if (el.name) formDataObj[el.name] = el.value;
                });
                const phoneVal = formDataObj.phone?.trim() || '';
                const dialVal = formDataObj.dial_code || '';
                const emailVal = formDataObj.email?.trim() || '';
                const nextErrors: { phone?: string; email?: string } = {};
                if(!validatePhone(phoneVal, dialVal)) {
                  nextErrors.phone = dialVal === '+91' ? 'Enter a valid 10-digit Indian mobile starting 6-9' : 'Enter a valid phone number';
                }
                if(!validateEmail(emailVal)) {
                  nextErrors.email = 'Enter a valid email address';
                }
                setErrors(nextErrors);
                if(Object.keys(nextErrors).length) return;
                setStatus('submitting');
                try {
                  await submitConsultationToExcel({
                    ...formDataObj,
                    timestamp: new Date().toISOString()
                  });
                  setStatus('submitted');
                } catch {
                  setStatus('idle');
                }
              }}
            >
              {status === 'submitting' ? 'Submitting...' : status === 'submitted' ? 'Submitted!' : 'Submit'}
            </button>
          </div>
          {status === 'submitted' && (
            <div style={{textAlign:'center', marginTop:'.7rem'}}>
              <span className="form-success">Thanks! We will contact you soon.</span>
            </div>
          )}
        </form>
        <div
          className="newsletter"
          style={{
            margin: '2.5rem auto 0',
            maxWidth: 420,
            background: '#f8fafc',
            borderRadius: 16,
            boxShadow: '0 2px 16px 0 #e5e7eb',
            padding: '2rem 1.5rem 1.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h3 style={{marginBottom:'.7rem', fontWeight:600, fontSize:'1.25rem', color:'#2563eb'}}>Stay Updated</h3>
          <p style={{margin:'0 0 1.1rem 0', color:'#64748b', fontSize:'.97rem'}}>Subscribe to get the latest updates, tips, and university news.</p>
          <form
            className="newsletter__form"
            style={{display:'flex', gap:'.6rem', width:'100%', justifyContent:'center'}}
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email for updates"
              required
              style={{
                flex:1,
                minWidth:0,
                padding:'.7rem 1rem',
                borderRadius:'8px',
                border:'1px solid #d1d5db',
                fontSize:'.98rem'
              }}
            />
            <button
              className="btn"
              style={{
                background:'#2563eb',
                color:'#fff',
                borderRadius:'8px',
                padding:'.7rem 1.2rem',
                fontWeight:600,
                fontSize:'.98rem'
              }}
            >Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
};

