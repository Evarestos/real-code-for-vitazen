import React, { useState, useEffect } from 'react';
import { Grid, Typography } from  '@mui/material';
import ExperimentList from '../components/ExperimentList';
import ExperimentDetails from '../components/ExperimentDetails';
import ExperimentOptimizer from '../components/ExperimentOptimizer';
import AnomalyDetector from '../components/AnomalyDetector';
import AdvancedAnalysisView from '../components/AdvancedAnalysisView';
import { fetchExperiments } from '../services/api';

const ExperimentDashboard = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const data = await fetchExperiments();
      setExperiments(data);
    } catch (error) {
      console.error('Error loading experiments:', error);
    }
  };

  const handleExperimentSelect = (experiment) => {
    setSelectedExperiment(experiment);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Πίνακας Ελέγχου Πειραμάτων</Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <ExperimentList 
          experiments={experiments} 
          onExperimentSelect={handleExperimentSelect}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        {selectedExperiment && (
          <>
            <ExperimentDetails experiment={selectedExperiment} />
            <ExperimentOptimizer 
              experimentId={selectedExperiment.id}
              onOptimize={loadExperiments}
            />
            <AnomalyDetector experimentId={selectedExperiment.id} />
            <AdvancedAnalysisView experiment={selectedExperiment} />
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default ExperimentDashboard;
