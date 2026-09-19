import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Building2, 
  Paperclip, 
  User, 
  Send, 
  CheckCircle2, 
  ShieldOff, 
  AlertCircle, 
  Wrench,
  MessageSquareQuote
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getComplaint(id);
      setComplaint(data);
      const commentsData = await complaintService.getComments(id);
      setComments(commentsData || []);
    } catch (err) {
      console.error('Failed to load complaint details:', err);
      addToast('Could not load complaint details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const created = await complaintService.addComment(id, newComment.trim());
      setComments((prev) => [...prev, created]);
      setNewComment('');
      addToast('Remark posted successfully.', 'success');
    } catch (err) {
      console.error('Error posting comment:', err);
      addToast('Failed to post comment. Try again.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-muted">Complaint not found or you don't have access.</p>
        <Link to="/complaints" className="mt-3 inline-block text-brand-teal font-semibold text-sm">
          Return to complaints list
        </Link>
      </div>
    );
  }

  // Stages for timeline
  const stages = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
  const currentStageIndex = stages.indexOf(complaint.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to={user.role === 'ADMIN' ? '/admin/complaints' : user.role === 'WARDEN' ? '/warden' : '/complaints'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Complaint Register</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-muted">Complaint #{complaint.id}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-border text-brand-teal">
                {complaint.category}
              </span>
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
              {complaint.title}
            </h1>
          </div>

          <StatusBadge status={complaint.status} size="md" />
        </div>

        {/* Dynamic Activity Timeline */}
        <div className="p-6 rounded-2xl bg-brand-cream/60 border border-brand-border space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-teal" />
            <span>Resolution Activity Progression</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stages.map((stg, idx) => {
              const isPassed = currentStageIndex >= idx;
              const isCurrent = complaint.status === stg;
              return (
                <div
                  key={stg}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                      : isPassed
                      ? 'bg-teal-50/70 border-brand-teal/30 text-brand-teal font-semibold'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase mb-0.5">Stage 0{idx + 1}</div>
                  <div className="text-xs font-bold">{stg}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-brand-muted uppercase mb-1">Issue Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-brand-border/60">
              {complaint.description}
            </p>
          </div>

          {/* Location & Meta info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 text-xs">
              <span className="text-brand-muted block mb-0.5">Campus Location</span>
              <span className="font-semibold text-brand-dark flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {complaint.location}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 text-xs">
              <span className="text-brand-muted block mb-0.5">Assigned Department</span>
              <span className="font-semibold text-brand-teal flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" />
                {complaint.assigned_to || 'Pending Assignment'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 text-xs">
              <span className="text-brand-muted block mb-0.5">Reported By</span>
              <span className="font-semibold text-brand-dark flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {complaint.student_name}
              </span>
            </div>
          </div>

          {/* Official Admin / Technician Response if present */}
          {complaint.admin_response && (
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-brand-teal/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-teal">
                <MessageSquareQuote className="w-4 h-4 text-brand-gold" />
                <span>Official Campus Resolution Remarks</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                {complaint.admin_response}
              </p>
            </div>
          )}

          {/* Attachment Preview */}
          {complaint.attachment && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-brand-muted uppercase mb-2">Photo Evidence</h4>
              <a
                href={complaint.attachment}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-dark text-xs font-medium border border-brand-border transition-colors"
              >
                <Paperclip className="w-4 h-4 text-brand-teal" />
                <span>View Attached Photo Evidence ↗</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Remarks & Comments Thread */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft space-y-6">
        <h3 className="font-heading text-lg font-bold text-brand-dark flex items-center gap-2">
          <span>Dialogue & Technician Updates</span>
          <span className="text-xs font-normal text-brand-muted">({comments.length})</span>
        </h3>

        {/* Comments Feed */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-xs text-brand-muted italic py-2">
              No remarks yet. You can post an update or inquiry below.
            </p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-border/70 space-y-2 text-xs sm:text-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-dark">{c.user_name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal">
                      {c.user_role}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-muted">
                    {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{c.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input */}
        <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-100 flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your message or technician inquiry..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
            disabled={submittingComment}
          />
          <button
            type="submit"
            disabled={submittingComment || !newComment.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {submittingComment ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
