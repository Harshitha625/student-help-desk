import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCheck,
  Bell,
  MessageSquare,
  FileText,
  ShieldCheck,
  Radio,
  ChevronRight,
  MoreVertical,
  Trash2,
  ExternalLink
} from 'lucide-react';

import { useNotifications } from '../context/NotificationContext';

export default function NotificationDrawer() {
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const navigate = useNavigate();

  const handleOpenNotification = async (item) => {
    if (!item.is_read) {
      await markAsRead(item.id);
    }

    setIsDrawerOpen(false);

    /*
     * Broadcast notifications don't belong to a complaint
     * or outpass, so we open the notification details page
     * and send the complete notification through router state.
     */
    navigate('/notifications/details', {
      state: {
        notification: item
      }
    });
  };

  const handleDeleteNotification = async (event, id) => {
    event.stopPropagation();

    await deleteNotification(id);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'COMPLAINT':
        return (
          <MessageSquare className="w-4 h-4 text-brand-teal" />
        );

      case 'OUTPASS':
        return (
          <FileText className="w-4 h-4 text-brand-gold" />
        );

      case 'VERIFICATION':
        return (
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        );

      case 'BROADCAST':
        return (
          <Radio className="w-4 h-4 text-amber-600" />
        );

      default:
        return (
          <Bell className="w-4 h-4 text-slate-500" />
        );
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-xs z-50"
          />

          {/* Notification Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 260
            }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-brand-border flex flex-col"
          >

            {/* Header */}
            <div className="p-5 border-b border-brand-border/80 flex items-center justify-between bg-brand-cream/60">

              <div className="flex items-center gap-3">

                <div className="p-2 rounded-lg bg-brand-teal-dark text-brand-gold">
                  <Bell className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-dark">
                    Campus Notifications
                  </h3>

                  <p className="text-xs text-brand-muted">
                    {unreadCount > 0
                      ? `${unreadCount} unread alert${
                          unreadCount > 1 ? 's' : ''
                        }`
                      : 'All caught up'}
                  </p>
                </div>

              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Quick Actions */}
            {notifications.length > 0 && (
              <div className="px-5 py-2.5 bg-slate-50 border-b border-brand-border flex items-center justify-between text-xs">

                <span className="text-brand-muted">
                  Recent updates
                </span>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-teal hover:text-brand-teal-dark transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}

              </div>
            )}

            {/* Notifications */}
            <div className="flex-1 overflow-y-auto divide-y divide-brand-border/60">

              {notifications.length === 0 ? (

                <div className="p-12 text-center flex flex-col items-center justify-center h-full">

                  <div className="w-14 h-14 rounded-full bg-brand-biscuit/30 flex items-center justify-center text-brand-gold mb-3">
                    <Bell className="w-7 h-7" />
                  </div>

                  <h4 className="font-bold text-brand-dark mb-1">
                    No notifications yet
                  </h4>

                  <p className="text-xs text-brand-muted max-w-xs leading-relaxed">
                    Whenever there is an update on your complaints,
                    outpass approval, or campus announcements,
                    it will appear here.
                  </p>

                </div>

              ) : (

                notifications.map((item) => (

                  <div
                    key={item.id}
                    onClick={() => handleOpenNotification(item)}
                    className={`p-4 transition-colors cursor-pointer flex items-start gap-3.5 hover:bg-slate-50 relative ${
                      !item.is_read
                        ? 'bg-teal-50/40'
                        : 'bg-white'
                    }`}
                  >

                    {/* Unread dot */}
                    {!item.is_read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-gold ring-4 ring-brand-gold/20" />
                    )}

                    {/* Icon */}
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/60 shrink-0 mt-0.5">
                      {getIcon(item.notification_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-2">

                      <div className="flex items-center justify-between mb-1">

                        <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal">
                          {item.notification_type}
                        </span>

                        <span className="text-[11px] text-brand-muted">
                          {new Date(item.created_at).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}
                        </span>

                      </div>

                      <h5
                        className={`text-sm mb-1 line-clamp-1 ${
                          !item.is_read
                            ? 'font-bold text-brand-dark'
                            : 'font-medium text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h5>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                    </div>

                    {/* Three Dot Menu */}
                    <div className="relative shrink-0 self-center">

                      <details
                        onClick={(e) => e.stopPropagation()}
                        className="relative"
                      >

                        <summary className="list-none cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-dark">
                          <MoreVertical className="w-4 h-4" />
                        </summary>

                        <div className="absolute right-0 top-8 z-20 w-32 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNotification(item);
                            }}
                            className="w-full px-3 py-2.5 flex items-center gap-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open
                          </button>

                          <button
                            onClick={(e) =>
                              handleDeleteNotification(e, item.id)
                            }
                            className="w-full px-3 py-2.5 flex items-center gap-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>

                        </div>

                      </details>

                    </div>

                  </div>

                ))

              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brand-border bg-slate-50 text-center">

              <span className="text-xs text-brand-muted">
                Student HelpDesk Notification Center
              </span>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}