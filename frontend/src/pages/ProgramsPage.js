import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import ProgramsList from '../components/ProgramsList';

const ProgramsPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Προγράμματα
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProgramsList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProgramsPage; 