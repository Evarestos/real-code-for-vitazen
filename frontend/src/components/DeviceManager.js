import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

const DeviceManager = () => {
  const { trustedDevices, removeTrustedDevice } = useAuth();

  const handleRemoveDevice = async (deviceId) => {
    if (window.confirm('Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτή τη συσκευή;')) {
      await removeTrustedDevice(deviceId);
    }
  };

  return (
    <Card>
      <Typography variant="h6" gutterBottom>Αξιόπιστες Συσκευές</Typography>
      {trustedDevices.length === 0 ? (
        <Typography>Δεν υπάρχουν αξιόπιστες συσκευές.</Typography>
      ) : (
        <List>
          {trustedDevices.map((device) => (
            <ListItem key={device.id}>
              <ListItemText
                primary={device.name}
                secondary={`Τελευταία πρόσβαση: ${new Date(device.lastAccess).toLocaleString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDevice(device.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
};

export default DeviceManager;
