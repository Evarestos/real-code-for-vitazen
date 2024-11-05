import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIAssistant from '../components/AIAssistant';
import { getAIResponse } from '../services/api';

jest.mock('../services/api');

describe('AIAssistant Component', () => {
  beforeEach(() => {
    getAIResponse.mockClear();
  });

  test('renders AIAssistant component', () => {
    render(<AIAssistant onNotification={() => {}} />);
    expect(screen.getByPlaceholderText('Ρωτήστε τον AI Assistant...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Αποστολή' })).toBeInTheDocument();
  });

  test('handles user input and displays AI response', async () => {
    getAIResponse.mockResolvedValue({ response: 'Αυτή είναι μια απάντηση από τον AI.' });

    render(<AIAssistant onNotification={() => {}} />);
    
    const input = screen.getByPlaceholderText('Ρωτήστε τον AI Assistant...');
    const sendButton = screen.getByRole('button', { name: 'Αποστολή' });

    fireEvent.change(input, { target: { value: 'Πώς μπορώ να βελτιώσω την υγεία μου;' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Αυτή είναι μια απάντηση από τον AI.')).toBeInTheDocument();
    });
  });

  test('displays error notification on API failure', async () => {
    getAIResponse.mockRejectedValue(new Error('API Error'));

    const mockNotification = jest.fn();
    render(<AIAssistant onNotification={mockNotification} />);
    
    const input = screen.getByPlaceholderText('Ρωτήστε τον AI Assistant...');
    const sendButton = screen.getByRole('button', { name: 'Αποστολή' });

    fireEvent.change(input, { target: { value: 'Τι είναι η υγιεινή διατροφή;' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockNotification).toHaveBeenCalledWith('Σφάλμα κατά την επικοινωνία με τον AI Assistant', 'error');
    });
  });
});
