import { useQuery } from 'react-query';
import contentService from '../services/contentService';

export const useContent = (filters, page = 1, limit = 10) => {
  return useQuery(
    ['content', filters, page],
    () => contentService.filterContent({ ...filters, page, limit }),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
