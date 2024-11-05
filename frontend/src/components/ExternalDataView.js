import React from 'react';
import { Typography, Paper, Grid } from '@material-ui/core';

const ExternalDataView = ({ externalData }) => {
  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Εξωτερικά Δεδομένα</Typography>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Καιρός</Typography>
          <Typography>{externalData.weather.condition}</Typography>
          <Typography>{externalData.weather.temperature}°C</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Τάσεις Κοινωνικών Μέσων</Typography>
          {externalData.socialMediaTrends.map((trend, index) => (
            <Typography key={index}>{trend}</Typography>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Οικονομικοί Δείκτες</Typography>
          <Typography>GDP: {externalData.economicIndicators.gdp}</Typography>
          <Typography>Inflation: {externalData.economicIndicators.inflation}%</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExternalDataView;
