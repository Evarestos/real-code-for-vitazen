import React, { useState } from 'react';
import { useQuery } from 'react-query';
import analyticsService from '../../services/analyticsService';
import CustomizableDashboard from './CustomizableDashboard';
import AdvancedFilters from './AdvancedFilters';
import { Paper, Typography, Switch, FormControlLabel, Button, Alert } from '@mui/material';

const AnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    categories: [],
    tags: [],
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { data: metrics } = useQuery(['metrics', filters], () => 
    analyticsService.getMetrics(filters)
  );

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Εδώ θα μπορούσατε να εφαρμόσετε το dark mode σε όλη την εφαρμογή
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <FormControlLabel
        control={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
        label="Dark Mode"
      />
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Φίλτρα
        </Typography>
        <AdvancedFilters onFilterChange={handleFilterChange} />
      </Paper>
      <CustomizableDashboard
        startDate={filters.startDate}
        endDate={filters.endDate}
        metrics={metrics}
      />
    </div>
  );
};

export default AnalyticsDashboard;
