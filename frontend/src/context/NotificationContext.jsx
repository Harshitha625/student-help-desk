import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);

      const data = await notificationService.getNotifications();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.warn(
        'Failed to fetch notifications:',
        err
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      const interval = setInterval(
        fetchNotifications,
        30000
      );

      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );

      setUnreadCount((prev) =>
        Math.max(0, prev - 1)
      );
    } catch (err) {
      console.error(
        'Error marking notification as read:',
        err
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(
        'Error marking all notifications as read:',
        err
      );
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);

      const notificationToDelete =
        notifications.find((n) => n.id === id);

      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );

      if (
        notificationToDelete &&
        !notificationToDelete.is_read
      ) {
        setUnreadCount((prev) =>
          Math.max(0, prev - 1)
        );
      }

      return true;
    } catch (err) {
      console.error(
        'Error deleting notification:',
        err
      );

      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        setIsDrawerOpen,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }

  return context;
};