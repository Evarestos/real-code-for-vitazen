import api from '../utils/api';

const dashboardPreferenceService = {
  savePreference: async (name, layout, filters, isDefault = false) => {
    const response = await api.post('/dashboard-preferences', { name, layout, filters, isDefault });
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get('/dashboard-preferences');
    return response.data;
  },

  updatePreference: async (id, layout, filters) => {
    const response = await api.put(`/dashboard-preferences/${id}`, { layout, filters });
    return response.data;
  },

  undo: async (id) => {
    const response = await api.post(`/dashboard-preferences/${id}/undo`);
    return response.data;
  },

  redo: async (id) => {
    const response = await api.post(`/dashboard-preferences/${id}/redo`);
    return response.data;
  },

  deletePreference: async (id) => {
    await api.delete(`/dashboard-preferences/${id}`);
  },

  getDefaultPreference: async () => {
    const response = await api.get('/dashboard-preferences/default');
    return response.data;
  },

  setDefaultPreference: async (id) => {
    const response = await api.post(`/dashboard-preferences/${id}/set-default`);
    return response.data;
  }
};

export default dashboardPreferenceService;
