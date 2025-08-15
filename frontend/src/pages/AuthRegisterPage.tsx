import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const AuthRegisterPage: React.FC = () => {
  const { register, loading, pendingEmail, user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'', full_name:'', role:'student' });
  const [err,setErr] = useState<string | null>(null);

  if (user) return <Navigate to="/" replace />;
  if (pendingEmail) return <Navigate to={`/auth/verify?email=${encodeURIComponent(pendingEmail)}`} replace />;

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setErr(null);
    try {
      await register(form.email, form.password, form.role as any, form.full_name);
      nav(`/auth/verify?email=${encodeURIComponent(form.email)}`);
    } catch (e:any){ setErr(e.message || 'Registration failed'); }
  }

  return (
    <main className="auth-layout">
      <div className="auth-card">
        <h1>Create Account</h1>
        <form onSubmit={submit} className="auth-form">
          <input required placeholder="Full name" value={form.full_name} onChange={e=>setForm(f=>({...f, full_name:e.target.value}))} />
          <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
          <input required minLength={6} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} />
          <select value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))}>
            <option value="student">Student</option>
            <option value="counsellor">Counsellor</option>
          </select>
          {err && <div className="auth-error">{err}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading?'Please wait...':'Send OTP'}</button>
        </form>
        <p className="auth-alt">Already have an account? <a href="/auth/login">Login</a></p>
      </div>
    </main>
  );
};

export default AuthRegisterPage;
