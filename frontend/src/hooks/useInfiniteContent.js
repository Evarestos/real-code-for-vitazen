import { useInfiniteQuery } from 'react-query';
import contentService from '../services/contentService';

export const useInfiniteContent = (filters) => {
  return useInfiniteQuery(
    ['infiniteContent', filters],
    ({ pageParam = 1 }) => contentService.filterContent({ ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
          return lastPage.pagination.currentPage + 1;
        }
        return undefined;
      },
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
