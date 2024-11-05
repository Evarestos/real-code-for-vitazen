import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';
import { detectAnomalies } from '../services/api';

const AnomalyDetector = ({ experimentId, token }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [anomalies, setAnomalies] = useState([]);

  const handleDetectAnomalies = async () => {
    setIsDetecting(true);
    try {
      const detectedAnomalies = await detectAnomalies(token, experimentId);
      setAnomalies(detectedAnomalies);
    } catch (error) {
      console.error('Error detecting anomalies:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Ανίχνευση Ανωμαλιών</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleDetectAnomalies}
        disabled={isDetecting}
      >
        {isDetecting ? <CircularProgress size={24} /> : 'Ανίχνευση Ανωμαλιών'}
      </Button>
      {anomalies.length > 0 && (
        <List>
          {anomalies.map((anomaly, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`Ανωμαλία #${index + 1}`} 
                secondary={`Τύπος: ${anomaly.type}, Τιμή: ${anomaly.value}, Χρόνος: ${anomaly.timestamp}`} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default AnomalyDetector;
