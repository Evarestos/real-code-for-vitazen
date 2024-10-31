const axios = require('axios');
const { generateWellnessProgram } = require('../services/aiService');

jest.mock('axios');

describe('AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should generate a wellness program successfully', async () => {
    const mockResponse = {
      data: {
        completion: 'Mocked wellness program'
      }
    };
    axios.post.mockResolvedValue(mockResponse);

    const result = await generateWellnessProgram('Test prompt');
    expect(result).toBe('Mocked wellness program');
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        prompt: expect.stringContaining('Test prompt'),
        model: 'claude-2',
        max_tokens_to_sample: 1000,
        temperature: 0.7
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-API-Key': process.env.ANTHROPIC_API_KEY
        })
      })
    );
  });

  test('should throw an error when API response does not contain completion', async () => {
    const mockResponse = {
      data: {}
    };
    axios.post.mockResolvedValue(mockResponse);

    await expect(generateWellnessProgram('Test prompt')).rejects.toThrow('Δεν ήταν δυνατή η δημιουργία προγράμματος ευεξίας');
  });

  test('should throw an error when API call fails', async () => {
    axios.post.mockRejectedValue(new Error('API Error'));

    await expect(generateWellnessProgram('Test prompt')).rejects.toThrow('Σφάλμα κατά τη δημιουργία προγράμματος ευεξίας');
  });
});
