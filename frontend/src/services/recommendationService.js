import api from '../utils/api';

const recommendationService = {
  getRecommendations: async (userId) => {
    try {
      const response = await api.get(`/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  getSimilarContent: async (contentId) => {
    try {
      const response = await api.get(`/recommendations/similar/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar content:', error);
      throw error;
    }
  },

  getPersonalizedFeed: async (userId) => {
    try {
      const response = await api.get(`/recommendations/feed/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personalized feed:', error);
      throw error;
    }
  }
};

export default recommendationService;
