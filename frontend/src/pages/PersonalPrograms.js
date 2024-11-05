import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from  '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { getPersonalPrograms, createProgram, updateProgram, deleteProgram } from '../services/programService';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const PersonalPrograms = () => {
  const classes = useStyles();
  const [programs, setPrograms] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState({ name: '', description: '', details: '' });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const fetchedPrograms = await getPersonalPrograms();
      setPrograms(fetchedPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleOpen = (program = { name: '', description: '', details: '' }) => {
    setCurrentProgram(program);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProgram({ name: '', description: '', details: '' });
  };

  const handleChange = (e) => {
    setCurrentProgram({ ...currentProgram, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (currentProgram._id) {
        await updateProgram(currentProgram._id, currentProgram);
      } else {
        await createProgram(currentProgram);
      }
      fetchPrograms();
      handleClose();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProgram(id);
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Προσωπικά Προγράμματα
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Δημιουργία Νέου Προγράμματος
      </Button>
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program._id}>
            <Paper className={classes.paper}>
              <Typography variant="h6">{program.name}</Typography>
              <Typography variant="body2">{program.description}</Typography>
              <Typography variant="body2">{program.details}</Typography>
              <Button className={classes.button} variant="outlined" color="primary" onClick={() => handleOpen(program)}>
                Επεξεργασία
              </Button>
              <Button className={classes.button} variant="outlined" color="secondary" onClick={() => handleDelete(program._id)}>
                Διαγραφή
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentProgram._id ? 'Επεξεργασία Προγράμματος' : 'Νέο Πρόγραμμα'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Όνομα Προγράμματος"
            type="text"
            fullWidth
            value={currentProgram.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Περιγραφή"
            type="text"
            fullWidth
            value={currentProgram.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="details"
            label="Λεπτομέρειες"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentProgram.details}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ακύρωση
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Αποθήκευση
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PersonalPrograms;
