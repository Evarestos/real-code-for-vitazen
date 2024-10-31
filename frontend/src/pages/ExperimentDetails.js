import React, { useState, useEffect } from 'react';
import { Typography, Paper, CircularProgress } from  '@mui/material';
import { getExperimentWithExternalData } from '../services/api';
import ExternalDataView from '../components/ExternalDataView';
import ExperimentPrediction from '../components/ExperimentPrediction';
import ExperimentSharing from '../components/ExperimentSharing';
import MLPredictionsAndSuggestions from '../components/MLPredictionsAndSuggestions';
import AnomalyDetector from '../components/AnomalyDetector';

const ExperimentDetails = ({ experimentId, token }) => {
  const [experimentData, setExperimentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExperimentWithExternalData(token, experimentId);
      setExperimentData(data);
    };
    fetchData();
  }, [experimentId, token]);

  if (!experimentData) return <CircularProgress />;

  return (
    <div>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5">{experimentData.name}</Typography>
        <Typography variant="body1">{experimentData.description}</Typography>
        {/* Εδώ μπορείτε να προσθέσετε περισσότερες λεπτομέρειες του πειράματος */}
      </Paper>
      
      <ExternalDataView externalData={experimentData.externalData} />
      <ExperimentPrediction experimentId={experimentId} token={token} />
      <ExperimentSharing experimentId={experimentId} token={token} />
      <MLPredictionsAndSuggestions experimentId={experimentId} token={token} />
      <AnomalyDetector experimentId={experimentId} token={token} />
    </div>
  );
};

export default ExperimentDetails;
