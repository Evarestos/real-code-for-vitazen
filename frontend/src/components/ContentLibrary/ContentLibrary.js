import React, { useState, useEffect } from 'react';
import ContentFilters from './ContentFilters';
import InfiniteScroll from './InfiniteScroll';
import { useInfiniteContent } from '../../hooks/useInfiniteContent';
import { useScrollPosition } from '../../hooks/useScrollPosition';

const ContentLibrary = () => {
  const [filters, setFilters] = useState({
    category: '',
    tags: [],
    creator: ''
  });

  const scrollPosition = useScrollPosition('contentLibraryScroll');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error
  } = useInfiniteContent(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [scrollPosition]);

  return (
    <div>
      <h1>Βιβλιοθήκη Περιεχομένου</h1>
      <ContentFilters filters={filters} onFilterChange={handleFilterChange} />
      {data && (
        <InfiniteScroll
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isError={isError}
          error={error}
        />
      )}
    </div>
  );
};

export default ContentLibrary;
