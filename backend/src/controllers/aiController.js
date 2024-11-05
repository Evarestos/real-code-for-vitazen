import aiService from '../services/aiService';

const aiController = {
  async generateResponse(req, res) {
    try {
      const { message } = req.body;
      console.log('Received message:', message);
      
      const response = await aiService.generateResponse(message);
      console.log('Sending response:', response);
      
      res.json({ response });
    } catch (error) {
      console.error('Error in AI controller:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async generateWorkoutProgram(req, res) {
    try {
      const { preferences } = req.body;
      console.log('Received preferences:', preferences);
      
      const program = await aiService.generateWorkoutProgram(preferences);
      console.log('Generated program:', program);
      
      res.json(program);
    } catch (error) {
      console.error('Error generating workout program:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default aiController;
