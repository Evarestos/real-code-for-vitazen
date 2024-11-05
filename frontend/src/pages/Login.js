import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      showToast('success', 'Επιτυχής σύνδεση');
      // Αλλαγή από '/' σε '/dashboard'
      navigate('/dashboard');
    } catch (error) {
      showToast('error', `Σφάλμα κατά τη σύνδεση: ${error.message}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ marginTop: '8px', padding: '20px' }}>
        <Typography component="h1" variant="h5">
          Σύνδεση
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Κωδικός"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Σύνδεση
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
