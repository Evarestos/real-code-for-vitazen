import api from '../utils/api';

const userService = {
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  updatePrivacySettings: async (userId, privacySettings) => {
    try {
      const response = await api.put(`/users/${userId}/privacy-settings`, privacySettings);
      return response.data;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  },

  exportUserData: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/export-data`);
      return response.data;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  },

  // Άλλες μέθοδοι σχετικές με τη διαχείριση χρηστών μπορούν να προστεθούν εδώ
};

export default userService;
