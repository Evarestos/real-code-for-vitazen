import React from 'react';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import DataVisualization from './DataVisualization';

const ExperimentDetails = ({ experiment }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {experiment.name}
        </Typography>
        <Typography color="textSecondary">
          Κατάσταση: {experiment.status}
        </Typography>
        <Typography variant="body2" component="p">
          {experiment.description}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Στατιστικά</Typography>
            <Typography>Συμμετέχοντες: {experiment.participants}</Typography>
            <Typography>Διάρκεια: {experiment.duration} ημέρες</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DataVisualization data={experiment.results} type="line" />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExperimentDetails;
