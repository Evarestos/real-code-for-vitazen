import React from 'react';
import { render, screen } from '@testing-library/react';
import WeeklySchedule from './WeeklySchedule';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

describe('WeeklySchedule', () => {
  const mockSchedule = [
    { activity: 'Running' },
    { activity: 'Yoga' },
    { activity: 'Swimming' },
    { activity: 'Cycling' },
    { activity: 'Hiking' },
    { activity: 'Rest' },
    { activity: 'Meditation' }
  ];

  it('renders correctly with schedule', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WeeklySchedule schedule={mockSchedule} />
      </I18nextProvider>
    );

    expect(screen.getByText('Weekly Schedule')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Sunday')).toBeInTheDocument();
    expect(screen.getByText('Meditation')).toBeInTheDocument();
  });

  it('renders correctly without schedule', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <WeeklySchedule />
      </I18nextProvider>
    );

    expect(screen.getByText('Weekly Schedule')).toBeInTheDocument();
    expect(screen.getAllByText('No activity scheduled')).toHaveLength(7);
  });
});
