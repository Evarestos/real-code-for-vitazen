import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from '../contexts/AuthContext';
import WeeklySchedule from '../components/WeeklySchedule';
import MealPlan from '../components/MealPlan';
import ProgressTracker from '../components/ProgressTracker';
import AIAssistant from '../components/AIAssistant';
import scheduleService from '../services/scheduleService';
import mealPlanService from '../services/mealPlanService';
import useToast from '../hooks/useToast';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { showToast } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchSchedule();
      fetchMealPlan();
    }
  }, [currentUser]);

  const fetchSchedule = async () => {
    try {
      const data = await scheduleService.getWeeklySchedule(currentUser.id);
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      showToast('error', 'Σφάλμα κατά τη φόρτωση του προγράμματος');
    }
  };

  const fetchMealPlan = async () => {
    try {
      const data = await mealPlanService.getMealPlan(currentUser.id);
      setMealPlan(data);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      showToast('error', 'Σφάλμα κατά τη φόρτωση του πλάνου γευμάτων');
    }
  };

  if (!currentUser) {
    return <Typography>Παρακαλώ συνδεθείτε για να δείτε το dashboard.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Καλώς ήρθες, {currentUser.username || currentUser.email}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={isSmallScreen ? 12 : 6}>
          <Paper sx={{ p: 2 }}>
            <WeeklySchedule schedule={schedule} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={isSmallScreen ? 12 : 6}>
          <Paper sx={{ p: 2 }}>
            <MealPlan plan={mealPlan} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <ProgressTracker userId={currentUser.id} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <AIAssistant />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
