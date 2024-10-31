import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { useContent } from '../hooks/useContent';

const WellnessLibrary = () => {
  const { data: content, isLoading } = useContent({ type: 'all' });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Βιβλιοθήκη Ευεξίας
      </Typography>
      
      {isLoading ? (
        <Typography>Φόρτωση περιεχομένου...</Typography>
      ) : (
        <Grid container spacing={3}>
          {content?.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WellnessLibrary; 