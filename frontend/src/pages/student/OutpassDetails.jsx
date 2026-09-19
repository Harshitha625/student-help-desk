import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Sparkles,
  Printer
} from 'lucide-react';
import { outpassService } from '../../services/outpassService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function OutpassDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOutpass = async () => {
    try {
      setLoading(true);
      const data = await outpassService.getOutpass(id);
      setOutpass(data);
    } catch (err) {
      console.error('Failed to load outpass details:', err);
      addToast('Could not load outpass record.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutpass();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-muted">Outpass not found or unauthorized.</p>
        <Link to="/outpasses" className="mt-3 inline-block text-brand-teal font-semibold text-sm">
          Return to Outpasses
        </Link>
      </div>
    );
  }

  // 5-Stage Outpass Progression
  const steps = [
    { label: 'Application Submitted', key: 'Pending' },
    { label: 'Parent Verification', key: 'Parent Verification' },
    { label: 'Warden Review', key: 'Warden Review' },
    { label: 'Approved', key: 'Approved' },
    { label: 'Completed', key: 'Completed' },
  ];

  const getStepStatus = (index) => {
    if (outpass.status === 'Rejected') {
      return index <= 1 ? 'completed' : 'rejected';
    }
    const order = ['Pending', 'Parent Verification', 'Warden Review', 'Approved', 'Completed'];
    const currentIndex = order.indexOf(outpass.status);
    if (currentIndex >= index) return 'completed';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back link */}
      <div>
        <Link
          to={user.role === 'WARDEN' ? '/warden/outpasses' : user.role === 'ADMIN' ? '/admin/outpasses' : '/outpasses'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Outpass Desk</span>
        </Link>
      </div>

      {/* Main Outpass Pass Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
        {/* Pass Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-muted">Gate Pass #{outpass.id}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-cream border border-brand-border text-brand-teal">
                Hostel Outpass
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark flex items-center gap-2">
              <MapPin className="w-6 h-6 text-brand-teal" />
              <span>{outpass.destination}</span>
            </h1>
          </div>

          <StatusBadge status={outpass.status} size="md" />
        </div>

        {/* Animated Multi-Stage Status Tracker */}
        <div className="p-6 rounded-2xl bg-brand-cream/60 border border-brand-border space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-teal" />
            <span>Outpass Authorization Workflow</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {steps.map((st, i) => {
              const statusState = getStepStatus(i);
              const isApproved = outpass.status === 'Approved' && st.key === 'Approved';
              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isApproved
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                      : statusState === 'completed'
                      ? 'bg-teal-50 border-brand-teal/40 text-brand-teal font-semibold'
                      : statusState === 'rejected'
                      ? 'bg-rose-50 border-rose-200 text-rose-400'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase mb-0.5">Stage 0{i + 1}</div>
                  <div className="text-xs leading-snug">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Travel Information */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-brand-muted uppercase mb-1">Purpose of Travel</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-brand-border/60">
              {outpass.reason}
            </p>
          </div>

          {/* Departure & Arrival Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border/60 space-y-1">
              <span className="text-xs text-brand-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                Scheduled Departure
              </span>
              <span className="font-heading font-bold text-base text-brand-dark block">
                {new Date(outpass.from_date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border/60 space-y-1">
              <span className="text-xs text-brand-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                Expected Return
              </span>
              <span className="font-heading font-bold text-base text-brand-dark block">
                {new Date(outpass.to_date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
              </span>
            </div>
          </div>

          {/* Parent Verification Section */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>Parent / Guardian Verification Record</span>
              </h4>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-amber-300 text-amber-800 shadow-2xs">
                {outpass.verification_status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
              <div>
                <span className="text-brand-muted block">Guardian Name:</span>
                <span className="font-semibold text-brand-dark">{outpass.parent_name}</span>
              </div>
              <div>
                <span className="text-brand-muted block">Contact Phone:</span>
                <span className="font-semibold text-brand-dark">{outpass.parent_contact}</span>
              </div>
            </div>

            {outpass.verification_notes && (
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-700">
                <span className="font-semibold text-amber-900 block mb-0.5">Warden Verification Notes:</span>
                {outpass.verification_notes}
              </div>
            )}
          </div>

          {/* Warden Review remarks if approved/rejected */}
          {outpass.reviewer_remarks && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border text-xs space-y-1">
              <span className="font-semibold text-slate-700 block">
                Official Warden Authorization Remarks (Reviewed by {outpass.reviewer_name || 'Warden'}):
              </span>
              <p className="text-slate-600 leading-relaxed italic">
                "{outpass.reviewer_remarks}"
              </p>
            </div>
          )}

          {outpass.notes && (
            <div className="text-xs text-brand-muted">
              <span>Additional Itinerary Notes: </span>
              <span className="text-slate-600">{outpass.notes}</span>
            </div>
          )}
        </div>

        {/* Digital Gate Pass Authorized Stamp */}
        {outpass.status === 'Approved' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Authorized Digital Gate Pass Active</span>
                <span>Present this screen or reference Pass #{outpass.id} at the hostel campus security gate.</span>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
