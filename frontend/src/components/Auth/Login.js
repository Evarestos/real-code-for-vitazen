import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';

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
      console.log('Attempting login with:', formData);
      const response = await login(formData.email, formData.password);
      console.log('Login response:', response);
      
      showToast('success', 'Επιτυχής σύνδεση');
      
      // Προσθήκη μικρής καθυστέρησης για να δώσουμε χρόνο στο token να αποθηκευτεί
      setTimeout(() => {
        navigate('/chat');
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', error.message || 'Σφάλμα κατά τη σύνδεση');
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
