import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getGuestSessionId } from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  // Validate session on mount
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
          }
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const saveAuthSession = async (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    // Merge guest cart if any items were added before login
    const guestId = getGuestSessionId();
    if (guestId) {
      try {
        await api.mergeGuestCart(guestId);
      } catch (err) {
        console.warn('Guest cart merge notice:', err.message);
      }
    }
  };

  const login = async (identifier, password) => {
    try {
      const res = await api.login({ identifier, password });
      if (res.success) {
        await saveAuthSession(res.token, res.user);
        success(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      error(err.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.register(formData);
      if (res.success) {
        success('Registration successful! Please verify the OTP sent.');
        return {
          success: true,
          user: res.user,
          sandboxEmailOtp: res.sandboxEmailOtp,
          sandboxPhoneOtp: res.sandboxPhoneOtp,
        };
      }
    } catch (err) {
      error(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    }
  };

  const verifyOtp = async (identifier, purpose, otp) => {
    try {
      const res = await api.verifyOtp({ identifier, purpose, otp });
      if (res.success) {
        await saveAuthSession(res.token, res.user);
        success('Verification successful! You are now logged in.');
        return { success: true, user: res.user };
      }
    } catch (err) {
      error(err.message || 'Invalid or expired OTP code.');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    success('Logged out successfully.');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: !!user && user.role === 'admin',
    loading,
    login,
    register,
    verifyOtp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
