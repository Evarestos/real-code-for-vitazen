import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import contentService from '../../services/contentService';

const ContentDetails = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentDetails();
  }, [id]);

  const fetchContentDetails = async () => {
    setLoading(true);
    try {
      const contentData = await contentService.getContentDetails(id);
      setContent(contentData);
      const relatedData = await contentService.getRelatedContent(id);
      setRelatedContent(relatedData);
    } catch (error) {
      console.error('Σφάλμα κατά την ανάκτηση λεπτομερειών περιεχομένου:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Φόρτωση...</p>;
  }

  if (!content) {
    return <p>Το περιεχόμενο δεν βρέθηκε.</p>;
  }

  return (
    <div className="content-details">
      <h1>{content.title}</h1>
      <video src={content.videoUrl} controls />
      <p>{content.description}</p>
      <p>Δημιουργός: {content.creator}</p>
      <p>Κατηγορία: {content.category}</p>
      <div>
        <h2>Σχετικό περιεχόμενο</h2>
        {relatedContent.map(item => (
          <ContentCard key={item._id} content={item} />
        ))}
      </div>
    </div>
  );
};

export default ContentDetails;
