import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Typography,
  Chip
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getSharedLayouts, removeSharedUser } from '../../services/sharedLayoutService';

const SharedLayoutsList = () => {
  const queryClient = useQueryClient();
  const { data: sharedLayouts, isLoading, isError } = useQuery('sharedLayouts', getSharedLayouts);

  const removeMutation = useMutation(removeSharedUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('sharedLayouts');
    },
  });

  if (isLoading) return <Typography>Φόρτωση...</Typography>;
  if (isError) return <Typography>Σφάλμα κατά τη φόρτωση των κοινόχρηστων layouts.</Typography>;

  return (
    <List>
      {sharedLayouts.map((layout) => (
        <ListItem key={layout._id}>
          <ListItemText
            primary={layout.name}
            secondary={
              <>
                <Typography component="span" variant="body2" color="textPrimary">
                  Κοινοποιήθηκε σε: {layout.sharedWith.map(user => user.username).join(', ')}
                </Typography>
                <br />
                <Chip 
                  label={layout.isDefault ? 'Προεπιλογή' : 'Κανονικό'} 
                  color={layout.isDefault ? 'primary' : 'default'} 
                  size="small" 
                />
              </>
            }
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit">
              <Edit />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => removeMutation.mutate(layout._id)}>
              <Delete />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default SharedLayoutsList;
