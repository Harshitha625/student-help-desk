import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  MapPin,
  Calendar,
  Phone,
  User,
  FileText,
  AlertCircle,
  ShieldCheck,
  Clock3,
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
      setErrors({
        to_date: ['Return date must be strictly after departure date.'],
      });
      return;
    }

    try {
      setLoading(true);

      const res = await outpassService.createOutpass(formData);

      addToast(
        `Outpass #${res.id} submitted for parent verification!`,
        'success'
      );

      navigate(`/outpasses/${res.id}`);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({
          non_field_errors: ['Network error. Please try again.'],
        });
      }

      addToast('Failed to submit outpass application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* =========================================================
            PAGE HEADER
        ========================================================== */}
        <div className="mb-8">
          <Link
            to="/outpasses"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-cream transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Outpasses</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-brand-teal/20 border border-brand-dark-border flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-brand-gold" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
                  Student HelpDesk
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-brand-cream">
                Apply for Outpass
              </h1>

              <p className="mt-2 text-sm text-brand-muted max-w-xl">
                Submit your travel details for hostel verification.
              </p>
            </div>

            {/* Secure application badge */}
            <div className="inline-flex self-start lg:self-auto items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-dark-border bg-brand-teal-dark/50 text-[11px] font-bold uppercase tracking-wide text-brand-biscuit">
              <ShieldCheck className="w-4 h-4 text-brand-teal-soft" />
              <span>Secure Application</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            SAFETY POLICY
        ========================================================== */}
        <div className="mb-7 rounded-2xl border border-brand-teal/60 bg-brand-teal-dark/80 p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-teal/40 border border-brand-teal flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-biscuit" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-cream mb-1">
                Residential Safety Policy
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-brand-muted">
                All outpass requests require direct phone confirmation with
                your registered parent/guardian by the hostel warden before
                gate departure authorization is granted.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            APPLICATION CARD
        ========================================================== */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl overflow-hidden border border-brand-dark-border bg-brand-teal-dark shadow-card-soft"
        >
          {/* Application header */}
          <div className="px-5 sm:px-7 py-5 border-b border-brand-dark-border bg-[#102F29]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-cream">
                  Outpass Application
                </h2>

                <p className="text-xs text-brand-muted mt-1">
                  Fill in the details below to continue.
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-brand-teal/30 border border-brand-dark-border flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-brand-biscuit" />
              </div>
            </div>
          </div>

          {/* Error */}
          {errors.non_field_errors && (
            <div className="mx-5 sm:mx-7 mt-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.non_field_errors[0]}</span>
            </div>
          )}

          {/* =======================================================
              TRAVEL ITINERARY
          ======================================================== */}
          <section className="px-5 sm:px-7 py-7 border-b border-brand-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/40 border border-brand-dark-border flex items-center justify-center">
                <MapPin className="w-4 h-4 text-brand-biscuit" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-brand-cream">
                  Travel Itinerary
                </h3>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Where and when are you travelling?
                </p>
              </div>
            </div>

            <div className="space-y-5">

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-brand-biscuit mb-2">
                  Destination City / Address *
                </label>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-teal-soft pointer-events-none" />

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore (Home) or NIE Campus, Mysore"
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream placeholder:text-[#60716C] outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30"
                    required
                  />
                </div>

                {errors.destination && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.destination[0]}
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-brand-biscuit mb-2">
                  Purpose / Reason for Travel *
                </label>

                <textarea
                  rows={4}
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Detail the family function, competition, medical appointment, or personal reason..."
                  className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream placeholder:text-[#60716C] outline-none transition-all resize-none focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30 leading-relaxed"
                  required
                />

                {errors.reason && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.reason[0]}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Departure */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-brand-biscuit mb-2">
                    <Calendar className="w-3.5 h-3.5 text-brand-teal-soft" />
                    Departure Date & Time *
                  </label>

                  <input
                    type="datetime-local"
                    name="from_date"
                    value={formData.from_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30 [color-scheme:dark]"
                    required
                  />

                  {errors.from_date && (
                    <p className="text-xs text-rose-300 mt-1.5">
                      {errors.from_date[0]}
                    </p>
                  )}
                </div>

                {/* Return */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-brand-biscuit mb-2">
                    <Clock3 className="w-3.5 h-3.5 text-brand-teal-soft" />
                    Expected Return Date & Time *
                  </label>

                  <input
                    type="datetime-local"
                    name="to_date"
                    value={formData.to_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30 [color-scheme:dark]"
                    required
                  />

                  {errors.to_date && (
                    <p className="text-xs text-rose-300 mt-1.5">
                      {errors.to_date[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =======================================================
              GUARDIAN DETAILS
          ======================================================== */}
          <section className="px-5 sm:px-7 py-7 border-b border-brand-dark-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/40 border border-brand-dark-border flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-brand-biscuit" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-brand-cream">
                  Guardian & Verification Details
                </h3>

                <p className="text-[11px] text-brand-muted mt-0.5">
                  Contact details used for verification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Parent name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-brand-biscuit mb-2">
                  <User className="w-3.5 h-3.5 text-brand-teal-soft" />
                  Parent / Guardian Name *
                </label>

                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleChange}
                  placeholder="Full name of guardian"
                  className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream placeholder:text-[#60716C] outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30"
                  required
                />

                {errors.parent_name && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.parent_name[0]}
                  </p>
                )}
              </div>

              {/* Parent contact */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-brand-biscuit mb-2">
                  <Phone className="w-3.5 h-3.5 text-brand-teal-soft" />
                  Parent Contact Number *
                </label>

                <input
                  type="text"
                  name="parent_contact"
                  value={formData.parent_contact}
                  onChange={handleChange}
                  placeholder="+91 94488 77665"
                  className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream placeholder:text-[#60716C] outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30"
                  required
                />

                {errors.parent_contact && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.parent_contact[0]}
                  </p>
                )}
              </div>

              {/* Emergency contact */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-brand-biscuit mb-2">
                  <Phone className="w-3.5 h-3.5 text-brand-teal-soft" />
                  Student Emergency Contact Number *
                </label>

                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Active student phone number while traveling"
                  className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream placeholder:text-[#60716C] outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30"
                  required
                />

                {errors.emergency_contact && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.emergency_contact[0]}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* =======================================================
              ADDITIONAL NOTES
          ======================================================== */}
          <section className="px-5 sm:px-7 py-7">
            <label className="flex items-center gap-1.5 text-xs font-bold text-brand-biscuit mb-2">
              <FileText className="w-3.5 h-3.5 text-brand-teal-soft" />
              Additional Travel Notes
              <span className="font-medium text-brand-muted">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Traveling via KSRTC bus, Ticket PNR #1029482, Accompanied by roommate"
              className="w-full px-4 py-3.5 text-sm rounded-xl border border-brand-dark-border bg-brand-dark/70 text-brand-cream placeholder:text-[#60716C] outline-none transition-all focus:border-brand-teal-soft focus:ring-2 focus:ring-brand-teal/30"
            />
          </section>

          {/* =======================================================
              SUBMIT AREA
          ======================================================== */}
          <div className="px-5 sm:px-7 py-5 bg-[#102F29] border-t border-brand-dark-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-brand-muted">
                <ShieldCheck className="w-4 h-4 text-brand-teal-soft" />
                <span>Your request will be sent for guardian verification.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[250px] py-3.5 px-6 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-sm shadow-gold-glow transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Bottom spacing / helper */}
        <div className="flex items-center justify-center gap-2 mt-5 text-[10px] uppercase tracking-wider text-brand-muted">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Student HelpDesk • Secure Campus Request</span>
        </div>
      </div>
    </div>
  );
}
