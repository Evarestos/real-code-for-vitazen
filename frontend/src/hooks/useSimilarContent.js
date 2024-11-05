import { useQuery } from 'react-query';
import recommendationService from '../services/recommendationService';

export const useSimilarContent = (contentId) => {
  return useQuery(
    ['similarContent', contentId],
    () => recommendationService.getSimilarContent(contentId),
    {
      enabled: !!contentId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
