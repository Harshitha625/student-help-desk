import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Radio,
  Send,
  Users,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';

export default function Broadcast() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target_role: 'ALL',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage('');

    if (!formData.title.trim()) {
      setErrors({
        title: ['Please enter an announcement title.'],
      });
      return;
    }

    if (!formData.message.trim()) {
      setErrors({
        message: ['Please enter the announcement message.'],
      });
      return;
    }

    try {
      setLoading(true);

      const response = await notificationService.broadcast({
        title: formData.title.trim(),
        message: formData.message.trim(),
        target_role: formData.target_role,
      });

      const message =
        response?.message || 'Broadcast sent successfully.';

      setSuccessMessage(message);
      addToast(message, 'success');

      setFormData({
        title: '',
        message: '',
        target_role: 'ALL',
      });
    } catch (err) {
      console.error('Broadcast failed:', err);

      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({
          non_field_errors: [
            'Network error. Please check the backend server and try again.',
          ],
        });
      }

      addToast('Failed to send broadcast.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cream border border-brand-border text-brand-teal text-xs font-semibold mb-3">
          <Radio className="w-3.5 h-3.5" />
          <span>Campus Announcement</span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Broadcast Alert
        </h1>

        <p className="text-xs sm:text-sm text-brand-muted mt-1">
          Send an announcement to students, wardens, or everyone on the
          Student HelpDesk.
        </p>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />

          <div>
            <p className="text-sm font-bold">
              Broadcast sent successfully
            </p>

            <p className="text-xs mt-1">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* General Error */}
      {errors.non_field_errors && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

          <div>
            <p className="text-sm font-bold">
              Could not send broadcast
            </p>

            <p className="text-xs mt-1">
              {Array.isArray(errors.non_field_errors)
                ? errors.non_field_errors[0]
                : errors.non_field_errors}
            </p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-brand-border shadow-card-soft">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="w-11 h-11 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-heading font-bold text-lg text-brand-dark">
              Create Campus Announcement
            </h2>

            <p className="text-xs text-brand-muted">
              The message will appear in the recipients' notifications.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Send To
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* All */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    target_role: 'ALL',
                  }))
                }
                className={`p-4 rounded-2xl border text-left transition-all ${
                  formData.target_role === 'ALL'
                    ? 'border-brand-teal bg-brand-teal/10 ring-2 ring-brand-teal/20'
                    : 'border-brand-border bg-slate-50 hover:bg-white'
                }`}
              >
                <Users
                  className={`w-5 h-5 mb-2 ${
                    formData.target_role === 'ALL'
                      ? 'text-brand-teal'
                      : 'text-slate-500'
                  }`}
                />

                <p className="text-sm font-bold text-brand-dark">
                  Everyone
                </p>

                <p className="text-[11px] text-brand-muted mt-1">
                  Students & wardens
                </p>
              </button>

              {/* Students */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    target_role: 'STUDENT',
                  }))
                }
                className={`p-4 rounded-2xl border text-left transition-all ${
                  formData.target_role === 'STUDENT'
                    ? 'border-brand-teal bg-brand-teal/10 ring-2 ring-brand-teal/20'
                    : 'border-brand-border bg-slate-50 hover:bg-white'
                }`}
              >
                <GraduationCap
                  className={`w-5 h-5 mb-2 ${
                    formData.target_role === 'STUDENT'
                      ? 'text-brand-teal'
                      : 'text-slate-500'
                  }`}
                />

                <p className="text-sm font-bold text-brand-dark">
                  Students
                </p>

                <p className="text-[11px] text-brand-muted mt-1">
                  All student accounts
                </p>
              </button>

              {/* Wardens */}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    target_role: 'WARDEN',
                  }))
                }
                className={`p-4 rounded-2xl border text-left transition-all ${
                  formData.target_role === 'WARDEN'
                    ? 'border-brand-teal bg-brand-teal/10 ring-2 ring-brand-teal/20'
                    : 'border-brand-border bg-slate-50 hover:bg-white'
                }`}
              >
                <ShieldCheck
                  className={`w-5 h-5 mb-2 ${
                    formData.target_role === 'WARDEN'
                      ? 'text-brand-teal'
                      : 'text-slate-500'
                  }`}
                />

                <p className="text-sm font-bold text-brand-dark">
                  Wardens
                </p>

                <p className="text-[11px] text-brand-muted mt-1">
                  All warden accounts
                </p>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Announcement Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Hostel maintenance notice"
              maxLength={255}
              className="w-full px-4 py-3 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none"
            />

            {errors.title && (
              <p className="text-xs text-rose-600 mt-1">
                {Array.isArray(errors.title)
                  ? errors.title[0]
                  : errors.title}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Announcement Message *
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Write the announcement that you want to send..."
              className="w-full px-4 py-3 text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-teal outline-none leading-relaxed resize-none"
            />

            {errors.message && (
              <p className="text-xs text-rose-600 mt-1">
                {Array.isArray(errors.message)
                  ? errors.message[0]
                  : errors.message}
              </p>
            )}
          </div>

          {/* Preview */}
          <div className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-border">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-teal mb-2">
              Notification Preview
            </p>

            <p className="text-sm font-bold text-brand-dark">
              {formData.title || 'Announcement title'}
            </p>

            <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
              {formData.message ||
                'Your announcement message will appear here.'}
            </p>

            <p className="text-[11px] text-brand-muted mt-3">
              Recipient group:{' '}
              <strong>
                {formData.target_role === 'ALL'
                  ? 'Everyone'
                  : formData.target_role === 'STUDENT'
                  ? 'All Students'
                  : 'All Wardens'}
              </strong>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Broadcast</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}