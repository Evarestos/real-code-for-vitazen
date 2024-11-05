import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Wellness App
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={RouterLink} to="/">
              Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Αποσύνδεση
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Σύνδεση
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Εγγραφή
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
