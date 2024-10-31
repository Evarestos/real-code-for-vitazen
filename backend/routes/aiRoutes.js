const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

// ... υπάρχοντα routes ...

router.post('/suggestions', auth, aiController.getSuggestions);
router.get('/categories', auth, aiController.getCategories);
router.post('/feedback/detailed', auth, feedbackController.submitDetailedFeedback);
router.get('/feedback/statistics', auth, feedbackController.getFeedbackStatistics);
router.get('/feedback/insights', auth, feedbackController.getFeedbackInsights);
router.post('/feedback/batch', auth, feedbackController.processBatchFeedback);

module.exports = router;
