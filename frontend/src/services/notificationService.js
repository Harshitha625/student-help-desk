import api from './api';

export const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await api.get('/api/notifications/', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.post(`/api/notifications/${id}/read/`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/api/notifications/read-all/');
    return response.data;
  },

  broadcast: async (broadcastData) => {
    const response = await api.post(
      '/api/notifications/broadcast/',
      broadcastData
    );
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(
      `/api/notifications/${id}/delete/`
    );
    return response.data;
  },
};