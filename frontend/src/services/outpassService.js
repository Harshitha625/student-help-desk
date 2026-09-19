import api from './api';

export const outpassService = {
  getOutpasses: async (params = {}) => {
    const response = await api.get('/api/outpasses/', { params });
    return response.data;
  },

  getOutpass: async (id) => {
    const response = await api.get(`/api/outpasses/${id}/`);
    return response.data;
  },

  createOutpass: async (data) => {
    const response = await api.post('/api/outpasses/', data);
    return response.data;
  },

  verifyParent: async (id, verificationData) => {
    const response = await api.post(`/api/outpasses/${id}/verify_parent/`, verificationData);
    return response.data;
  },

  reviewOutpass: async (id, reviewData) => {
    const response = await api.post(`/api/outpasses/${id}/review/`, reviewData);
    return response.data;
  },

  completeOutpass: async (id) => {
    const response = await api.post(`/api/outpasses/${id}/complete/`);
    return response.data;
  },
};
