import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import AIAssistant from './AIAssistant';
import ProgressTracker from './ProgressTracker';
import WeeklySchedule from './WeeklySchedule';
import scheduleService from '../services/scheduleService';
import mealPlanService from '../services/mealPlanService';

const Dashboard = ({ onNotification }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper style={{ padding: '1rem' }}>
          <AIAssistant onNotification={onNotification} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="h6" gutterBottom>
            Πρόοδος
          </Typography>
          <ProgressTracker />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper style={{ padding: '1rem' }}>
          <Typography variant="h6" gutterBottom>
            Εβδομαδιαίο Πρόγραμμα
          </Typography>
          <WeeklySchedule />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
