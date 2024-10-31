import api from '../utils/api';

export const createReminder = async (userId, reminderText) => {
  try {
    const response = await api.post(`/reminders/${userId}`, { text: reminderText });
    return response.data;
  } catch (error) {
    console.error('Error creating reminder:', error);
    throw error;
  }
};

export const getReminders = async (userId) => {
  try {
    const response = await api.get(`/reminders/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw error;
  }
};
