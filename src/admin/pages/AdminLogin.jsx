import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { login } from '../services/adminApi';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(username.trim(), password.trim());
      if (res && res.success) {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-brand">
          <img 
            src="./images/logo/logo.jpeg" 
            alt="Dhanam Organics" 
            className="admin-login-logo"
          />
          <h1 className="admin-login-title">Dhanam Organics</h1>
          <p className="admin-login-subtitle">Product Management & Admin Portal</p>
        </div>

        {/* In-UI Error Banner */}
        {errorMessage && (
          <div className="admin-error-box">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-username">
              Username or Email
            </label>
            <div className="admin-input-wrapper">
              <input 
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="admin-input"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-input-wrapper">
              <input 
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-input"
                autoComplete="current-password"
                required
              />
              <button 
                type="button" 
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-btn-submit"
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 12, color: 'var(--admin-text-muted)' }}>
          <span>Restricted to authorized Dhanam Organics administrators</span>
        </div>
      </div>
    </div>
  );
}
