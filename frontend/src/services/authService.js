import api from '../utils/api';

const authService = {
  async register(email, password) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password
      });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async verifyToken(token) {
    try {
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

export default authService;
