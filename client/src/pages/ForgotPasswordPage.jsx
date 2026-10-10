import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1 = Enter email/phone, 2 = Enter OTP & new password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sandboxCode, setSandboxCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleStep1 = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.forgotPassword(identifier);
      if (res.success) {
        success('Password reset instructions and OTP have been dispatched.');
        if (res.sandboxCode) setSandboxCode(res.sandboxCode);
        setStep(2);
      }
    } catch (err) {
      error(err.message || 'Could not initiate reset.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.resetPassword({
        identifier,
        otp,
        newPassword,
        confirmPassword,
      });
      if (res.success) {
        success('Password updated successfully! Please log in with your new password.');
        navigate('/login');
      }
    } catch (err) {
      error(err.message || 'Reset failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="section-padding">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🔑</span>

          <h1 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--burgundy)', marginBottom: '0.4rem' }}>
            {step === 1 ? 'Forgot Password' : 'Set New Password'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {step === 1
              ? 'Enter your registered email address or mobile number to receive a recovery code.'
              : 'Enter the verification OTP and choose a strong new password.'}
          </p>

          {sandboxCode && step === 2 && (
            <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', color: '#1B5E20', marginBottom: '1.5rem', textAlign: 'left' }}>
              <strong>🛠 Developer Sandbox:</strong> Test OTP code: <code>{sandboxCode}</code>
              <button
                type="button"
                onClick={() => setOtp(sandboxCode)}
                style={{ display: 'block', fontSize: '0.75rem', textDecoration: 'underline', color: '#1B5E20', marginTop: '4px', cursor: 'pointer' }}
              >
                Auto-fill test code
              </button>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Registered Email or Mobile Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="name@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={submitting}
              >
                <span>{submitting ? 'Sending Code...' : 'Send Reset OTP'}</span>
                <span>→</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">6-Digit Recovery OTP</label>
                <input
                  type="text"
                  className="form-input text-center"
                  placeholder="123456"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (Min 8 characters)</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={submitting}
              >
                <span>{submitting ? 'Updating...' : 'Save New Password'}</span>
                <span>✔</span>
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: 'var(--burgundy)', fontWeight: 600 }}>
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
