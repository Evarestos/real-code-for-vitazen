import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Καλώς ήρθατε στην εφαρμογή μας!
        </Typography>
        <Typography variant="h4" gutterBottom>
          Καλώς ήρθατε στην εφαρμογή ευεξίας
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/login')}
            sx={{ mr: 2 }}
          >
            Σύνδεση
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate('/register')}
          >
            Εγγραφή
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
