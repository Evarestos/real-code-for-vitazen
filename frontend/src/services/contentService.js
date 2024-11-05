import api from '../utils/api';

const contentService = {
  async getContentByCategory(category, page = 1, limit = 10) {
    try {
      const response = await api.get(`/content/category/${category}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Σφάλμα κατά την ανάκτηση περιεχομένου:', error);
      throw error;
    }
  },

  async searchContent(query, page = 1, limit = 10) {
    try {
      const response = await api.get(`/content/search?q=${query}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Σφάλμα κατά την αναζήτηση περιεχομένου:', error);
      throw error;
    }
  },

  async filterContent(filters) {
    try {
      const { page = 1, limit = 10, ...restFilters } = filters;
      const queryString = new URLSearchParams({ ...restFilters, page, limit }).toString();
      const response = await api.get(`/content/filter?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Σφάλμα κατά το φιλτράρισμα περιεχομένου:', error);
      throw error;
    }
  },

  async getContentDetails(id) {
    try {
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      console.error('Σφάλμα κατά την ανάκτηση λεπτομερειών περιεχομένου:', error);
      throw error;
    }
  },

  async getRelatedContent(id, limit = 5) {
    try {
      const response = await api.get(`/content/${id}/related?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Σφάλμα κατά την ανάκτηση σχετικού περιεχομένου:', error);
      throw error;
    }
  }
};

export default contentService;
