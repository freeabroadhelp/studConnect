import React, { FormEvent, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './SiteNav.css';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  return (
    <button aria-label="Toggle theme" className="btn btn-small" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export const SiteNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { user, login, register, logout, loading } = useAuth();
  const [form, setForm] = useState({ email:'', password:'', full_name:'', role:'student' as 'student'|'counsellor' });
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  async function onSubmit(e:FormEvent){
    e.preventDefault();
    setError(null);
    try {
      if(isRegister){
        await register(form.email, form.password, form.role, form.full_name);
      } else {
        await login(form.email, form.password);
      }
      setAuthOpen(false);
      setForm({ email:'', password:'', full_name:'', role:'student' });
    } catch (err:any) {
      setError(err.message || 'Auth failed');
    }
  }
  return (
    <nav className="site-nav" role="navigation" aria-label="Main Navigation">
      <div className="container site-nav__inner">
        <div className="site-nav__left">
          <button className="hamburger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
            <span /><span /><span />
          </button>
          <NavLink to="/" className="logo" onClick={() => setOpen(false)}>StudConnect</NavLink>
        </div>
        <div className={`links ${open ? 'links--open' : ''}`}> 
          <NavLink to="/about" onClick={()=>setOpen(false)}>About</NavLink>
          <NavLink to="/services" onClick={()=>setOpen(false)}>Services</NavLink>
          <NavLink to="/universities" onClick={()=>setOpen(false)}>Universities</NavLink>
          <NavLink to="/contact" onClick={()=>setOpen(false)}>Contact</NavLink>
          <NavLink to="/financial" onClick={()=>setOpen(false)}>Financial</NavLink>
          <NavLink to="/student" onClick={()=>setOpen(false)}>Student</NavLink>
          <NavLink to="/counsellor" onClick={()=>setOpen(false)}>Counsellor</NavLink>
          <ThemeToggle />
          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
              <span style={{fontSize:'.8rem',opacity:.8}}>{user.full_name || user.email}</span>
              <button className="btn btn-small" type="button" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-small" type="button" onClick={()=>{ setIsRegister(false); setAuthOpen(true);} }>Login</button>
          )}
        </div>
      </div>
      <Modal open={authOpen} onClose={()=>setAuthOpen(false)} title={isRegister ? 'Create Account' : 'Login'}>
        <form onSubmit={onSubmit} className="auth-form" style={{display:'flex',flexDirection:'column',gap:'.7rem'}}>
          {isRegister && (
            <>
              <input required placeholder="Full name" value={form.full_name} onChange={e=>setForm(f=>({...f, full_name:e.target.value}))} />
              <div style={{display:'flex',gap:'.5rem'}}>
                <label style={{fontSize:'.75rem'}}>
                  Role:
                  <select value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value as any}))} style={{marginLeft:'.4rem'}}>
                    <option value="student">Student</option>
                    <option value="counsellor">Counsellor</option>
                  </select>
                </label>
              </div>
            </>
          )}
          <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
            <input required minLength={4} type="password" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} />
          {error && <div style={{color:'#dc2626', fontSize:'.75rem'}}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Please wait...' : (isRegister? 'Create account' : 'Login')}</button>
          <button type="button" className="btn btn-small" onClick={()=>setIsRegister(r=>!r)} style={{alignSelf:'center',background:'transparent'}}>
            {isRegister ? 'Have an account? Login' : 'Need an account? Register'}
          </button>
        </form>
      </Modal>
    </nav>
  );
};
