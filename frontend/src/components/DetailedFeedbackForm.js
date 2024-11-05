import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating, Typography } from '@mui/material';
import aiService from '../services/aiService';

const DetailedFeedbackForm = ({ suggestionId, categoryId, onClose }) => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    usability: 0,
    relevance: 0
  });

  const handleSubmit = async () => {
    try {
      await aiService.submitDetailedFeedback({
        suggestionId,
        categoryId,
        ...feedback
      });
      onClose();
    } catch (error) {
      console.error('Error submitting detailed feedback:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Αναλυτική Αξιολόγηση</DialogTitle>
      <DialogContent>
        <Rating
          value={feedback.rating}
          onChange={(event, newValue) => {
            setFeedback(prev => ({ ...prev, rating: newValue }));
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="Σχόλια"
          value={feedback.comment}
          onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
        />
        <Typography>Χρηστικότητα</Typography>
        <Rating
          value={feedback.usability}
          onChange={(event, newValue) => {
            setFeedback(prev => ({ ...prev, usability: newValue }));
          }}
        />
        <Typography>Συνάφεια</Typography>
        <Rating
          value={feedback.relevance}
          onChange={(event, newValue) => {
            setFeedback(prev => ({ ...prev, relevance: newValue }));
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ακύρωση</Button>
        <Button onClick={handleSubmit} color="primary">
          Υποβολή
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailedFeedbackForm;
