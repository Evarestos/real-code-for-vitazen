import React, { useState } from 'react';
import { Button, Typography, Paper, CircularProgress, TextField } from '@material-ui/core';
import { 
  optimizeExperiment, 
  applyOptimizedVariant, 
  startContinuousOptimization,
  stopContinuousOptimization
} from '../services/api';

const ExperimentOptimizer = ({ experimentId, token, onOptimize }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isContinuousOptimizing, setIsContinuousOptimizing] = useState(false);
  const [optimizationInterval, setOptimizationInterval] = useState(3600000); // Default: 1 hour

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const params = await optimizeExperiment(token, experimentId);
      onOptimize(params);
    } catch (error) {
      console.error('Error optimizing experiment:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimized = async () => {
    setIsApplying(true);
    try {
      await applyOptimizedVariant(token, experimentId);
    } catch (error) {
      console.error('Error applying optimized variant:', error);
    }
    setIsApplying(false);
  };

  const handleStartContinuousOptimization = async () => {
    setIsContinuousOptimizing(true);
    try {
      await startContinuousOptimization(token, experimentId, optimizationInterval);
    } catch (error) {
      console.error('Error starting continuous optimization:', error);
    }
  };

  const handleStopContinuousOptimization = async () => {
    try {
      await stopContinuousOptimization(token, experimentId);
      setIsContinuousOptimizing(false);
    } catch (error) {
      console.error('Error stopping continuous optimization:', error);
    }
  };

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Βελτιστοποίηση Πειράματος</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOptimize}
        disabled={isOptimizing}
      >
        {isOptimizing ? <CircularProgress size={24} /> : 'Βελτιστοποίηση'}
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleApplyOptimized}
        disabled={isApplying}
      >
        {isApplying ? <CircularProgress size={24} /> : 'Εφαρμογή Βελτιστοποιημένης Παραλλαγής'}
      </Button>
      <TextField
        type="number"
        label="Optimization Interval (ms)"
        value={optimizationInterval}
        onChange={(e) => setOptimizationInterval(Number(e.target.value))}
      />
      <Button 
        onClick={isContinuousOptimizing ? handleStopContinuousOptimization : handleStartContinuousOptimization} 
        variant="contained" 
        color="secondary"
      >
        {isContinuousOptimizing ? 'Stop Continuous Optimization' : 'Start Continuous Optimization'}
      </Button>
      <Typography>
        Set the optimization interval and click 'Start Continuous Optimization' to automatically optimize the experiment at regular intervals.
      </Typography>
    </Paper>
  );
};

export default ExperimentOptimizer;
