import React, { useState } from 'react';
import {
  KeyRound,
  Bell,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Lock,
  CheckCircle2,
} from 'lucide-react';
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

      setPasswords({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      });
    } catch (err) {
      const msg =
        err.response?.data?.old_password?.[0] ||
        'Failed to change password. Check current password.';

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
    <div className="min-h-[calc(100vh-70px)] bg-brand-dark text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* =========================================================
            PAGE HEADER
        ========================================================= */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-teal-dark border border-brand-dark-border flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
            </div>

            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Account Control
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Account & Security
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Manage your credentials, notifications, and active session.
          </p>
        </div>

        {/* =========================================================
            SECURITY OVERVIEW
        ========================================================= */}
        <div className="mb-5 rounded-2xl border border-brand-dark-border bg-brand-teal-dark/70 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-teal/30 border border-brand-teal/50 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-brand-gold" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                  Security Status
                </p>

                <h2 className="text-sm sm:text-base font-heading font-bold text-white">
                  Your account is protected
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Keep your password private and use a strong password for your account.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Secure
            </div>
          </div>
        </div>

        <div className="space-y-5">

          {/* =======================================================
              CHANGE PASSWORD
          ======================================================= */}
          <section className="rounded-3xl bg-[#0B211C] border border-brand-dark-border overflow-hidden">

            {/* Card header */}
            <div className="px-5 sm:px-7 py-5 border-b border-brand-dark-border">
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-brand-teal/25 border border-brand-teal/40 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-brand-gold" />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    Change Password
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your account password securely.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-5 sm:p-7">

              <form
                onSubmit={handlePasswordChange}
                className="max-w-2xl space-y-5"
              >

                {/* Error */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-300 mb-2">
                    Current Password *
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                    <input
                      type="password"
                      value={passwords.old_password}
                      onChange={(e) =>
                        setPasswords((p) => ({
                          ...p,
                          old_password: e.target.value,
                        }))
                      }
                      placeholder="Enter your current password"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-dark-border bg-[#071713] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                      required
                    />
                  </div>
                </div>

                {/* New password row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-300 mb-2">
                      New Password *
                    </label>

                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                      <input
                        type="password"
                        value={passwords.new_password}
                        onChange={(e) =>
                          setPasswords((p) => ({
                            ...p,
                            new_password: e.target.value,
                          }))
                        }
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-dark-border bg-[#071713] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-300 mb-2">
                      Confirm New Password *
                    </label>

                    <div className="relative">
                      <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />

                      <input
                        type="password"
                        value={passwords.confirm_new_password}
                        onChange={(e) =>
                          setPasswords((p) => ({
                            ...p,
                            confirm_new_password: e.target.value,
                          }))
                        }
                        placeholder="Repeat new password"
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-dark-border bg-[#071713] text-white placeholder:text-slate-600 outline-none transition-all focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Password information */}
                <div className="rounded-xl bg-brand-teal-dark/50 border border-brand-dark-border p-3.5">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-brand-teal-soft shrink-0 mt-0.5" />

                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        Password requirement
                      </p>

                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Your new password must contain at least 6 characters.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-xs sm:text-sm shadow-gold-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </section>

          {/* =======================================================
              NOTIFICATION PREFERENCES
          ======================================================= */}
          <section className="rounded-3xl bg-[#0B211C] border border-brand-dark-border overflow-hidden">

            {/* Header */}
            <div className="px-5 sm:px-7 py-5 border-b border-brand-dark-border">
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-brand-gold" />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                    Notification Preferences
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Campus alerts and request status notifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification options */}
            <div className="p-5 sm:p-7">

              <div className="space-y-3">

                {/* Notification 1 */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#071713] border border-brand-dark-border">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-4 h-4 accent-[#2A6B5C] shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Complaint lifecycle updates
                    </p>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Submission, assignment, progress, and resolution updates.
                    </p>
                  </div>

                  <CheckCircle2 className="w-4 h-4 text-brand-teal-soft ml-auto shrink-0" />
                </div>

                {/* Notification 2 */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#071713] border border-brand-dark-border">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-4 h-4 accent-[#2A6B5C] shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Hostel outpass updates
                    </p>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Outpass status and parent verification confirmations.
                    </p>
                  </div>

                  <CheckCircle2 className="w-4 h-4 text-brand-teal-soft ml-auto shrink-0" />
                </div>

                {/* Notification 3 */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#071713] border border-brand-dark-border">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-4 h-4 accent-[#2A6B5C] shrink-0"
                  />

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Campus safety announcements
                    </p>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Important campus-wide safety and maintenance alerts.
                    </p>
                  </div>

                  <CheckCircle2 className="w-4 h-4 text-brand-teal-soft ml-auto shrink-0" />
                </div>

              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
                <Bell className="w-3.5 h-3.5 text-brand-gold" />
                <span>
                  Notification controls are managed by the campus system.
                </span>
              </div>

            </div>
          </section>

          {/* =======================================================
              SIGN OUT
          ======================================================= */}
          <section className="rounded-2xl bg-rose-950/20 border border-rose-900/50 p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4 text-rose-300" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-rose-200">
                    Sign Out of Current Session
                  </h4>

                  <p className="text-xs text-rose-300/60 mt-0.5">
                    You can sign back in at any time with your credentials.
                  </p>
                </div>

              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
