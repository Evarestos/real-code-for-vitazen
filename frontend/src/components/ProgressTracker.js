import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress } from '@mui/material';
import { getProgress } from '../services/progressService';

const ProgressTracker = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProgress();
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, []);

  if (!progress) {
    return <Typography>Φόρτωση προόδου...</Typography>;
  }

  return (
    <div>
      <Typography variant="h6">Πρόοδος</Typography>
      <Typography>Βάρος: {progress.weight} kg</Typography>
      <LinearProgress variant="determinate" value={progress.workoutCompletion} />
      <Typography>Ολοκλήρωση προπονήσεων: {progress.workoutCompletion}%</Typography>
    </div>
  );
};

export default ProgressTracker;
