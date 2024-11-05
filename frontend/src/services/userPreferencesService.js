import api from '../utils/api';

const userPreferencesService = {
  getPreferences: async () => {
    try {
      const response = await api.get('/user-preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  },

  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/user-preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  resetPreferences: async () => {
    try {
      const response = await api.post('/user-preferences/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting user preferences:', error);
      throw error;
    }
  }
};

export default userPreferencesService;
