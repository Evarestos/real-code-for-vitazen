import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Grid } from '@material-ui/core';
import { createMultivariateExperiment } from '../services/api';

const MultivariateExperimentCreator = ({ token, onExperimentCreated }) => {
  const [experimentData, setExperimentData] = useState({
    name: '',
    description: '',
    variables: [{ name: '', type: '', possibleValues: [] }]
  });

  const handleInputChange = (e) => {
    setExperimentData({ ...experimentData, [e.target.name]: e.target.value });
  };

  const handleVariableChange = (index, field, value) => {
    const newVariables = [...experimentData.variables];
    newVariables[index][field] = value;
    setExperimentData({ ...experimentData, variables: newVariables });
  };

  const addVariable = () => {
    setExperimentData({
      ...experimentData,
      variables: [...experimentData.variables, { name: '', type: '', possibleValues: [] }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newExperiment = await createMultivariateExperiment(token, experimentData);
      onExperimentCreated(newExperiment);
    } catch (error) {
      console.error('Error creating multivariate experiment:', error);
    }
  };

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h5">Create Multivariate Experiment</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Experiment Name"
          value={experimentData.name}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Description"
          multiline
          rows={4}
          value={experimentData.description}
          onChange={handleInputChange}
        />
        {experimentData.variables.map((variable, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Variable Name"
                value={variable.name}
                onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Variable Type"
                value={variable.type}
                onChange={(e) => handleVariableChange(index, 'type', e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Possible Values (comma-separated)"
                value={variable.possibleValues.join(',')}
                onChange={(e) => handleVariableChange(index, 'possibleValues', e.target.value.split(','))}
              />
            </Grid>
          </Grid>
        ))}
        <Button onClick={addVariable}>Add Variable</Button>
        <Button type="submit" variant="contained" color="primary">
          Create Experiment
        </Button>
      </form>
    </Paper>
  );
};

export default MultivariateExperimentCreator;
