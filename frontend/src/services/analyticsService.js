import api from '../utils/api';

const analyticsService = {
  getMetrics: async (startDate, endDate) => {
    try {
      const response = await api.get('/analytics/metrics', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  getReports: async (reportType, startDate, endDate) => {
    try {
      const response = await api.get('/analytics/reports', {
        params: { reportType, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  getRecommendationPerformance: async (startDate, endDate) => {
    try {
      const response = await api.get('/analytics/recommendation-performance', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendation performance:', error);
      throw error;
    }
  },

  getUserBehavior: async (startDate, endDate) => {
    try {
      const response = await api.get('/analytics/user-behavior', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user behavior:', error);
      throw error;
    }
  },

  getABTests: async () => {
    try {
      const response = await api.get('/ab-tests');
      return response.data;
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      throw error;
    }
  },

  recordABTestEvent: async (testId, variant, eventType) => {
    try {
      await api.post('/ab-tests/event', { testId, variant, eventType });
    } catch (error) {
      console.error('Error recording A/B test event:', error);
      throw error;
    }
  },

  getSecurityOverview: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/security-analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching security overview:', error);
      throw error;
    }
  },

  getActivityData: async () => {
    try {
      const response = await api.get('/analytics/activity-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity data:', error);
      throw error;
    }
  },

  // Άλλες μέθοδοι για αναλυτικά στοιχεία μπορούν να προστεθούν εδώ
};

export default analyticsService;
