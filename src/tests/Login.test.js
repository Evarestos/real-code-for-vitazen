import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    login: jest.fn().mockResolvedValue({}),
  }),
}));

describe('Login Component', () => {
  test('renders login form', () => {
    const { getByLabelText, getByText } = render(
      <AuthProvider>
        <Login onNotification={() => {}} />
      </AuthProvider>
    );
    
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Κωδικός')).toBeInTheDocument();
    expect(getByText('Σύνδεση')).toBeInTheDocument();
  });

  test('submits form with user input', async () => {
    const { getByLabelText, getByText } = render(
      <AuthProvider>
        <Login onNotification={() => {}} />
      </AuthProvider>
    );
    
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Κωδικός'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Σύνδεση'));

    await waitFor(() => {
      expect(useAuth().login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
