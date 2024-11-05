import React from 'react';
import { useSimilarContent } from '../../hooks/useSimilarContent';
import ContentCard from '../ContentLibrary/ContentCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Skeleton from '@material-ui/lab/Skeleton';

const SimilarContent = ({ contentId }) => {
  const { data: similarContent, isLoading, isError } = useSimilarContent(contentId);

  if (isLoading) {
    return (
      <div>
        <Skeleton variant="text" width={200} height={30} />
        <Skeleton variant="rect" width="100%" height={200} />
      </div>
    );
  }

  if (isError) {
    return <div>Σφάλμα κατά τη φόρτωση παρόμοιου περιεχομένου.</div>;
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
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
      <h3>Παρόμοιο Περιεχόμενο</h3>
      <Carousel responsive={responsive}>
        {similarContent.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </Carousel>
    </div>
  );
};

export default SimilarContent;
