import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ExperimentSharing from '../components/ExperimentSharing';
import { shareExperiment, makeExperimentPublic } from '../services/api';

jest.mock('../services/api');

describe('ExperimentSharing Component', () => {
  const mockToken = 'mock-token';
  const mockExperimentId = 'mock-experiment-id';

  beforeEach(() => {
    shareExperiment.mockClear();
    makeExperimentPublic.mockClear();
  });

  test('renders ExperimentSharing component', () => {
    render(<ExperimentSharing experimentId={mockExperimentId} token={mockToken} />);
    expect(screen.getByLabelText('Email to share with')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('Make Public')).toBeInTheDocument();
  });

  test('handles sharing experiment', async () => {
    shareExperiment.mockResolvedValue({});
    render(<ExperimentSharing experimentId={mockExperimentId} token={mockToken} />);
    
    fireEvent.change(screen.getByLabelText('Email to share with'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      expect(shareExperiment).toHaveBeenCalledWith(mockToken, mockExperimentId, 'test@example.com', 'view');
    });
  });

  test('handles making experiment public', async () => {
    makeExperimentPublic.mockResolvedValue({});
    render(<ExperimentSharing experimentId={mockExperimentId} token={mockToken} />);
    
    fireEvent.click(screen.getByText('Make Public'));

    await waitFor(() => {
      expect(makeExperimentPublic).toHaveBeenCalledWith(mockToken, mockExperimentId);
    });
  });

  test('displays error when sharing fails', async () => {
    shareExperiment.mockRejectedValue(new Error('Sharing failed'));
    console.error = jest.fn();

    render(<ExperimentSharing experimentId={mockExperimentId} token={mockToken} />);
    
    fireEvent.change(screen.getByLabelText('Email to share with'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error sharing experiment:', expect.any(Error));
    });
  });
});
