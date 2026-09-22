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
  RotateCcw,
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
  const [verificationStatus, setVerificationStatus] = useState('Verified');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifying, setVerifying] = useState(false);
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
      setDecision(data.status || 'Approved');
      setRemarks(data.reviewer_remarks || '');
    } catch (err) {
      console.error('Failed to load outpass:', err);
      addToast('Failed to load outpass details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutpass();
  }, [id]);

  const handleParentVerification = async () => {
    try {
      setVerifying(true);

      await outpassService.verifyParent(id, {
        verification_status: verificationStatus,
        verification_notes: verificationNotes,
      });

      addToast('Parent verification updated successfully', 'success');
      await fetchOutpass();
    } catch (err) {
      console.error('Failed to verify parent:', err);
      addToast('Failed to update parent verification', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleReviewDecision = async () => {
    try {
      setReviewing(true);

      await outpassService.reviewOutpass(id, {
        status: decision,
        reviewer_remarks: remarks,
      });

      addToast('Outpass decision updated successfully', 'success');
      await fetchOutpass();
    } catch (err) {
      console.error('Failed to review outpass:', err);
      addToast('Failed to update outpass decision', 'error');
    } finally {
      setReviewing(false);
    }
  };

  const handleCompleteOutpass = async () => {
    try {
      await outpassService.completeOutpass(id);

      addToast('Outpass marked as completed', 'success');
      await fetchOutpass();
    } catch (err) {
      console.error('Failed to complete outpass:', err);
      addToast('Failed to complete outpass', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06130f] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <LoadingSkeleton count={5} />
        </div>
      </div>
    );
  }

  if (!outpass) {
    return (
      <div className="min-h-screen bg-[#06130f] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-[28px] border border-[#29483f] bg-[#0b211b] p-8 text-center shadow-2xl">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#102b24] border border-[#35574f] flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-[#d4b477]" />
            </div>

            <h2 className="premium-serif mt-5 text-2xl font-semibold text-[#f5eee2]">
              Outpass not found
            </h2>

            <p className="mt-2 text-sm text-[#aebdb5]">
              The requested outpass could not be loaded.
            </p>

            <Link
              to="/warden/outpasses"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-[#c49a45] hover:bg-[#d4b477] text-[#06130f] text-sm font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Outpass Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06130f] text-[#f5eee2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* Back + Page Heading */}
        <div className="flex flex-col gap-5">
          <Link
            to="/warden/outpasses"
            className="inline-flex items-center gap-2 w-fit text-sm text-[#aebdb5] hover:text-[#d4b477] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Outpass Requests
          </Link>

          <div className="rounded-[28px] border border-[#29483f] bg-[#0b211b] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)] relative overflow-hidden">
            <div className="absolute -top-24 -right-20 w-56 h-56 rounded-full bg-[#c49a45]/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#c49a45] font-semibold">
                  Warden Desk
                </p>

                <h1 className="premium-serif mt-2 text-2xl sm:text-3xl font-semibold text-[#f5eee2]">
                  Outpass Review
                </h1>

                <p className="mt-2 text-sm text-[#aebdb5]">
                  Review student information, guardian verification, and the final exit decision.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-full border border-[#35574f] bg-[#102b24] text-xs font-mono text-[#d2dad5]">
                  Pass #{outpass.id}
                </span>

                <StatusBadge status={outpass.status} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Student Context */}
        <div className="rounded-[28px] border border-[#29483f] bg-[#0b1d18] overflow-hidden">
          <div className="px-5 sm:px-7 py-4 border-b border-[#29483f] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#123f36] border border-[#35574f] flex items-center justify-center">
              <User className="w-5 h-5 text-[#d4b477]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#f5eee2]">
                Student Information
              </h2>
              <p className="text-xs text-[#82958d]">
                Residential student details
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#82958d]">
                Student
              </p>
              <p className="mt-1 text-sm font-semibold text-[#f5eee2]">
                {outpass.student_name || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#82958d]">
                Roll Number
              </p>
              <p className="mt-1 text-sm font-semibold text-[#f5eee2]">
                {outpass.student_roll || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#82958d]">
                Hostel
              </p>
              <p className="mt-1 text-sm font-semibold text-[#f5eee2]">
                {outpass.student_hostel || 'Hostel'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <p className="text-[10px] uppercase tracking-wider text-[#82958d]">
                Room
              </p>
              <p className="mt-1 text-sm font-semibold text-[#f5eee2]">
                {outpass.student_room || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Travel Information */}
        <div className="rounded-[28px] border border-[#29483f] bg-[#0b1d18] overflow-hidden">
          <div className="px-5 sm:px-7 py-4 border-b border-[#29483f] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#123f36] border border-[#35574f] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#d4b477]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#f5eee2]">
                Travel Information
              </h2>
              <p className="text-xs text-[#82958d]">
                Requested destination and travel period
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <div className="flex items-center gap-2 text-[#82958d]">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Destination</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#f5eee2]">
                {outpass.destination || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <div className="flex items-center gap-2 text-[#82958d]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Travel Period</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#f5eee2]">
                {new Date(outpass.from_date).toLocaleDateString()} →{' '}
                {new Date(outpass.to_date).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <div className="flex items-center gap-2 text-[#82958d]">
                <Building2 className="w-4 h-4" />
                <span className="text-xs">Reason</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#f5eee2]">
                {outpass.reason || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="rounded-[28px] border border-[#29483f] bg-[#0b1d18] overflow-hidden">
          <div className="px-5 sm:px-7 py-4 border-b border-[#29483f] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#123f36] border border-[#35574f] flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-[#d4b477]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#f5eee2]">
                Guardian Information
              </h2>
              <p className="text-xs text-[#82958d]">
                Parent / guardian contact details
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <div className="flex items-center gap-2 text-[#82958d]">
                <User className="w-4 h-4" />
                <span className="text-xs">Guardian Name</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#f5eee2]">
                {outpass.parent_name || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#102b24] border border-[#29483f] p-4">
              <div className="flex items-center gap-2 text-[#82958d]">
                <Phone className="w-4 h-4" />
                <span className="text-xs">Guardian Contact</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#f5eee2]">
                {outpass.parent_contact || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Parent Verification */}
        <div className="rounded-[28px] border border-[#29483f] bg-[#0b1d18] overflow-hidden">
          <div className="px-5 sm:px-7 py-4 border-b border-[#29483f] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#123f36] border border-[#35574f] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#d4b477]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#f5eee2]">
                Parent Verification
              </h2>
              <p className="text-xs text-[#82958d]">
                Record guardian phone verification
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#d2dad5] mb-2">
                Verification Status
              </label>

              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full rounded-xl border border-[#35574f] bg-[#102b24] px-4 py-3 text-sm text-[#f5eee2] outline-none focus:border-[#c49a45] focus:ring-1 focus:ring-[#c49a45]"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d2dad5] mb-2">
                Verification Notes
              </label>

              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={4}
                placeholder="Enter notes from the guardian verification call..."
                className="w-full rounded-xl border border-[#35574f] bg-[#102b24] px-4 py-3 text-sm text-[#f5eee2] placeholder:text-[#82958d] outline-none resize-none focus:border-[#c49a45] focus:ring-1 focus:ring-[#c49a45]"
              />
            </div>

            <button
              type="button"
              onClick={handleParentVerification}
              disabled={verifying}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c49a45] hover:bg-[#d4b477] disabled:opacity-50 disabled:cursor-not-allowed text-[#06130f] text-sm font-bold transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              {verifying ? 'Saving...' : 'Save Verification'}
            </button>
          </div>
        </div>

        {/* Warden Decision */}
        <div className="rounded-[28px] border border-[#29483f] bg-[#0b1d18] overflow-hidden">
          <div className="px-5 sm:px-7 py-4 border-b border-[#29483f] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#123f36] border border-[#35574f] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#d4b477]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#f5eee2]">
                Warden Decision
              </h2>
              <p className="text-xs text-[#82958d]">
                Approve or reject the student's outpass request
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  decision === 'Approved'
                    ? 'border-[#c49a45] bg-[#123f36]'
                    : 'border-[#29483f] bg-[#102b24] hover:border-[#35574f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0b211b] flex items-center justify-center">
                    <Check className="w-4 h-4 text-[#d4b477]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#f5eee2]">
                      Approve
                    </p>
                    <p className="text-xs text-[#82958d]">
                      Grant exit permission
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  decision === 'Rejected'
                    ? 'border-[#c49a45] bg-[#123f36]'
                    : 'border-[#29483f] bg-[#102b24] hover:border-[#35574f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0b211b] flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-[#d4b477]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#f5eee2]">
                      Reject
                    </p>
                    <p className="text-xs text-[#82958d]">
                      Deny the outpass request
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#d2dad5] mb-2">
                Reviewer Remarks
              </label>

              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                placeholder="Enter your review remarks..."
                className="w-full rounded-xl border border-[#35574f] bg-[#102b24] px-4 py-3 text-sm text-[#f5eee2] placeholder:text-[#82958d] outline-none resize-none focus:border-[#c49a45] focus:ring-1 focus:ring-[#c49a45]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReviewDecision}
                disabled={reviewing}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c49a45] hover:bg-[#d4b477] disabled:opacity-50 disabled:cursor-not-allowed text-[#06130f] text-sm font-bold transition-colors"
              >
                {decision === 'Approved' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}

                {reviewing ? 'Saving...' : 'Save Decision'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/warden/outpasses')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#35574f] bg-[#102b24] hover:bg-[#123f36] text-[#d2dad5] text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Complete Outpass */}
        {outpass.status === 'Approved' && (
          <div className="rounded-[28px] border border-[#29483f] bg-[#0b1d18] overflow-hidden">
            <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#123f36] border border-[#35574f] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5 text-[#d4b477]" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#f5eee2]">
                    Mark Outpass as Completed
                  </h2>

                  <p className="mt-1 text-xs sm:text-sm text-[#82958d]">
                    Use this after the student has returned and the outpass process is complete.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCompleteOutpass}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#35574f] bg-[#102b24] hover:bg-[#123f36] text-[#d4b477] text-sm font-bold transition-colors shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Completed
              </button>
            </div>
          </div>
        )}

        {/* Bottom Back */}
        <div className="pb-6">
          <Link
            to="/warden/outpasses"
            className="inline-flex items-center gap-2 text-xs text-[#82958d] hover:text-[#d4b477] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to all outpass requests
          </Link>
        </div>
      </div>
    </div>
  );
}