const contentService = {
  async trackContentView(contentId) {
    try {
      const response = await api.post(`/content/view`, {
        contentId
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking content view:', error);
      throw error;
    }
  },

  async getRecommendedContent(userId) {
    try {
      const response = await api.get(`/content/recommended/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recommended content:', error);
      throw error;
    }
  }
};

export default contentService; 