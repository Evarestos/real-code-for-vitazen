import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from 'react-icons/fa';
import aiService from '../services/aiService';
import DetailedFeedbackForm from './DetailedFeedbackForm'; // Προσθέστε αυτή τη γραμμή

const FeedbackButtons = ({ suggestionId, categoryId }) => {
  const [feedback, setFeedback] = useState(null);
  const [showDetailedForm, setShowDetailedForm] = useState(false);

  const handleFeedback = async (rating) => {
    setFeedback(rating);
    try {
      await aiService.submitFeedback({
        suggestionId,
        categoryId,
        rating,
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="feedback-buttons">
      <button
        onClick={() => handleFeedback(1)}
        className={`feedback-button ${feedback === 1 ? 'active' : ''}`}
      >
        <FaThumbsUp />
      </button>
      <button
        onClick={() => handleFeedback(-1)}
        className={`feedback-button ${feedback === -1 ? 'active' : ''}`}
      >
        <FaThumbsDown />
      </button>
      <button
        onClick={() => setShowDetailedForm(true)}
        className="feedback-button"
      >
        <FaCommentAlt />
      </button>
      {showDetailedForm && (
        <DetailedFeedbackForm
          suggestionId={suggestionId}
          categoryId={categoryId}
          onClose={() => setShowDetailedForm(false)}
        />
      )}
    </div>
  );
};

export default FeedbackButtons;
