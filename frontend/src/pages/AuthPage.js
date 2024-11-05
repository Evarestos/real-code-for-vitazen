import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box } from '@mui/material';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          centered
        >
          <Tab label="Σύνδεση" />
          <Tab label="Εγγραφή" />
        </Tabs>
        <Box p={3}>
          {tabValue === 0 && <Login />}
          {tabValue === 1 && <Register />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage; 