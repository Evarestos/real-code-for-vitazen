import api from '../utils/api';

export const getMealPlan = async (userId) => {
  try {
    const response = await api.get(`/mealplan/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
};

export const updateMealPlan = async (userId, mealPlan) => {
  try {
    const response = await api.put(`/mealplan/${userId}`, { mealPlan });
    return response.data;
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};
