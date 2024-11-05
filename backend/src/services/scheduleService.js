import api from '../utils/api';
const Schedule = require('../models/Schedule');

export const getWeeklySchedule = async (userId) => {
  try {
    const schedule = await Schedule.findOne({ userId });
    return schedule;
  } catch (error) {
    throw new Error('Error fetching weekly schedule');
  }
};

export const updateWeeklySchedule = async (userId, schedule) => {
  try {
    const response = await api.put(`/schedule/${userId}`, { schedule });
    return response.data;
  } catch (error) {
    console.error('Error updating weekly schedule:', error);
    throw error;
  }
};
