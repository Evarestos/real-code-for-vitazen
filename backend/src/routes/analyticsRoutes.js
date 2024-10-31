const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const { analyticsLimiter } = require('../middleware/rateLimitMiddleware');

router.use(authMiddleware);

router.post('/events', analyticsLimiter, analyticsController.logEvent);
router.get('/metrics', analyticsController.getMetrics);
router.get('/reports', analyticsController.getReports);

module.exports = router;
