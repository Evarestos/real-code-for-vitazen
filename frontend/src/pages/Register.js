import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log('Form Data Updated:', { ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting form with data:', formData);

    if (formData.password !== formData.confirmPassword) {
      console.log('Password mismatch:', {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      setError('Οι κωδικοί δεν ταιριάζουν');
      return;
    }

    try {
      console.log('Attempting registration with:', {
        email: formData.email,
        username: formData.username,
        passwordLength: formData.password.length
      });

      const response = await auth.register(
        formData.email,
        formData.password,
        formData.username
      );
      console.log('Registration successful:', response);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Σφάλμα κατά την εγγραφή');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ marginTop: '8px', padding: '20px' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Εγγραφή
        </Typography>
        {error && (
          <Typography color="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Όνομα Χρήστη"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Επιβεβαίωση Κωδικού"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Εγγραφή
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
