import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { error } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      error('Please accept the Privacy Policy and Terms to proceed.');
      return;
    }

    if (password !== confirmPassword) {
      error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const res = await register({
      name,
      email,
      phone,
      password,
      confirmPassword,
    });
    setSubmitting(false);

    if (res.success) {
      // Navigate to OTP verification page
      navigate(`/verify-otp?identifier=${encodeURIComponent(email)}&purpose=registration_email`, {
        state: {
          sandboxCode: res.sandboxEmailOtp,
          phoneSandboxCode: res.sandboxPhoneOtp,
        },
      });
    }
  };

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '520px' }}>
        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
          <img
            src="/assets/payal-logo.png"
            alt="Payal Fashion Design"
            style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem', border: '2px solid var(--gold)' }}
          />

          <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--burgundy)', marginBottom: '0.4rem' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Join Payal Fashion Design for tailored couture and seamless order tracking.
          </p>

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Payal Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Indian Mobile Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '1rem 0' }}>
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                style={{ marginTop: '4px' }}
                required
              />
              <label htmlFor="terms" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                I agree to the{' '}
                <Link to="/terms" style={{ color: 'var(--burgundy)', textDecoration: 'underline' }}>Terms & Conditions</Link>
                {' '}and{' '}
                <Link to="/privacy-policy" style={{ color: 'var(--burgundy)', textDecoration: 'underline' }}>Privacy Policy</Link>.
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={submitting}
            >
              <span>{submitting ? 'Creating Account...' : 'Continue to Verification'}</span>
              <span>→</span>
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
