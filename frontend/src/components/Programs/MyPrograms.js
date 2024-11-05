import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getPrograms, deleteProgram, updateProgram } from '../../services/programService';

const MyPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPrograms();
    }
  }, [user]);

  const loadPrograms = async () => {
    try {
      const userPrograms = await getPrograms(user.id);
      setPrograms(userPrograms);
    } catch (error) {
      console.error('Σφάλμα κατά τη φόρτωση των προγραμμάτων:', error);
    }
  };

  const handleDeleteProgram = async (programId) => {
    try {
      await deleteProgram(programId);
      setPrograms(programs.filter(program => program.id !== programId));
    } catch (error) {
      console.error('Σφάλμα κατά τη διαγραφή του προγράμματος:', error);
    }
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setEditedContent(program.content);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateProgram(selectedProgram.id, { content: editedContent });
      setPrograms(programs.map(p => 
        p.id === selectedProgram.id ? { ...p, content: editedContent } : p
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Σφάλμα κατά την ενημέρωση του προγράμματος:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        Τα Προγράμματά μου
      </Typography>
      <List>
        {programs.map((program) => (
          <ListItem key={program.id}>
            <ListItemText 
              primary={program.name}
              secondary={program.content.substring(0, 100) + '...'}
            />
            <Button onClick={() => handleEditProgram(program)}>Επεξεργασία</Button>
            <Button onClick={() => handleDeleteProgram(program.id)} color="secondary">Διαγραφή</Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
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
          <Button onClick={() => setIsEditDialogOpen(false)}>Ακύρωση</Button>
          <Button onClick={handleSaveEdit} color="primary">Αποθήκευση</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyPrograms;
