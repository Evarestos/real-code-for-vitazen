import React, { useEffect, useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import ContentCard from './ContentCard';

const InfiniteScroll = ({ data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error }) => {
  const observer = useRef();
  const listRef = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (isError) {
    return <div>Σφάλμα: {error.message}</div>;
  }

  const itemCount = data.pages.reduce((acc, page) => acc + page.content.length, 0);

  const getItemData = (index) => {
    let itemIndex = index;
    for (const page of data.pages) {
      if (itemIndex < page.content.length) {
        return page.content[itemIndex];
      }
      itemIndex -= page.content.length;
    }
    return null;
  };

  const Row = ({ index, style }) => {
    const item = getItemData(index);
    if (!item) return null;

    return (
      <div style={style} ref={index === itemCount - 1 ? lastElementRef : null}>
        <ContentCard content={item} />
      </div>
    );
  };

  return (
    <div className="infinite-scroll-container">
      <List
        ref={listRef}
        height={window.innerHeight - 200} // Adjust this value based on your layout
        itemCount={itemCount}
        itemSize={250} // Adjust this value based on your ContentCard height
        width="100%"
      >
        {Row}
      </List>
      {isFetchingNextPage && <div className="loading-spinner">Φόρτωση...</div>}
    </div>
  );
};

export default InfiniteScroll;
