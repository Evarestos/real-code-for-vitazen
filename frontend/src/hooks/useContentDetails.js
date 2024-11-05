import { useQuery } from 'react-query';
import contentService from '../services/contentService';

export const useContentDetails = (id) => {
  return useQuery(
    ['contentDetails', id],
    () => contentService.getContentDetails(id),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
