import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add response interceptor for development
api.interceptors.response.use(
  response => response,
  error => {
    // Check if we're in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Error:', error);
      
      // Mock responses based on the request URL
      if (error.config.url === '/auth/register') {
        const requestData = JSON.parse(error.config.data);
        return {
          data: {
            user: {
              id: 'mock-user-123',
              email: requestData.email,
              username: requestData.username
            },
            token: 'mock-token-123'
          }
        };
      }

      if (error.config.url === '/auth/login') {
        return {
          data: {
            user: {
              id: 'mock-user-123',
              email: 'test@example.com',
              username: 'testuser'
            },
            token: 'mock-token-123'
          }
        };
      }

      if (error.config.url === '/auth/verify') {
        return {
          data: {
            id: 'mock-user-123',
            email: 'test@example.com',
            username: 'testuser'
          }
        };
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
