import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Radio,
  MessageSquare,
  FileText,
  ShieldCheck,
  Clock
} from 'lucide-react';

export default function NotificationDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const notification = location.state?.notification;

  if (!notification) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-brand-cream flex items-center justify-center px-4">

        <div className="bg-white rounded-3xl border border-brand-border shadow-card-soft p-8 max-w-md w-full text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-brand-teal" />
          </div>

          <h1 className="font-heading text-xl font-bold text-brand-dark">
            Notification not found
          </h1>

          <p className="text-sm text-brand-muted mt-2">
            Open a notification from the notification drawer
            to view its complete details.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-dark transition-colors"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  const getIcon = () => {
    switch (notification.notification_type) {
      case 'BROADCAST':
        return (
          <Radio className="w-7 h-7 text-brand-gold" />
        );

      case 'COMPLAINT':
        return (
          <MessageSquare className="w-7 h-7 text-brand-teal" />
        );

      case 'OUTPASS':
        return (
          <FileText className="w-7 h-7 text-brand-gold" />
        );

      case 'VERIFICATION':
        return (
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
        );

      default:
        return (
          <Bell className="w-7 h-7 text-brand-teal" />
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-brand-cream">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-teal-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notifications
        </button>

        {/* Notification Card */}
        <div className="bg-white rounded-3xl border border-brand-border shadow-card-soft overflow-hidden">

          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-dark via-brand-teal-dark to-brand-dark text-white">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                {getIcon()}
              </div>

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-2 mb-2">

                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider">
                    {notification.notification_type}
                  </span>

                </div>

                <h1 className="font-heading text-2xl sm:text-3xl font-bold">
                  {notification.title}
                </h1>

                <div className="flex items-center gap-2 mt-3 text-xs text-brand-biscuit/80">
                  <Clock className="w-3.5 h-3.5" />

                  {new Date(
                    notification.created_at
                  ).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>

              </div>

            </div>

          </div>

          {/* Message */}
          <div className="p-6 sm:p-8">

            <h2 className="font-heading font-bold text-lg text-brand-dark mb-3">
              Notification
            </h2>

            <div className="rounded-2xl bg-brand-cream/60 border border-brand-border p-5">

              <p className="text-sm sm:text-base text-slate-700 leading-7 whitespace-pre-wrap">
                {notification.message}
              </p>

            </div>

            {/* Broadcast information */}
            {notification.notification_type === 'BROADCAST' && (
              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">

                <div className="flex items-start gap-3">

                  <Radio className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />

                  <div>

                    <h3 className="font-semibold text-sm text-amber-900">
                      Campus Announcement
                    </h3>

                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      This message was sent as a campus-wide
                      announcement by the administration.
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}