import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const AccountSettings = ({ setHasChanges }) => {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    emailPreferences: {
      newsletter: false,
      notifications: false
    }
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (currentUser) {
      setFormData(prevState => ({
        ...prevState,
        username: currentUser.username,
        email: currentUser.email,
        emailPreferences: currentUser.emailPreferences || { newsletter: false, notifications: false }
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setHasChanges(true);
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      emailPreferences: {
        ...prevState.emailPreferences,
        [name]: checked
      }
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('Οι κωδικοί πρόσβασης δεν ταιριάζουν');
      }

      const updatedUser = await userService.updateUser(currentUser.id, {
        username: formData.username,
        email: formData.email,
        ...(formData.newPassword && { password: formData.newPassword }),
        emailPreferences: formData.emailPreferences
      });

      updateUser(updatedUser);
      setSnackbar({ open: true, message: 'Οι ρυθμίσεις του λογαριασμού ενημερώθηκαν επιτυχώς', severity: 'success' });
      setHasChanges(false);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteUser(currentUser.id);
      // Εδώ θα πρέπει να γίνει logout και ανακατεύθυνση στην αρχική σελίδα
      setSnackbar({ open: true, message: 'Ο λογαριασμός σας διαγράφηκε επιτυχώς', severity: 'info' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Σφάλμα κατά τη διαγραφή του λογαριασμού', severity: 'error' });
    }
    setOpenDeleteDialog(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Προσωπικά Στοιχεία</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Όνομα Χρήστη"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Αλλαγή Κωδικού Πρόσβασης</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Νέος Κωδικός Πρόσβασης"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Επιβεβαίωση Νέου Κωδικού"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Προτιμήσεις Email</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.emailPreferences.newsletter}
                onChange={handleSwitchChange}
                name="newsletter"
              />
            }
            label="Λήψη newsletter"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.emailPreferences.notifications}
                onChange={handleSwitchChange}
                name="notifications"
              />
            }
            label="Λήψη ειδοποιήσεων μέσω email"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Αποθήκευση Αλλαγών
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenDeleteDialog(true)}>
            Διαγραφή Λογαριασμού
          </Button>
        </Grid>
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Διαγραφή Λογαριασμού"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Ακύρωση
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary" autoFocus>
            Διαγραφή
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default AccountSettings;
