import { useQuery } from 'react-query';
import recommendationService from '../services/recommendationService';
import { useAuth } from '../contexts/AuthContext';

export const usePersonalizedFeed = () => {
  const { currentUser } = useAuth();

  return useQuery(
    ['personalizedFeed', currentUser?.id],
    () => recommendationService.getPersonalizedFeed(currentUser.id),
    {
      enabled: !!currentUser,
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );
};
