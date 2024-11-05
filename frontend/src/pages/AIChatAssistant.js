import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import AIChat from '../components/AIChat/AIChat';

const AIChatAssistant = () => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          AI Βοηθός Ευεξίας
        </Typography>
        <AIChat />
      </Paper>
    </Container>
  );
};

export default AIChatAssistant; 