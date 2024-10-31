import { useQuery } from 'react-query';
import favoriteService from '../services/favoriteService';
import { useAuth } from '../contexts/AuthContext';

export const useFavorites = () => {
  const { currentUser } = useAuth();

  return useQuery(['favorites', currentUser.id], () => favoriteService.getFavorites(currentUser.id), {
    enabled: !!currentUser,
    select: (data) => data.map(favorite => ({
      ...favorite,
      dateAdded: new Date(favorite.createdAt)
    }))
  });
};
