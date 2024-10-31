import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from  '@mui/material';
import NotificationSettings from '../components/Settings/NotificationSettings';
import AccountSettings from '../components/Settings/AccountSettings';
import PrivacySettings from '../components/Settings/PrivacySettings';
import { useNotifications } from '../contexts/NotificationContext';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { preferences, updatePreferences, resetPreferences, isLoadingPreferences, preferencesError } = useNotifications();
  const [preferencesState, setPreferencesState] = useState({});

  const handleTabChange = (event, newValue) => {
    if (hasChanges) {
      setIsDialogOpen(true);
    } else {
      setActiveTab(newValue);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updatePreferences(preferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
      // Εδώ θα μπορούσατε να εμφανίσετε ένα μήνυμα σφάλματος στον χρήστη
    }
  };

  const handleDiscardChanges = () => {
    setHasChanges(false);
    setIsDialogOpen(false);
    // Επαναφορά των προτιμήσεων στην αρχική τους κατάσταση
    // Αυτό θα μπορούσε να γίνει με την επαναφόρτωση των προτιμήσεων από το backend
    fetchPreferences();
  };

  const handleResetToDefaults = async () => {
    try {
      await resetPreferences();
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
      // Εδώ θα μπορούσατε να εμφανίσετε ένα μήνυμα σφάλματος στον χρήστη
    }
  };

  const fetchPreferences = async () => {
    // Προσθέστε τη λογική λήψης προτιμήσεων
    setPreferencesState({});
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  if (isLoadingPreferences) {
    return <div>Loading preferences...</div>;
  }

  if (preferencesError) {
    return <div>Error loading preferences: {preferencesError}</div>;
  }

  return (
    <Container maxWidth="md">
      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Ειδοποιήσεις" />
          <Tab label="Λογαριασμός" />
          <Tab label="Απόρρητο" />
        </Tabs>
        {activeTab === 0 && <NotificationSettings setHasChanges={setHasChanges} />}
        {activeTab === 1 && <AccountSettings setHasChanges={setHasChanges} />}
        {activeTab === 2 && <PrivacySettings setHasChanges={setHasChanges} />}
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleResetToDefaults} color="secondary">
            Επαναφορά Προεπιλογών
          </Button>
          <Button onClick={handleSaveChanges} color="primary" variant="contained" disabled={!hasChanges}>
            Αποθήκευση Αλλαγών
          </Button>
        </div>
      </Paper>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Μη αποθηκευμένες αλλαγές</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Έχετε μη αποθηκευμένες αλλαγές. Θέλετε να τις αποθηκεύσετε πριν φύγετε από αυτή τη σελίδα;
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardChanges} color="secondary">
            Απόρριψη
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Αποθήκευση
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserSettings;
