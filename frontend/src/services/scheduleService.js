import api from '../utils/api';

const scheduleService = {
    getWeeklySchedule: async (userId) => {
        try {
            const response = await api.get(`/schedule/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching weekly schedule:', error);
            throw error;
        }
    },

    updateWeeklySchedule: async (userId, schedule) => {
        try {
            const response = await api.put(`/schedule/${userId}`, { schedule });
            return response.data;
        } catch (error) {
            console.error('Error updating weekly schedule:', error);
            throw error;
        }
    }
};

export default scheduleService;
