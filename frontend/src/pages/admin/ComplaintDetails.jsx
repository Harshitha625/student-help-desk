import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  MapPin,
  Calendar,
  Clock,
  Pencil,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { complaintService } from '../../services/complaintService';
import StatusBadge, {
  PriorityBadge,
} from '../../components/StatusBadge';

import LoadingSkeleton from '../../components/LoadingSkeleton';
import { useToast } from '../../context/ToastContext';

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await complaintService.getComplaint(id);

      setComplaint(data);
    } catch (err) {
      console.error(
        'Failed to load complaint:',
        err
      );

      setError(
        err.response?.data?.detail ||
          'Unable to load this complaint.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/complaints');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-teal mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Complaints
        </button>

        <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-sm text-center">

          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />

          <h2 className="font-heading text-lg font-bold text-brand-dark">
            Complaint Not Found
          </h2>

          <p className="text-sm text-brand-muted mt-2">
            {error || 'This complaint could not be found.'}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Back */}

      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Complaints
      </button>


      {/* Header */}

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-2 mb-3">

              <span className="text-xs font-mono font-bold text-brand-muted">
                Complaint #{complaint.id}
              </span>

              <StatusBadge
                status={complaint.status}
                size="xs"
              />

              <PriorityBadge
                priority={complaint.priority}
              />

            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
              {complaint.title}
            </h1>

            <p className="text-sm text-brand-muted mt-2">
              {complaint.category || 'Uncategorized'}
            </p>

          </div>


          {/* Edit */}

          <Link
            to="/admin/complaints"
            state={{
              editComplaint: complaint,
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Complaint
          </Link>

        </div>

      </div>


      {/* Main information */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Complaint details */}

        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft">

          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">

            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>

            <div>

              <h2 className="font-heading font-bold text-base text-brand-dark">
                Complaint Details
              </h2>

              <p className="text-xs text-brand-muted">
                Full complaint information
              </p>

            </div>

          </div>


          <div className="space-y-6">

            <div>

              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
                Description
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {complaint.description || 'No description provided.'}
                </p>

              </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">

                <div className="flex items-center gap-2 mb-2">

                  <MapPin className="w-4 h-4 text-brand-teal" />

                  <span className="text-xs font-semibold text-brand-muted">
                    Location
                  </span>

                </div>

                <p className="text-sm font-semibold text-brand-dark">
                  {complaint.location || 'Not specified'}
                </p>

              </div>


              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">

                <div className="flex items-center gap-2 mb-2">

                  <Calendar className="w-4 h-4 text-brand-teal" />

                  <span className="text-xs font-semibold text-brand-muted">
                    Created
                  </span>

                </div>

                <p className="text-sm font-semibold text-brand-dark">

                  {complaint.created_at
                    ? new Date(
                        complaint.created_at
                      ).toLocaleString()
                    : 'Not available'}

                </p>

              </div>

            </div>


            {/* Admin response */}

            {complaint.admin_response && (

              <div>

                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-2">
                  Administrative Response
                </p>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">

                  <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                    {complaint.admin_response}
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* Student information */}

        <div className="p-6 rounded-3xl bg-white border border-brand-border shadow-card-soft h-fit">

          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">

            <div className="w-10 h-10 rounded-xl bg-brand-cream text-brand-gold flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>

            <div>

              <h2 className="font-heading font-bold text-base text-brand-dark">
                Student
              </h2>

              <p className="text-xs text-brand-muted">
                Complaint reporter
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div>

              <p className="text-[11px] text-brand-muted uppercase tracking-wide">
                Name
              </p>

              <p className="text-sm font-bold text-brand-dark mt-1">
                {complaint.student_name || 'Unknown'}
              </p>

            </div>


            {complaint.student_email && (

              <div>

                <p className="text-[11px] text-brand-muted uppercase tracking-wide">
                  Email
                </p>

                <p className="text-sm font-medium text-slate-700 mt-1 break-all">
                  {complaint.student_email}
                </p>

              </div>

            )}


            {complaint.assigned_to && (

              <div>

                <p className="text-[11px] text-brand-muted uppercase tracking-wide">
                  Assigned To
                </p>

                <p className="text-sm font-bold text-brand-teal mt-1">
                  {complaint.assigned_to}
                </p>

              </div>

            )}


            <div className="pt-3 border-t border-slate-100">

              <div className="flex items-center gap-2 text-xs text-slate-500">

                <Clock className="w-4 h-4" />

                <span>
                  Status:{' '}
                  <strong className="text-brand-dark">
                    {complaint.status}
                  </strong>
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Status information */}

      <div className="p-5 rounded-2xl bg-brand-cream/60 border border-brand-border">

        <div className="flex items-start gap-3">

          <CheckCircle2 className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />

          <div>

            <h3 className="text-sm font-bold text-brand-dark">
              Administrative View
            </h3>

            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              This page provides the administrative view of the complaint.
              Use Edit Complaint to update its status, assignment, or
              administrative remarks.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}