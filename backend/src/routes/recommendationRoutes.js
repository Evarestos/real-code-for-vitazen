const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:userId', recommendationController.getRecommendations);
router.post('/initialize-content-based', recommendationController.initializeContentBasedFiltering);

module.exports = router;
