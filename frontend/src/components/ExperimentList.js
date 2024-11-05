import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@material-ui/core';

const ExperimentList = ({ experiments, onExperimentSelect }) => {
  return (
    <div>
      <Typography variant="h6">Λίστα Πειραμάτων</Typography>
      <List>
        {experiments.map((experiment) => (
          <ListItem 
            button 
            key={experiment.id} 
            onClick={() => onExperimentSelect(experiment)}
          >
            <ListItemText 
              primary={experiment.name} 
              secondary={`Κατάσταση: ${experiment.status}`} 
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ExperimentList;
