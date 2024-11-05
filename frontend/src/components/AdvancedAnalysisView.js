import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { getAdvancedAnalysis } from '../services/analysisService';

const AdvancedAnalysisView = ({ experiment }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const data = await getAdvancedAnalysis(experiment.id);
        setAnalysis(data);
      } catch (error) {
        console.error('Error fetching advanced analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [experiment.id]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Προηγμένη Ανάλυση</Typography>
        {analysis ? (
          <>
            <Typography>Συσχέτιση: {analysis.correlation}</Typography>
            <Typography>Τάση: {analysis.trend}</Typography>
            <Typography>Προβλεπόμενη απόδοση: {analysis.predictedPerformance}</Typography>
          </>
        ) : (
          <Typography>Δεν υπάρχουν διαθέσιμα δεδομένα ανάλυσης.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalysisView;
