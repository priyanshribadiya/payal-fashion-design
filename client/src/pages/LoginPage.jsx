import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Return to checkout or intended page after login
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(identifier, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
          {/* Logo */}
          <img
            src="/assets/payal-logo.png"
            alt="Payal Fashion Design"
            style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem', border: '2px solid var(--gold)' }}
          />

          <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--burgundy)', marginBottom: '0.4rem' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Log in to manage orders, track delivery, or continue shopping.
          </p>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label className="form-label">Email Address or Mobile Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="name@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--burgundy)', textDecoration: 'underline' }}>
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              style={{ marginTop: '1rem' }}
              disabled={submitting}
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <span>→</span>
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            New to Payal Fashion Design?{' '}
            <Link to="/register" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
