import { useQuery } from 'react-query';
import recommendationService from '../services/recommendationService';
import { useAuth } from '../contexts/AuthContext';

export const useRecommendations = () => {
  const { currentUser } = useAuth();

  return useQuery(
    ['recommendations', currentUser?.id],
    () => recommendationService.getRecommendations(currentUser.id),
    {
      enabled: !!currentUser,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
