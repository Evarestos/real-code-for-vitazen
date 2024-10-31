import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';

const SignUp = ({ onNotification, onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Εδώ θα προσθέσουμε τη λογική για την εγγραφή του χρήστη
      console.log('Εγγραφή με:', email, password);
      onNotification('Επιτυχής εγγραφή!', 'success');
      onSignUpSuccess();
    } catch (error) {
      onNotification('Σφάλμα κατά την εγγραφή', 'error');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" gutterBottom>
        Εγγραφή
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Κωδικός"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Εγγραφή
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
