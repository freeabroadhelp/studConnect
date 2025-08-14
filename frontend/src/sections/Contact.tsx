import React, { useState } from 'react';
import { useReveal } from '../hooks/useReveal';

export const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});
  const [phone, setPhone] = useState("");
  const ref = useReveal();

  function validateEmail(email: string){
    // Basic RFC5322-ish light check
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function validatePhone(phone: string, dial: string){
    const digits = phone.replace(/\D/g,'');
    if(dial === '+91') {
      return /^[6-9]\d{9}$/.test(digits); // Indian mobile format
    }
    return digits.length >= 7; // generic minimum length
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(status !== 'idle') return;
    const form = e.currentTarget;
  const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
    const dialInput = form.elements.namedItem('dial_code') as HTMLSelectElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
  const phoneVal = phone.trim();
    const emailVal = emailInput.value.trim();
    const dialVal = dialInput.value;
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
    // Simulated async submit
    setTimeout(() => setStatus('submitted'), 900);
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
              <label>Date Of Birth<span>*</span></label>
              <input required name="dob" type="date" />
            </div>
            <div className="field">
              <label>Nationality<span>*</span></label>
              <select required name="nationality" defaultValue="">
                <option value="" disabled>Select nationality</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            <div className="field field--full">
              <label>What's your budget to study abroad?<span>*</span></label>
              <div className="budget-options">
                {[
                  'Less than $5,000',
                  '$5,000 - $10,000',
                  '$10,000 - $15,000',
                  '$15,000 - $25,000'
                ].map(opt => {
                  const id = opt.replace(/[^a-z0-9]/gi,'').toLowerCase();
                  return (
                    <div className="budget-option" key={opt}>
                      <input id={id} type="radio" name="budget" value={opt} required />
                      <label htmlFor={id}>{opt}</label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="consultation__actions">
            <button className="btn btn-primary" disabled={status !== 'idle'}>
              {status === 'submitting' ? 'Submitting...' : status === 'submitted' ? 'Submitted!' : 'Submit'}
            </button>
            {status === 'submitted' && <span className="form-success">Thanks! We will contact you soon.</span>}
          </div>
        </form>
        <div className="newsletter">
          <h3>Stay Updated</h3>
            <form className="newsletter__form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Email for updates" required />
              <button className="btn">Subscribe</button>
            </form>
        </div>
      </div>
    </section>
  );
};
