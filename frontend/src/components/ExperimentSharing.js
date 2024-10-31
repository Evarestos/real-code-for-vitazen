import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem } from '@material-ui/core';
import { shareExperiment, makeExperimentPublic } from '../services/api';

const ExperimentSharing = ({ experimentId, token }) => {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState('view');

  const handleShare = async () => {
    try {
      await shareExperiment(token, experimentId, email, permissions);
      alert('Experiment shared successfully');
    } catch (error) {
      console.error('Error sharing experiment:', error);
    }
  };

  const handleMakePublic = async () => {
    try {
      await makeExperimentPublic(token, experimentId);
      alert('Experiment is now public');
    } catch (error) {
      console.error('Error making experiment public:', error);
    }
  };

  return (
    <div>
      <TextField
        label="Email to share with"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Select
        value={permissions}
        onChange={(e) => setPermissions(e.target.value)}
      >
        <MenuItem value="view">View</MenuItem>
        <MenuItem value="edit">Edit</MenuItem>
      </Select>
      <Button onClick={handleShare}>Share</Button>
      <Button onClick={handleMakePublic}>Make Public</Button>
    </div>
  );
};

export default ExperimentSharing;
