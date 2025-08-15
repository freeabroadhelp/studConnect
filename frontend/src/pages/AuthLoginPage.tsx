import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthLoginPage: React.FC = () => {
  const { login, loading, user } = useAuth();
  const [form,setForm] = useState({ email:'', password:'' });
  const [err,setErr] = useState<string | null>(null);

  if (user) return <Navigate to="/" replace />;

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setErr(null);
    try {
      await login(form.email, form.password);
    } catch (e:any){ setErr(e.message || 'Login failed'); }
  }

  return (
    <main className="auth-layout">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={submit} className="auth-form">
          <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
          <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} />
          {err && <div className="auth-error">{err}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading?'Please wait...':'Login'}</button>
        </form>
        <p className="auth-alt">No account? <a href="/auth/register">Sign Up</a></p>
      </div>
    </main>
  );
};

export default AuthLoginPage;
