import React from 'react';
import { useParams } from 'react-router-dom';
import ContentDetails from '../components/ContentLibrary/ContentDetails';
import SimilarContent from '../components/Recommendations/SimilarContent';
import ErrorBoundary from '../components/ErrorBoundary';

const ContentDetailsPage = () => {
  const { id } = useParams();

  return (
    <div>
      <ContentDetails id={id} />
      <ErrorBoundary>
        <SimilarContent contentId={id} />
      </ErrorBoundary>
    </div>
  );
};

export default ContentDetailsPage;
