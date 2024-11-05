const aiService = require('../services/aiService');
const suggestionService = require('../services/suggestionService');

// ... υπάρχον κώδικας ...

const getSuggestions = async (req, res) => {
  try {
    const { input, categoryId } = req.body;
    const userId = req.user.id;

    const suggestions = await suggestionService.generateSuggestions(userId, input, categoryId);

    res.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Σφάλμα κατά τη δημιουργία προτάσεων' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await suggestionService.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Σφάλμα κατά την ανάκτηση κατηγοριών' });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { suggestionId, rating, context, categoryId, additionalComments } = req.body;
    const userId = req.user.id;

    await suggestionService.submitFeedback({
      userId,
      suggestionId,
      rating,
      context,
      categoryId,
      additionalComments
    });

    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Σφάλμα κατά την υποβολή του feedback' });
  }
};

module.exports = {
  // ... υπάρχοντες controllers ...
  getSuggestions,
  getCategories,
  submitFeedback
};
