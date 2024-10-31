import { db } from '../database';

export const saveSuggestionFeedback = async (userId, suggestionId, feedback) => {
  try {
    await db.collection('suggestionFeedback').add({
      userId,
      suggestionId,
      feedback,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving suggestion feedback:', error);
    throw error;
  }
};

export const getSuggestionFeedback = async (suggestionId) => {
  try {
    const snapshot = await db.collection('suggestionFeedback')
      .where('suggestionId', '==', suggestionId)
      .get();

    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting suggestion feedback:', error);
    throw error;
  }
};
