import React from 'react';
import { useRecommendations } from '../../hooks/useRecommendations';
import ContentCard from '../ContentLibrary/ContentCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Skeleton from '@mui/material/Skeleton';
import { withAnalytics } from '../../hocs/withAnalytics';
import { useAnalytics } from '../../hooks/useAnalytics';

const RecommendedContent = ({ trackEvent }) => {
  const { data: recommendations, isLoading, isError } = useRecommendations();
  const { trackEvent: trackAnalyticsEvent } = useAnalytics();

  React.useEffect(() => {
    if (recommendations) {
      trackAnalyticsEvent('recommendations_shown', { count: recommendations.length });
    }
  }, [recommendations, trackAnalyticsEvent]);

  const handleContentClick = (contentId) => {
    trackEvent('recommendation_clicked', { contentId });
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton variant="text" width={200} height={30} />
        <Skeleton variant="rect" width="100%" height={200} />
      </div>
    );
  }

  if (isError) {
    return <div>Σφάλμα κατά τη φόρτωση των προτάσεων.</div>;
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div>
      <h2>Προτεινόμενο Περιεχόμενο</h2>
      <Carousel responsive={responsive}>
        {recommendations.map((content) => (
          <ContentCard 
            key={content.id} 
            content={content} 
            onClick={() => handleContentClick(content.id)}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default withAnalytics(RecommendedContent);
