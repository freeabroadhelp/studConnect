import React, { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthVerifyPage: React.FC = () => {
  const { verify, loading, user, pendingEmail } = useAuth();
  const [sp] = useSearchParams();
  const email = sp.get('email') || pendingEmail || '';
  const [code,setCode] = useState('');
  const [err,setErr] = useState<string | null>(null);

  if (!email) return <Navigate to="/auth/register" replace />;
  if (user) return <Navigate to="/" replace />;

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setErr(null);
    try {
      await verify(email, code);
    } catch (e:any){ setErr(e.message || 'Verification failed'); }
  }

  return (
    <main className="auth-layout">
      <div className="auth-card">
        <h1>Email Verification</h1>
        <p className="auth-info">Enter the 6‑digit OTP sent to <strong>{email}</strong>.</p>
        <form onSubmit={submit} className="auth-form">
          <input
            required
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Enter OTP"
            value={code}
            onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
          />
          {err && <div className="auth-error">{err}</div>}
          <button className="btn btn-primary" disabled={loading || code.length !== 6}>{loading?'Verifying...':'Verify & Continue'}</button>
        </form>
        <p className="auth-alt"><a href="/auth/register">Back to Register</a></p>
      </div>
    </main>
  );
};

export default AuthVerifyPage;
