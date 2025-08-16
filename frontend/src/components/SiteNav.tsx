import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './SiteNav.css';
import { useAuth } from '../context/AuthContext';

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
  const { user, logout } = useAuth();

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

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
          <NavLink to="/student" onClick={()=>setOpen(false)}>Student</NavLink>
          <NavLink to="/counsellor" onClick={()=>setOpen(false)}>Counsellor</NavLink>
          <ThemeToggle />
          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}>
              <span style={{fontSize:'.8rem',opacity:.8}}>{user.full_name || user.email}</span>
              <button className="btn btn-small" type="button" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div style={{display:'flex', gap:'.5rem'}}>
              <NavLink
                to="/auth/login"
                onClick={()=>setOpen(false)}
                className={({isActive}) => 'btn btn-small' + (isActive ? ' btn-primary' : '')}
              >Login</NavLink>
              <NavLink
                to="/auth/register"
                onClick={()=>setOpen(false)}
                className={({isActive}) => 'btn btn-small' + (isActive ? ' btn-primary' : '')}
              >Sign Up</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
