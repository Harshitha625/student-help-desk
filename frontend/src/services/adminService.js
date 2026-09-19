import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/api/admin/stats/');
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/api/admin/reports/');
    return response.data;
  },

  getStudents: async (search = '') => {
    const response = await api.get('/api/admin/students/', {
      params: search ? { search } : {},
    });
    return response.data;
  },

  toggleUserActive: async (userId) => {
    const response = await api.post(`/api/auth/users/${userId}/toggle-active/`);
    return response.data;
  },
};
