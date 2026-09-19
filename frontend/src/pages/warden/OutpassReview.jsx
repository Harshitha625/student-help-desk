import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Phone, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  AlertCircle, 
  User, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { outpassService } from '../../services/outpassService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function OutpassReview() {
  const { id } = useParams();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [outpass, setOutpass] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification form state
  const [verificationStatus, setVerificationStatus] = useState('Verified');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Review (Approve/Reject) state
  const [decision, setDecision] = useState('Approved');
  const [remarks, setRemarks] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchOutpass = async () => {
    try {
      setLoading(true);
      const data = await outpassService.getOutpass(id);
      setOutpass(data);
      setVerificationStatus(data.verification_status || 'Verified');
      setVerificationNotes(data.verification_notes || '');
      setRemarks(data.reviewer_remarks || '');
    } catch (err) {
      console.error('Failed to load outpass for review:', err);
      addToast('Could not load outpass record.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutpass();
  }, [id]);

  const handleParentVerification = async (e) => {
    e.preventDefault();
    try {
      setVerifying(true);
      const updated = await outpassService.verifyParent(id, {
        verification_status: verificationStatus,
        verification_notes: verificationNotes,
      });
      setOutpass(updated);
      addToast(`Parent verification recorded as '${verificationStatus}'.`, 'success');
    } catch (err) {
      console.error('Error verifying parent:', err);
      addToast('Failed to record parent verification.', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleReviewDecision = async (e) => {
    e.preventDefault();
    try {
      setReviewing(true);
      const updated = await outpassService.reviewOutpass(id, {
        status: decision,
        reviewer_remarks: remarks,
      });
      setOutpass(updated);
      addToast(`Outpass ${decision.toLowerCase()} successfully.`, 'success');
    } catch (err) {
      console.error('Error recording review decision:', err);
      addToast('Failed to update outpass status.', 'error');
    } finally {
      setReviewing(false);
    }
  };

  const handleCompleteOutpass = async () => {
    try {
      const updated = await outpassService.completeOutpass(id);
      setOutpass(updated);
      addToast('Outpass marked as Completed (Student returned to campus).', 'success');
    } catch (err) {
      console.error('Error completing outpass:', err);
      addToast('Failed to mark outpass completed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-muted">Outpass not found.</p>
        <Link to="/warden/outpasses" className="mt-3 inline-block text-brand-teal font-semibold text-sm">
          Return to Outpasses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/warden/outpasses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Warden Queue</span>
        </Link>
      </div>

      {/* Main Request Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-muted">Outpass #{outpass.id}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-cream border border-brand-border text-brand-teal">
                Resident Verification Desk
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
              {outpass.student_name} — {outpass.destination}
            </h1>
          </div>

          <StatusBadge status={outpass.status} size="md" />
        </div>

        {/* Student & Resident Context */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-brand-cream/60 border border-brand-border/70 text-xs">
          <div>
            <span className="text-brand-muted block">Student USN / Roll</span>
            <span className="font-bold text-brand-dark font-mono text-sm">{outpass.student_roll || 'N/A'}</span>
          </div>
          <div>
            <span className="text-brand-muted block">Hostel & Room</span>
            <span className="font-semibold text-brand-dark">{outpass.student_hostel} • Room {outpass.student_room}</span>
          </div>
          <div>
            <span className="text-brand-muted block">Student Contact Phone</span>
            <span className="font-semibold text-brand-dark">{outpass.student_phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-brand-muted block">Emergency Travel Contact</span>
            <span className="font-semibold text-brand-dark">{outpass.emergency_contact}</span>
          </div>
        </div>

        {/* Travel Info */}
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-brand-muted uppercase mb-1">Reason for Outpass</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-brand-border/60">
              {outpass.reason}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60">
              <span className="text-brand-muted block mb-0.5">Departure Schedule</span>
              <span className="font-bold text-brand-dark text-sm">
                {new Date(outpass.from_date).toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60">
              <span className="text-brand-muted block mb-0.5">Expected Return Schedule</span>
              <span className="font-bold text-brand-dark text-sm">
                {new Date(outpass.to_date).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Block 1: Parent Verification */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-brand-gold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-brand-dark">1. Parent / Guardian Tele-Verification</h3>
              <p className="text-xs text-brand-muted">
                Call guardian at <strong>{outpass.parent_contact}</strong> ({outpass.parent_name})
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900">
            Status: {outpass.verification_status}
          </span>
        </div>

        <form onSubmit={handleParentVerification} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Verification Outcome
            </label>
            <div className="flex flex-wrap gap-2.5">
              {['Verified', 'Failed', 'Pending'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setVerificationStatus(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    verificationStatus === st
                      ? st === 'Verified'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : st === 'Failed'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-amber-500 text-white border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-brand-border hover:bg-slate-100'
                  }`}
                >
                  {st === 'Verified' && '✓ Mark Verified'}
                  {st === 'Failed' && '✕ Verification Failed'}
                  {st === 'Pending' && '⏳ Keep Pending'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Verification Audit Notes (Recorded with timestamp)
            </label>
            <input
              type="text"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="e.g. Called father Mr. Ramesh Rao at 10:15 AM; confirmed student travel to sister wedding."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-60"
          >
            {verifying ? 'Updating...' : 'Save Parent Verification'}
          </button>
        </form>
      </div>

      {/* Action Block 2: Warden Authorization Decision */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-teal/10 text-brand-teal">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-dark">2. Warden Gate Pass Authorization</h3>
            <p className="text-xs text-brand-muted">Grant departure pass or decline with official reason</p>
          </div>
        </div>

        <form onSubmit={handleReviewDecision} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Decision
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  decision === 'Approved'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-brand-border'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Gate Pass</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                  decision === 'Rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-brand-border'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Warden Remarks / Conditions
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Approved. Student must report to CA-block security guard by Sunday 8:30 PM."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={reviewing}
            className="px-6 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-teal-dark text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-60"
          >
            {reviewing ? 'Recording Decision...' : 'Record Warden Decision'}
          </button>
        </form>

        {/* Action Block 3: Mark Completed */}
        {outpass.status === 'Approved' && (
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between bg-teal-50/50 p-4 rounded-2xl border border-brand-teal/20">
            <div>
              <span className="text-xs font-bold text-brand-dark block">Student Return Sign-Off</span>
              <span className="text-[11px] text-brand-muted">Once the student returns safely to hostel grounds, mark pass completed.</span>
            </div>
            <button
              onClick={handleCompleteOutpass}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              Mark Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
