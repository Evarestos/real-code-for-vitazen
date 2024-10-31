import React, { useState, useEffect } from 'react';
import { predictExperimentSuccess } from '../services/api';
import { Typography, Paper, CircularProgress } from '@material-ui/core';

const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
// Χρήση του apiKey για κλήσεις στο API της Anthropic

const ExperimentPrediction = ({ experimentId, token }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const data = await predictExperimentSuccess(token, experimentId);
        setPrediction(data.predictedConversionRate);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [experimentId, token]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Πρόβλεψη Επιτυχίας Πειράματος</Typography>
      <Typography>
        Προβλεπόμενο ποσοστό μετατροπής: {(prediction * 100).toFixed(2)}%
      </Typography>
    </Paper>
  );
};

export default ExperimentPrediction;
