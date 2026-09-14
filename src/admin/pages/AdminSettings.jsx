import React, { useState } from 'react';
import { Lock, Server, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { changePassword } from '../services/adminApi';

export default function AdminSettings({ user, onShowToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill out all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: res.message || 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onShowToast) onShowToast('Password updated successfully.', 'success');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {/* 1. Admin Security Settings */}
      <div style={{ background: '#ffffff', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: 24, marginBottom: 24, boxShadow: 'var(--admin-shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Lock size={18} color="var(--admin-primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Security & Password Management</h3>
        </div>

        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 20 }}>
          Change your administrator login password. Passwords are encrypted on the server with secure bcrypt hashing.
        </p>

        {passwordMsg.text && (
          <div className={passwordMsg.type === 'error' ? 'admin-error-box' : 'admin-toast-item success'} style={{ marginBottom: 16 }}>
            {passwordMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ maxWidth: 440 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Current Password *</label>
            <input 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="admin-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">New Password (Min 6 Characters) *</label>
            <input 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="admin-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Confirm New Password *</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="admin-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="admin-btn-primary"
            disabled={isUpdating}
            style={{ marginTop: 8 }}
          >
            <Lock size={14} />
            <span>{isUpdating ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* 2. GoDaddy Hosting & Database Deployment Info */}
      <div style={{ background: '#ffffff', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-md)', padding: 24, boxShadow: 'var(--admin-shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Database size={18} color="var(--admin-primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Hosting & Database Architecture</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#f8faf8', padding: 14, borderRadius: 8, border: '1px solid var(--admin-border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              Hosting Environment
            </span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text-main)', marginTop: 4 }}>
              GoDaddy Shared Hosting (cPanel)
            </div>
            <span style={{ fontSize: 12, color: '#188647' }}>PHP 7.4 - 8.3+ Ready</span>
          </div>

          <div style={{ background: '#f8faf8', padding: 14, borderRadius: 8, border: '1px solid var(--admin-border)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
              Database Engine
            </span>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text-main)', marginTop: 4 }}>
              MySQL 5.7 / 8.0 (InnoDB)
            </div>
            <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Configured in api/config.php</span>
          </div>
        </div>

        <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', lineHeight: 1.6 }}>
          <strong>GoDaddy Setup Instructions:</strong>
          <ol style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Log in to your GoDaddy cPanel account.</li>
            <li>Open <strong>MySQL Databases</strong> and create database <code>dhanam_organics</code>.</li>
            <li>Create user <code>dhanam_user</code> with password, and assign all privileges to the database.</li>
            <li>Update credentials in <code>api/config.php</code>.</li>
            <li>Visit <code>https://yourdomain.com/api/seed.php</code> once in your browser to automatically create the tables and seed the initial 8 products!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
