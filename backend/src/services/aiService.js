import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiService = {
  async generateResponse(message) {
    try {
      console.log('Generating AI response for:', message);
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a wellness and fitness assistant that helps create personalized workout and nutrition programs. Always respond in Greek language."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      console.log('AI response generated:', completion.choices[0].message);
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error in generateResponse:', error);
      throw new Error('Failed to generate AI response');
    }
  },

  async generateWorkoutProgram(userPreferences) {
    try {
      console.log('Generating workout program for:', userPreferences);
      const prompt = `Create a detailed workout program based on these preferences: ${JSON.stringify(userPreferences)}. Include exercises, sets, reps, and rest periods. Respond in Greek language.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional fitness trainer creating personalized workout programs. Always respond in Greek language."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log('Workout program generated');
      return {
        program: completion.choices[0].message.content,
        type: 'workout'
      };
    } catch (error) {
      console.error('Error in generateWorkoutProgram:', error);
      throw new Error('Failed to generate workout program');
    }
  }
};

export default aiService;
