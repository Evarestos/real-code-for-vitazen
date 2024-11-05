import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard';
import { getWeeklySchedule } from '../services/scheduleService';
import { getMealPlan } from '../services/mealPlanService';

jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    user: { uid: '123', displayName: 'Test User' }
  })
}));

jest.mock('../services/scheduleService');
jest.mock('../services/mealPlanService');

describe('Dashboard Component', () => {
  beforeEach(() => {
    getWeeklySchedule.mockResolvedValue([{ day: 'Monday', activity: 'Running' }]);
    getMealPlan.mockResolvedValue([{ meal: 'Breakfast', food: 'Oatmeal' }]);
  });

  test('renders welcome message', async () => {
    render(
      <AuthProvider>
        <Dashboard onNotification={() => {}} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Καλώς ήρθες, Test User!/i)).toBeInTheDocument();
    });
  });

  test('renders WeeklySchedule component', async () => {
    render(
      <AuthProvider>
        <Dashboard onNotification={() => {}} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Running/i)).toBeInTheDocument();
    });
  });

  test('renders MealPlan component', async () => {
    render(
      <AuthProvider>
        <Dashboard onNotification={() => {}} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Oatmeal/i)).toBeInTheDocument();
    });
  });

  test('handles error when fetching schedule', async () => {
    getWeeklySchedule.mockRejectedValue(new Error('Failed to fetch schedule'));
    const mockNotification = jest.fn();

    render(
      <AuthProvider>
        <Dashboard onNotification={mockNotification} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockNotification).toHaveBeenCalledWith('Σφάλμα κατά τη φόρτωση του προγράμματος', 'error');
    });
  });
});
