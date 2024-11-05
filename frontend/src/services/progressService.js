import api from '../utils/api';

export const getProgress = async (userId) => {
  try {
    const response = await api.get(`/progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
};

export const getProgressData = async (userId) => {
  try {
    const response = await api.get(`/progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};
