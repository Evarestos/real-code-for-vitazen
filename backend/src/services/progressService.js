const api = require('../utils/api');

class ProgressService {
  async getProgressData(userId) {
    try {
      // Αντικαθιστούμε την κλήση στη βάση δεδομένων με κλήση στο API
      const response = await api.get(`/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      throw error;
    }
  }

  async addProgressEntry(userId, entry) {
    try {
      // Αντικαθιστούμε την κλήση στη βάση δεδομένων με κλήση στο API
      await api.post(`/progress/${userId}`, entry);
    } catch (error) {
      console.error('Error adding progress entry:', error);
      throw error;
    }
  }

  async getProgressAnalysis(userId) {
    try {
      const progressData = await this.getProgressData(userId);
      
      return {
        totalEntries: progressData.length,
        latestEntry: progressData[progressData.length - 1],
        // Προσθέστε περισσότερες αναλύσεις εδώ
      };
    } catch (error) {
      console.error('Error analyzing progress data:', error);
      throw error;
    }
  }

  async saveProgress(userId, progressData) {
    try {
      const response = await api.post(`/progress/${userId}`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }

  async getProgress(userId) {
    try {
      const response = await api.get(`/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  async updateProgress(userId, progressId, updatedData) {
    try {
      const response = await api.put(`/progress/${userId}/${progressId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
}

const progressService = new ProgressService();

module.exports = {
  getProgress: async (userId) => {
    try {
      return await progressService.getProgress(userId);
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },
  updateProgress: async (userId, progressData) => {
    try {
      return await progressService.updateProgress(userId, null, progressData);
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },
  progressService
};
