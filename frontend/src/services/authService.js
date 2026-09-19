import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login/', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout/');
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      localStorage.removeItem('shd_token');
      localStorage.removeItem('shd_user');
    }
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile/', data);
    return response.data;
  },

  changePassword: async (passwords) => {
    const response = await api.post('/api/auth/change-password/', passwords);
    return response.data;
  },
};
