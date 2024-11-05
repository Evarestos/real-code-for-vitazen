import React from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import programService from '../services/programService';

const ProgramCard = ({ program }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartProgram = async () => {
    try {
      await programService.enrollInProgram(user.id, program.id);
      navigate(`/programs/${program.id}`);
    } catch (error) {
      console.error('Error enrolling in program:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/programs/${program.id}/details`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {program.thumbnailUrl && (
        <img 
          src={program.thumbnailUrl} 
          alt={program.title}
          style={{ height: 200, objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {program.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {program.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Διάρκεια: {program.duration}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Επίπεδο: {program.level}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleViewDetails}>
          Λεπτομέρειες
        </Button>
        <Button size="small" color="primary" onClick={handleStartProgram}>
          Έναρξη Προγράμματος
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProgramCard;
