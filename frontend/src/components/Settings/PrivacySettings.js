import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Switch, 
  FormControlLabel, 
  Button, 
  Grid, 
  Divider, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Snackbar
} from  '@mui/material';
import { Alert } from  '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';

const PrivacySettings = ({ setHasChanges }) => {
  const { currentUser, updateUser } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: {
      allowDataSharing: false,
      shareActivityData: false,
      shareFitnessData: false
    },
    analytics: {
      allowAnalytics: false,
      allowPersonalizedAds: false
    },
    cookies: {
      acceptAllCookies: false,
      acceptEssentialCookies: true,
      acceptAnalyticsCookies: false,
      acceptMarketingCookies: false
    },
    profileVisibility: {
      publicProfile: false,
      showInSearch: false,
      showActivity: false
    },
    connectionSettings: {
      allowFriendRequests: true,
      showFriendList: false
    }
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (currentUser && currentUser.privacySettings) {
      setPrivacySettings(currentUser.privacySettings);
    }
  }, [currentUser]);

  const handleSwitchChange = (section, key) => (event) => {
    setPrivacySettings(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: event.target.checked
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await userService.updatePrivacySettings(currentUser.id, privacySettings);
      updateUser(updatedUser);
      setSnackbar({ open: true, message: 'Οι ρυθμίσεις απορρήτου ενημερώθηκαν επιτυχώς', severity: 'success' });
      setHasChanges(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Σφάλμα κατά την ενημέρωση των ρυθμίσεων απορρήτου', severity: 'error' });
    }
  };

  const handleExportData = async () => {
    try {
      const data = await userService.exportUserData(currentUser.id);
      // Εδώ θα μπορούσατε να προσθέσετε λογική για το κατέβασμα των δεδομένων
      setSnackbar({ open: true, message: 'Τα δεδομένα σας έχουν εξαχθεί επιτυχώς', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Σφάλμα κατά την εξαγωγή των δεδομένων', severity: 'error' });
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">Διαχείριση Δεδομένων</Typography>
        <FormControlLabel
          control={<Switch checked={privacySettings.dataSharing.allowDataSharing} onChange={handleSwitchChange('dataSharing', 'allowDataSharing')} />}
          label="Επιτρέπω την κοινή χρήση δεδομένων"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.dataSharing.shareActivityData} onChange={handleSwitchChange('dataSharing', 'shareActivityData')} />}
          label="Κοινή χρήση δεδομένων δραστηριότητας"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.dataSharing.shareFitnessData} onChange={handleSwitchChange('dataSharing', 'shareFitnessData')} />}
          label="Κοινή χρήση δεδομένων φυσικής κατάστασης"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">Αναλυτικά Στοιχεία</Typography>
        <FormControlLabel
          control={<Switch checked={privacySettings.analytics.allowAnalytics} onChange={handleSwitchChange('analytics', 'allowAnalytics')} />}
          label="Επιτρέπω τη συλλογή αναλυτικών στοιχείων"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.analytics.allowPersonalizedAds} onChange={handleSwitchChange('analytics', 'allowPersonalizedAds')} />}
          label="Επιτρέπω εξατομικευμένες διαφημίσεις"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">Διαχείριση Cookies</Typography>
        <FormControlLabel
          control={<Switch checked={privacySettings.cookies.acceptAllCookies} onChange={handleSwitchChange('cookies', 'acceptAllCookies')} />}
          label="Αποδοχή όλων των cookies"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.cookies.acceptEssentialCookies} onChange={handleSwitchChange('cookies', 'acceptEssentialCookies')} />}
          label="Αποδοχή απαραίτητων cookies"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.cookies.acceptAnalyticsCookies} onChange={handleSwitchChange('cookies', 'acceptAnalyticsCookies')} />}
          label="Αποδοχή cookies αναλυτικών στοιχείων"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.cookies.acceptMarketingCookies} onChange={handleSwitchChange('cookies', 'acceptMarketingCookies')} />}
          label="Αποδοχή cookies μάρκετινγκ"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">Ορατότητα Προφίλ</Typography>
        <FormControlLabel
          control={<Switch checked={privacySettings.profileVisibility.publicProfile} onChange={handleSwitchChange('profileVisibility', 'publicProfile')} />}
          label="Δημόσιο προφίλ"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.profileVisibility.showInSearch} onChange={handleSwitchChange('profileVisibility', 'showInSearch')} />}
          label="Εμφάνιση στην αναζήτηση"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.profileVisibility.showActivity} onChange={handleSwitchChange('profileVisibility', 'showActivity')} />}
          label="Εμφάνιση δραστηριότητας"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">Ρυθμίσεις Συνδέσεων</Typography>
        <FormControlLabel
          control={<Switch checked={privacySettings.connectionSettings.allowFriendRequests} onChange={handleSwitchChange('connectionSettings', 'allowFriendRequests')} />}
          label="Επιτρέπω αιτήματα φιλίας"
        />
        <FormControlLabel
          control={<Switch checked={privacySettings.connectionSettings.showFriendList} onChange={handleSwitchChange('connectionSettings', 'showFriendList')} />}
          label="Εμφάνιση λίστας φίλων"
        />
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Αποθήκευση Αλλαγών
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">Διαχείριση Δεδομένων Χρήστη</Typography>
        <Button variant="outlined" color="primary" onClick={handleExportData}>
          Εξαγωγή Δεδομένων
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setOpenDeleteDialog(true)}>
          Διαγραφή Λογαριασμού
        </Button>
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
    </Grid>
  );
};

export default PrivacySettings;
