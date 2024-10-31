import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import favoriteService from '../../services/favoriteService';

const FavoriteButton = ({ contentId, isFavorite }) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const addMutation = useMutation(
    () => favoriteService.addFavorite(currentUser.id, contentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['favorites', currentUser.id]);
      },
    }
  );

  const removeMutation = useMutation(
    () => favoriteService.removeFavorite(currentUser.id, contentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['favorites', currentUser.id]);
      },
    }
  );

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  return (
    <button onClick={handleToggleFavorite} disabled={addMutation.isLoading || removeMutation.isLoading}>
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
