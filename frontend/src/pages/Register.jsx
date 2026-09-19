import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Building2, 
  Hash, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BrandLogo from '../components/BrandLogo';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirm_password: '',
    roll_number: '',
    department: '',
    hostel: '',
    room_number: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: ['Passwords do not match.'] });
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      addToast('Student account registered successfully! Welcome to HelpDesk.', 'success');
      navigate('/student', { replace: true });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['Network error. Please try again.'] });
      }
      addToast('Registration could not be completed. Check errors.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-cream">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo linkTo="/" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
            Student Registration
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">
            Create your official campus service profile to raise tickets and apply for outpasses
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-brand-teal/20 text-xs text-brand-teal flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-gold" />
          <span>
            Public registration provisions <strong>Student accounts</strong>. Warden and Admin accounts are provisioned securely by Campus Authorities.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-5">
          {errors.non_field_errors && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errors.non_field_errors[0]}</span>
            </div>
          )}

          {/* Personal Information */}
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-3">
              Account & Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. harshitha"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
                {errors.username && <p className="text-[11px] text-rose-600 mt-1">{errors.username[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@student.campus.edu"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
                {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Harshitha"
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
                  placeholder="Rao"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
                {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
                {errors.confirm_password && <p className="text-[11px] text-rose-600 mt-1">{errors.confirm_password[0]}</p>}
              </div>
            </div>
          </div>

          {/* Academic & Hostel Information */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-3">
              Student & Hostel Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roll / USN Number *</label>
                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  placeholder="e.g. 21CS042"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
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
                  placeholder="e.g. Cauvery Hostel (Block B)"
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
                  placeholder="e.g. B-304"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Complete Student Registration</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-brand-muted">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-brand-teal hover:underline">
                Sign in here
              </Link>
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
