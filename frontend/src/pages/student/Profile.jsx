import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  BookOpen, 
  Hash, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    roll_number: '',
    department: '',
    hostel: '',
    room_number: '',
    guardian_name: '',
    guardian_phone: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        roll_number: user.student_profile?.roll_number || '',
        department: user.student_profile?.department || '',
        hostel: user.student_profile?.hostel || '',
        room_number: user.student_profile?.room_number || '',
        guardian_name: user.student_profile?.guardian_name || '',
        guardian_phone: user.student_profile?.guardian_phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await authService.updateProfile(formData);
      updateUser(res.user);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      addToast('Failed to update profile details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Student Campus Profile
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Manage your residential room details, guardian emergency contacts, and academic info
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft text-center space-y-4 h-fit">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-teal-dark to-brand-dark text-brand-gold font-heading font-bold text-3xl flex items-center justify-center mx-auto border border-brand-teal/40 shadow-sm">
            {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase()}
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg text-brand-dark">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
            </h3>
            <p className="text-xs text-brand-muted">{user?.email || 'No email registered'}</p>
            <span className="mt-2 inline-block text-xs font-bold px-3 py-0.5 rounded-full bg-teal-50 text-brand-teal border border-brand-teal/20">
              {user?.role}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-muted">Roll / USN:</span>
              <span className="font-semibold text-brand-dark font-mono">
                {formData.roll_number || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Hostel:</span>
              <span className="font-semibold text-brand-dark text-right truncate max-w-[150px]">
                {formData.hostel || 'Unassigned'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Room:</span>
              <span className="font-semibold text-brand-dark">
                {formData.room_number || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal border-b border-slate-100 pb-3">
              Edit Profile Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roll / USN</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hostel Block</label>
                <input
                  type="text"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number</label>
                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name</label>
                <input
                  type="text"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Phone</label>
                <input
                  type="text"
                  name="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
