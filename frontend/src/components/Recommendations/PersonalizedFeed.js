import React from 'react';
import { usePersonalizedFeed } from '../../hooks/usePersonalizedFeed';
import ContentCard from '../ContentLibrary/ContentCard';
import Skeleton from '@mui/material/Skeleton';
import { motion } from 'framer-motion';

const PersonalizedFeed = () => {
  const { data: feed, isLoading, isError } = usePersonalizedFeed();

  if (isLoading) {
    return (
      <div>
        <Skeleton variant="text" width={200} height={30} />
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rect" width="100%" height={200} style={{ marginBottom: 10 }} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Σφάλμα κατά τη φόρτωση του εξατομικευμένου feed.</div>;
  }

  return (
    <div>
      <h2>Το Προσωπικό σας Feed</h2>
      {feed.map((content, index) => (
        <motion.div
          key={content.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ContentCard content={content} />
        </motion.div>
      ))}
    </div>
  );
};

export default PersonalizedFeed;
