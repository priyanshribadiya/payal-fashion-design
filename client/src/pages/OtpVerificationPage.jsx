import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { api } from '../services/api';

export function OtpVerificationPage() {
  const [searchParams] = useSearchParams();
  const identifier = searchParams.get('identifier') || '';
  const purpose = searchParams.get('purpose') || 'registration_email';

  const location = useLocation();
  const [sandboxCode, setSandboxCode] = useState(location.state?.sandboxCode || '');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  const { verifyOtp } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  // 60-second resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      error('Please enter the full 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    const res = await verifyOtp(identifier, purpose, otp.trim());
    setSubmitting(false);

    if (res.success) {
      navigate('/', { replace: true });
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const res = await api.resendOtp({ identifier, purpose });
      if (res.success) {
        success('A fresh OTP has been sent!');
        setResendCooldown(60);
        if (res.sandboxCode) {
          setSandboxCode(res.sandboxCode);
        }
      }
    } catch (err) {
      error(err.message || 'Could not resend OTP. Please wait.');
    }
  };

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📲</span>

          <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--burgundy)', marginBottom: '0.4rem' }}>
            Verify Your Account
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We've sent a 6-digit OTP code to:
            <strong style={{ display: 'block', color: 'var(--text-main)', marginTop: '4px' }}>{identifier}</strong>
          </p>

          {/* Sandbox Development Helper */}
          {sandboxCode && (
            <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', color: '#1B5E20', marginBottom: '1.5rem' }}>
              <strong>🛠 Developer Sandbox Mode:</strong>
              <div>Your test OTP is: <code style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px' }}>{sandboxCode}</code></div>
              <button
                type="button"
                onClick={() => setOtp(sandboxCode)}
                style={{ fontSize: '0.75rem', textDecoration: 'underline', color: '#1B5E20', marginTop: '4px', cursor: 'pointer' }}
              >
                Auto-fill test code
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input text-center"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                maxLength="6"
                style={{ fontSize: '1.8rem', letterSpacing: '8px', fontWeight: 700, padding: '0.75rem' }}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full"
              disabled={submitting}
            >
              <span>{submitting ? 'Verifying...' : 'Verify & Continue'}</span>
              <span>✔</span>
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Didn't receive the code?{' '}
            {resendCooldown > 0 ? (
              <span style={{ color: 'var(--text-muted)' }}>Resend in {resendCooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                style={{ color: 'var(--burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
