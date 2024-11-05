import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import SecurityOverview from '../components/SecurityOverview';
import ActivityMaps from '../components/ActivityMaps';

const SecurityDashboard = () => {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>Security Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SecurityOverview />
        </Grid>
        <Grid item xs={12}>
          <ActivityMaps />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SecurityDashboard;
