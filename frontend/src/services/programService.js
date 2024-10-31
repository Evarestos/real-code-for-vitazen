import api from '../utils/api';

const programService = {
  async getPrograms() {
    try {
      const response = await api.get('/programs');
      return response.data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  async getProgram(id) {
    try {
      const response = await api.get(`/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  },

  async createProgram(programData) {
    try {
      const response = await api.post('/programs', programData);
      return response.data;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  async updateProgram(id, programData) {
    try {
      const response = await api.put(`/programs/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },

  async deleteProgram(id) {
    try {
      await api.delete(`/programs/${id}`);
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }
};

export default programService;
