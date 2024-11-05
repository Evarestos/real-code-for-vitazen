import { useQuery } from 'react-query';
import contentService from '../services/contentService';

export const useContentSearch = (query, page = 1, limit = 10) => {
  return useQuery(
    ['contentSearch', query, page],
    () => contentService.searchContent(query, page, limit),
    {
      enabled: !!query,
      keepPreviousData: true,
    }
  );
};
