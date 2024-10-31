const FeedbackAnalytics = require('../services/feedbackAnalytics');
const websocketService = require('../services/websocketService');

const feedbackController = {
  async submitDetailedFeedback(req, res) {
    try {
      const { suggestionId, rating, comments, improvementHints, screenshot } = req.body;
      const userId = req.user.id;

      await FeedbackAnalytics.submitDetailedFeedback({
        userId,
        suggestionId,
        rating,
        comments,
        improvementHints,
        screenshot
      });

      // Εκπομπή ενημέρωσης μέσω WebSocket
      await websocketService.emitFeedbackUpdate();

      res.json({ message: 'Detailed feedback submitted successfully' });
    } catch (error) {
      console.error('Error submitting detailed feedback:', error);
      res.status(500).json({ error: 'Σφάλμα κατά την υποβολή αναλυτικής ανατροφοδότησης' });
    }
  },

  async getFeedbackStatistics(req, res) {
    try {
      const statistics = await FeedbackAnalytics.getFeedbackStatistics();
      res.json(statistics);
    } catch (error) {
      console.error('Error fetching feedback statistics:', error);
      res.status(500).json({ error: 'Σφάλμα κατά την ανάκτηση στατιστικών ανατροφοδότησης' });
    }
  },

  async getFeedbackInsights(req, res) {
    try {
      const insights = await FeedbackAnalytics.getFeedbackInsights();
      res.json(insights);
    } catch (error) {
      console.error('Error fetching feedback insights:', error);
      res.status(500).json({ error: 'Σφάλμα κατά την ��νάκτηση insights ανατροφοδότησης' });
    }
  },

  async processBatchFeedback(req, res) {
    try {
      const { feedbackBatch } = req.body;
      await FeedbackAnalytics.processBatchFeedback(feedbackBatch);
      res.json({ message: 'Batch feedback processed successfully' });
    } catch (error) {
      console.error('Error processing batch feedback:', error);
      res.status(500).json({ error: 'Σφάλμα κατά την επεξεργασία batch ανατροφοδότησης' });
    }
  }
};

module.exports = feedbackController;
