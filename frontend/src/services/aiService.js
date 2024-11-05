import api from '../utils/api';

const aiService = {
  async sendMessage(message) {
    try {
      console.log('Sending message to AI:', message);
      const response = await api.post('/ai/chat', { message });
      console.log('AI response received:', response.data);
      return response.data.response;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },

  async generateWorkoutProgram(preferences) {
    try {
      console.log('Sending workout preferences:', preferences);
      const response = await api.post('/ai/generate-workout', { preferences });
      console.log('Workout program received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating workout program:', error);
      throw error;
    }
  }
};

export default aiService;
