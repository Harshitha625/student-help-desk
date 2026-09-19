import api from './api';

export const complaintService = {
  getComplaints: async (params = {}) => {
    const response = await api.get('/api/complaints/', { params });
    return response.data;
  },

  getComplaint: async (id) => {
    const response = await api.get(`/api/complaints/${id}/`);
    return response.data;
  },

  createComplaint: async (formData) => {
    // Check if formData is instance of FormData (if attachment present)
    const isFormData = formData instanceof FormData;
    const response = await api.post('/api/complaints/', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.post(`/api/complaints/${id}/update_status/`, statusData);
    return response.data;
  },

  getComments: async (complaintId) => {
    const response = await api.get(`/api/complaints/${complaintId}/comments/`);
    return response.data;
  },

  addComment: async (complaintId, comment) => {
    const response = await api.post(`/api/complaints/${complaintId}/comments/`, { comment });
    return response.data;
  },
};
