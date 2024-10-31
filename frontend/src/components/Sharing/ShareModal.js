import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Autocomplete
} from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { useMutation, useQuery } from 'react-query';
import { shareLayout, searchUsers } from '../../services/sharedLayoutService';

const ShareModal = ({ open, onClose, layoutId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState('view');
  const [expirationDate, setExpirationDate] = useState(null);
  const [message, setMessage] = useState('');

  const { data: users, isLoading } = useQuery(['searchUsers'], searchUsers);

  const shareMutation = useMutation(shareLayout, {
    onSuccess: () => {
      onClose();
      // Εδώ θα μπορούσαμε να προσθέσουμε ένα toast notification
    },
  });

  const handleShare = () => {
    if (!selectedUser) return;

    shareMutation.mutate({
      layoutId,
      sharedWithUserId: selectedUser.id,
      permission,
      expirationDate,
      message
    });
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="share-dialog-title">
      <DialogTitle id="share-dialog-title">Μοιραστείτε το Layout</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={users || []}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Αναζήτηση χρήστη" variant="outlined" />}
          onChange={(event, newValue) => {
            setSelectedUser(newValue);
          }}
          loading={isLoading}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Δικαιώματα</InputLabel>
          <Select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <MenuItem value="view">Προβολή</MenuItem>
            <MenuItem value="edit">Επεξεργασία</MenuItem>
            <MenuItem value="admin">Διαχείριση</MenuItem>
          </Select>
        </FormControl>
        <DatePicker
          label="Ημερομηνία λήξης"
          value={expirationDate}
          onChange={setExpirationDate}
          renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Προσωπικό μήνυμα"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Ακύρωση
        </Button>
        <Button onClick={handleShare} color="primary" variant="contained" disabled={!selectedUser}>
          Κοινοποίηση
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;
