import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import programService from '../services/programService';
import useToast from '../hooks/useToast';

const MyPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (currentUser) {
      loadPrograms();
    }
  }, [currentUser]);

  const loadPrograms = async () => {
    try {
      const userPrograms = await programService.getUserPrograms(currentUser.id);
      setPrograms(userPrograms);
    } catch (error) {
      console.error('Σφάλμα κατά τη φόρτωση των προγραμμάτων:', error);
      showToast('error', 'Σφάλμα κατά τη φόρτωση των προγραμμάτων');
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await programService.deleteProgram(programId);
      setPrograms(programs.filter(program => program.id !== programId));
      showToast('success', 'Το πρόγραμμα διαγράφηκε επιτυχώς');
    } catch (error) {
      console.error('Σφάλμα κατά τη διαγραφή του προγράμματος:', error);
      showToast('error', 'Σφάλμα κατά τη διαγραφή του προγράμματος');
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setEditedContent(program.content);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await programService.updateProgram(selectedProgram.id, { content: editedContent });
      setPrograms(programs.map(p => 
        p.id === selectedProgram.id ? { ...p, content: editedContent } : p
      ));
      setIsEditDialogOpen(false);
      showToast('success', 'Το πρόγραμμα ενημερώθηκε επιτυχώς');
    } catch (error) {
      console.error('Σφάλμα κατά την ενημέρωση του προγράμματος:', error);
      showToast('error', 'Σφάλμα κατά την ενημέρωση του προγράμματος');
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Τα Προγράμματά μου
      </Typography>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} md={6} key={program.id}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6">{program.name}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {program.description}
              </Typography>
              <Typography variant="body1" paragraph>
                {program.content}
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => handleEditProgram(program)}
                style={{ marginRight: '1rem' }}
              >
                Επεξεργασία
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => handleDeleteProgram(program.id)}
              >
                Διαγραφή
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Επεξεργασία Προγράμματος</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            Ακύρωση
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Αποθήκευση
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyPrograms; 