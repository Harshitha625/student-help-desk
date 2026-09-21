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
  AlertCircle,
  ArrowLeft,
  MapPin,
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

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'Student';

  const initials = user?.first_name
    ? user.first_name[0].toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'S';

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[#0b2923] border border-[#28564b] text-[#f4f1e8] text-sm placeholder:text-[#78918a] outline-none transition-all duration-200 focus:border-[#4f9b89] focus:ring-2 focus:ring-[#2a6b5c]/30';

  const labelClass =
    'block text-[11px] font-bold uppercase tracking-[0.08em] text-[#8ba69e] mb-2';

  return (
    <div className="min-h-full bg-[#07110f] text-[#f4f1e8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-7"
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c49a45] mb-3">
            <User className="w-3.5 h-3.5" />
            Student HelpDesk
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#f4f1e8]">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#8ba69e] max-w-2xl">
            Manage your personal, academic, residential and guardian details.
          </p>
        </motion.div>

        {/* PROFILE HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative overflow-hidden rounded-[28px] border border-[#286052] bg-[#123f36] px-6 sm:px-8 py-7 sm:py-8 mb-6"
        >
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-24 w-64 h-64 rounded-full border border-[#4f8f7d]/20" />
          <div className="absolute -right-8 -bottom-32 w-64 h-64 rounded-full border border-[#4f8f7d]/20" />
          <div className="absolute right-28 top-10 w-2 h-2 rounded-full bg-[#c49a45]/70" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-[#0b2923] border border-[#3b7465] flex items-center justify-center shadow-lg">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-[#c49a45]">
                {initials}
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#c49a45]">
                  Student Account
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#dcefe8] text-[#1e6657] text-[10px] font-bold">
                  {user?.role || 'STUDENT'}
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#f4f1e8]">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-[#a7c0b9]">
                {user?.email || 'No email registered'}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#a7c0b9]">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#c49a45]" />
                  {formData.roll_number || 'Roll number not set'}
                </span>

                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#c49a45]" />
                  {formData.hostel || 'Hostel not assigned'}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c49a45]" />
                  Room {formData.room_number || '—'}
                </span>
              </div>
            </div>

            {/* Profile status */}
            <div className="hidden md:flex items-center gap-2 self-start px-3 py-2 rounded-xl border border-[#4f8f7d]/40 bg-[#0b2923]/50 text-xs text-[#b8d0c9]">
              <CheckCircle2 className="w-4 h-4 text-[#70c7ae]" />
              Profile
            </div>
          </div>
        </motion.div>

        {/* MAIN CONTENT */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] border border-[#28564b] bg-[#0b2923] overflow-hidden"
        >

          {/* FORM HEADER */}
          <div className="px-6 sm:px-8 py-6 border-b border-[#23483f] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c49a45] mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Information
              </div>

              <h3 className="font-heading text-xl font-bold text-[#f4f1e8]">
                Edit Profile
              </h3>

              <p className="text-xs text-[#78918a] mt-1">
                Keep your campus information up to date.
              </p>
            </div>

            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#153e35] border border-[#2d6255] items-center justify-center">
              <User className="w-5 h-5 text-[#c49a45]" />
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="px-6 sm:px-8 py-7 border-b border-[#23483f]">
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#4f9b89]">
                Personal Information
              </h4>
              <p className="text-xs text-[#718b83] mt-1">
                Your basic contact and identity details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ACADEMIC + RESIDENTIAL */}
          <div className="px-6 sm:px-8 py-7 border-b border-[#23483f]">
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#4f9b89]">
                Academic & Residential
              </h4>
              <p className="text-xs text-[#718b83] mt-1">
                Information used for campus and hostel services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>
                  Roll / USN
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    className={`${inputClass} pl-10 font-mono uppercase`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Department
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Hostel Block
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Room Number
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* GUARDIAN INFORMATION */}
          <div className="px-6 sm:px-8 py-7">
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#4f9b89]">
                Guardian Details
              </h4>
              <p className="text-xs text-[#718b83] mt-1">
                Contact information used for outpass verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div>
                <label className={labelClass}>
                  Guardian Name
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Guardian Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f8177] pointer-events-none" />
                  <input
                    type="text"
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER / SAVE */}
          <div className="px-6 sm:px-8 py-5 bg-[#091f1a] border-t border-[#23483f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-start gap-2.5 text-xs text-[#718b83]">
              <ShieldCheck className="w-4 h-4 text-[#4f9b89] shrink-0 mt-0.5" />
              <span>
                Your profile information is used for campus services and
                residential verification.
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#c49a45] hover:bg-[#d1aa5b] text-[#07110f] font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(196,154,69,0.16)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-[#07110f] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>

          </div>
        </motion.form>
      </div>
    </div>
  );
}
