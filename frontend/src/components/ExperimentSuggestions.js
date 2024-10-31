import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@material-ui/core';
import { getExperimentSuggestions } from '../services/api';

const ExperimentSuggestions = ({ token, onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const data = await getExperimentSuggestions(token);
      setSuggestions(data);
    };
    fetchSuggestions();
  }, [token]);

  return (
    <Grid container spacing={3}>
      {suggestions.map((suggestion, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">{suggestion.type} Πρόταση</Typography>
              <Typography variant="body2" color="textSecondary">{suggestion.description}</Typography>
              {suggestion.suggestedChanges.map((change, changeIndex) => (
                <Typography key={changeIndex} variant="body2">
                  • {change.type}: {change.value}
                </Typography>
              ))}
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => onSuggestionSelect(suggestion)}
                style={{ marginTop: '10px' }}
              >
                Χρήση αυτής της πρότασης
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ExperimentSuggestions;
