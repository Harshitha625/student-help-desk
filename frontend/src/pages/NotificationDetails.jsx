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
      <div className="min-h-[calc(100vh-80px)] bg-[#061D17] flex items-center justify-center px-4">

        <div className="bg-[#0E2F26] rounded-3xl border border-[#1B4337] shadow-2xl p-8 max-w-md w-full text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0B251E] border border-[#1B4337] flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[#E5C38E]" />
          </div>

          <h1 className="font-heading text-xl font-bold text-[#F5F5F0]">
            Notification not found
          </h1>

          <p className="text-sm text-[#A3B8B0] mt-2">
            Open a notification from the notification drawer
            to view its complete details.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#E5C38E] text-[#122A22] font-semibold text-sm hover:bg-[#d8b37b] transition-colors"
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
          <Radio className="w-7 h-7 text-[#E5C38E]" />
        );

      case 'COMPLAINT':
        return (
          <MessageSquare className="w-7 h-7 text-[#4E8B73]" />
        );

      case 'OUTPASS':
        return (
          <FileText className="w-7 h-7 text-[#E5C38E]" />
        );

      case 'VERIFICATION':
        return (
          <ShieldCheck className="w-7 h-7 text-[#4E8B73]" />
        );

      default:
        return (
          <Bell className="w-7 h-7 text-[#E5C38E]" />
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#061D17]">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#E5C38E] hover:text-[#d8b37b] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notifications
        </button>

        {/* Notification Card */}
        <div className="bg-[#0E2F26] rounded-3xl border border-[#1B4337] shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#07211A] via-[#0B2A22] to-[#07211A] text-[#F5F5F0] border-b border-[#1B4337]">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-[#0E2F26] border border-[#1E4D3E] flex items-center justify-center shrink-0">
                {getIcon()}
              </div>

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-2 mb-2">

                  <span className="px-2.5 py-1 rounded-full bg-[#1B4337]/60 border border-[#275d4d] text-xs font-semibold uppercase tracking-wider text-[#E5C38E]">
                    {notification.notification_type}
                  </span>

                </div>

                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
                  {notification.title}
                </h1>

                <div className="flex items-center gap-2 mt-3 text-xs text-[#A3B8B0]">
                  <Clock className="w-3.5 h-3.5 text-[#4E8B73]" />

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

            <h2 className="font-heading font-bold text-lg text-[#F5F5F0] mb-3">
              Notification
            </h2>

            <div className="rounded-2xl bg-[#09221B] border border-[#1B4337] p-5">

              <p className="text-sm sm:text-base text-[#D1E0DA] leading-7 whitespace-pre-wrap">
                {notification.message}
              </p>

            </div>

            {/* Broadcast information */}
            {notification.notification_type === 'BROADCAST' && (
              <div className="mt-6 p-4 rounded-2xl bg-[#132c23] border border-[#235342]">

                <div className="flex items-start gap-3">

                  <Radio className="w-5 h-5 text-[#E5C38E] mt-0.5 shrink-0" />

                  <div>

                    <h3 className="font-semibold text-sm text-[#F5F5F0]">
                      Campus Announcement
                    </h3>

                    <p className="text-xs text-[#A3B8B0] mt-1 leading-relaxed">
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