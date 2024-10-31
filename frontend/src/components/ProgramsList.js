import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import ProgramCard from './ProgramCard';
import { useAuth } from '../contexts/AuthContext';
import programService from '../services/programService';

const ProgramsList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await programService.getPrograms();
      setPrograms(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Σφάλμα κατά τη φόρτωση των προγραμμάτων');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <Box p={3}>
        <Typography>Δεν υπάρχουν διαθέσιμα προγράμματα.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program._id || program.id}>
            <ProgramCard program={program} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProgramsList;
