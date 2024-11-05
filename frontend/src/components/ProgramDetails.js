import React, { useState, useEffect, useCallback } from 'react';
import { 
  Paper, Typography, Grid, Button, TextField, 
  List, ListItem, ListItemText, Divider, 
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit, Print, Share, Favorite, FavoriteBorder } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { getProgramDetails, updateProgram, trackProgress, toggleFavorite } from '../services/programService';
import ProgressChart from './ProgressChart';

const ProgramDetails = ({ programId }) => {
  const { t } = useTranslation();
  const [program, setProgram] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [progress, setProgress] = useState([]);
  const [note, setNote] = useState('');
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  const fetchProgramDetails = useCallback(async () => {
    try {
      const details = await getProgramDetails(programId);
      setProgram(details);
      setEditedContent(details.content);
      setProgress(details.progress || []);
    } catch (error) {
      console.error('Error fetching program details:', error);
      // Προσθέστε εδώ το showToast αν το χρησιμοποιείτε
    }
  }, [programId]);

  useEffect(() => {
    fetchProgramDetails();
  }, [fetchProgramDetails]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedProgram = await updateProgram(programId, { content: editedContent });
      setProgram(updatedProgram);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating program:', error);
      // Handle error (e.g., show notification)
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implement share functionality (e.g., open a share dialog)
    console.log('Share program:', programId);
  };

  const handleToggleFavorite = async () => {
    try {
      const updatedProgram = await toggleFavorite(programId);
      setProgram(updatedProgram);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Handle error (e.g., show notification)
    }
  };

  const handleAddProgress = async () => {
    try {
      const newProgress = await trackProgress(programId, { value: Math.random() * 100 }); // Replace with actual progress data
      setProgress(newProgress);
    } catch (error) {
      console.error('Error adding progress:', error);
      // Handle error (e.g., show notification)
    }
  };

  const handleAddNote = () => {
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = async () => {
    try {
      const updatedProgram = await updateProgram(programId, { notes: [...program.notes, note] });
      setProgram(updatedProgram);
      setNote('');
      setIsNoteDialogOpen(false);
    } catch (error) {
      console.error('Error saving note:', error);
      // Handle error (e.g., show notification)
    }
  };

  const renderNotes = () => {
    if (!program.notes || !Array.isArray(program.notes)) {
      return null;
    }

    return program.notes.map((note, index) => (
      <React.Fragment key={index}>
        <ListItem>
          <ListItemText primary={note} />
        </ListItem>
        {index < program.notes.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };

  if (!program) {
    return <Typography>{t('programs.loading')}</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">{program.title}</Typography>
          <Typography variant="subtitle1">{t(`programs.categories.${program.category}`)}</Typography>
          <Typography variant="subtitle2">{t(`programs.difficulty.${program.difficulty}`)}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button startIcon={<Edit />} onClick={handleEdit}>{t('programs.edit')}</Button>
          <Button startIcon={<Print />} onClick={handlePrint}>{t('programs.print')}</Button>
          <Button startIcon={<Share />} onClick={handleShare}>{t('programs.share')}</Button>
          <Button 
            startIcon={program.isFavorite ? <Favorite /> : <FavoriteBorder />} 
            onClick={handleToggleFavorite}
          >
            {program.isFavorite ? t('programs.unfavorite') : t('programs.favorite')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <Button onClick={handleSave}>{t('programs.save')}</Button>
            </>
          ) : (
            <Typography>{program.content}</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <ProgressChart progress={program.progress} goals={program.goals} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{t('programs.notes')}</Typography>
          <List>
            {renderNotes()}
          </List>
          <Button onClick={handleAddNote}>{t('programs.addNote')}</Button>
        </Grid>
      </Grid>
      <Dialog open={isNoteDialogOpen} onClose={() => setIsNoteDialogOpen(false)}>
        <DialogTitle>{t('programs.addNote')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('programs.noteLabel')}
            fullWidth
            multiline
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNoteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSaveNote}>{t('common.save')}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProgramDetails;
 