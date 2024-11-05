import React, { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';
import { predictExperimentSuccess, getExperimentSuggestions } from '../services/api';

const MLPredictionsAndSuggestions = ({ experimentId, token }) => {
  const [prediction, setPrediction] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predictionData, suggestionsData] = await Promise.all([
          predictExperimentSuccess(token, experimentId),
          getExperimentSuggestions(token)
        ]);
        setPrediction(predictionData.predictedConversionRate);
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching ML data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [experimentId, token]);

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">ML Predictions and Suggestions</Typography>
      <Typography>Predicted Conversion Rate: {(prediction * 100).toFixed(2)}%</Typography>
      <Typography variant="subtitle1">Suggestions for Improvement:</Typography>
      <List>
        {suggestions.map((suggestion, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Based on experiment ${suggestion.baseExperiment}`}
              secondary={suggestion.suggestedChanges.join(', ')}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MLPredictionsAndSuggestions;
