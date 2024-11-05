import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../Notifications/NotificationCenter';

const Header = ({ onMenuToggle }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          AI Wellness App
        </Typography>
        <Button color="inherit" onClick={() => navigate('/library')}>
          Βιβλιοθήκη
        </Button>
        <Button color="inherit" onClick={() => navigate('/my-programs')}>
          Τα Προγράμματά μου
        </Button>
        <NotificationCenter />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
