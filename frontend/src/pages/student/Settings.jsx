import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, KeyRound, Bell, CheckCircle2, AlertCircle, LogOut } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (passwords.new_password !== passwords.confirm_new_password) {
      setError('New passwords do not match.');
      return;
    }

    if (passwords.new_password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      addToast('Password changed successfully.', 'success');
      setPasswords({ old_password: '', new_password: '', confirm_new_password: '' });
    } catch (err) {
      const msg = err.response?.data?.old_password?.[0] || 'Failed to change password. Check current password.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Manage your credentials, notification preferences, and session controls
        </p>
      </div>

      <div className="space-y-6">
        {/* Change Password Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-brand-teal/10 text-brand-teal">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-dark">Change Password</h3>
              <p className="text-xs text-brand-muted">Keep your account secure with regular updates</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password *</label>
              <input
                type="password"
                value={passwords.old_password}
                onChange={(e) => setPasswords((p) => ({ ...p, old_password: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                value={passwords.new_password}
                onChange={(e) => setPasswords((p) => ({ ...p, new_password: e.target.value }))}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={passwords.confirm_new_password}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm_new_password: e.target.value }))}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notifications & System Preferences */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-amber-50 text-brand-gold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-dark">Notification Preferences</h3>
              <p className="text-xs text-brand-muted">Configure how and when you receive campus alerts</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-brand-teal rounded" />
              <span>Complaint lifecycle updates (Submission, Assignment, Resolution)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-brand-teal rounded" />
              <span>Hostel outpass status updates & parent verification confirmations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-brand-teal rounded" />
              <span>Urgent campus-wide safety and maintenance announcements</span>
            </label>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200/80 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-rose-900">Sign Out of Current Session</h4>
            <p className="text-xs text-rose-700/80">You can sign back in at any time with your credentials.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
