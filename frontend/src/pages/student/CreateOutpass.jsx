import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  MapPin, 
  Calendar, 
  Phone, 
  User, 
  FileText, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { outpassService } from '../../services/outpassService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CreateOutpass() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    reason: '',
    from_date: '',
    to_date: '',
    parent_name: user?.student_profile?.guardian_name || '',
    parent_contact: user?.student_profile?.guardian_phone || '',
    emergency_contact: user?.phone || '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    // Basic date validation
    if (new Date(formData.from_date) >= new Date(formData.to_date)) {
      setErrors({ to_date: ['Return date must be strictly after departure date.'] });
      return;
    }

    try {
      setLoading(true);
      const res = await outpassService.createOutpass(formData);
      addToast(`Outpass #${res.id} submitted for parent verification!`, 'success');
      navigate(`/outpasses/${res.id}`);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['Network error. Please try again.'] });
      }
      addToast('Failed to submit outpass application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/outpasses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-teal mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Outpasses</span>
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Hostel Outpass Application
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Digital permission workflow with automated guardian phone verification
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 mb-6">
        <ShieldCheck className="w-4 h-4 shrink-0 text-brand-gold mt-0.5" />
        <div className="leading-relaxed">
          <strong>Residential Safety Policy:</strong> All outpass requests require direct phone confirmation with your registered parent/guardian by the hostel warden before gate departure authorization is granted.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
        {errors.non_field_errors && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.non_field_errors[0]}</span>
          </div>
        )}

        {/* Journey Details */}
        <div className="border-b border-slate-100 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-4">
            Travel Itinerary
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination City / Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore (Home) or NIE Campus, Mysore"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
              </div>
              {errors.destination && <p className="text-xs text-rose-600 mt-1">{errors.destination[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Purpose / Reason for Travel *
              </label>
              <textarea
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Detail the family function, competition, medical appointment, or personal reason..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none leading-relaxed"
                required
              />
              {errors.reason && <p className="text-xs text-rose-600 mt-1">{errors.reason[0]}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Departure Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="from_date"
                  value={formData.from_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
                {errors.from_date && <p className="text-xs text-rose-600 mt-1">{errors.from_date[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Return Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="to_date"
                  value={formData.to_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                  required
                />
                {errors.to_date && <p className="text-xs text-rose-600 mt-1">{errors.to_date[0]}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Guardian & Emergency Contacts */}
        <div className="border-b border-slate-100 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal mb-4">
            Guardian & Verification Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
                placeholder="Full name of guardian"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                required
              />
              {errors.parent_name && <p className="text-xs text-rose-600 mt-1">{errors.parent_name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Contact Number *
              </label>
              <input
                type="text"
                name="parent_contact"
                value={formData.parent_contact}
                onChange={handleChange}
                placeholder="+91 94488 77665"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                required
              />
              {errors.parent_contact && <p className="text-xs text-rose-600 mt-1">{errors.parent_contact[0]}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Emergency Contact Number *
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Active student phone number while traveling"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
                required
              />
              {errors.emergency_contact && <p className="text-xs text-rose-600 mt-1">{errors.emergency_contact[0]}</p>}
            </div>
          </div>
        </div>

        {/* Additional Travel Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Additional Travel Notes (Optional)
          </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g. Traveling via KSRTC bus, Ticket PNR #1029482, Accompanied by roommate"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Outpass for Verification</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
