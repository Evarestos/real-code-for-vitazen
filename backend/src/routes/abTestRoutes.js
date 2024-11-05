const express = require('express');
const router = express.Router();
const abTestController = require('../controllers/abTestController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', abTestController.createTest);
router.get('/', abTestController.getAllTests);
router.get('/:id', abTestController.getTest);
router.put('/:id', abTestController.updateTest);
router.delete('/:id', abTestController.deleteTest);
router.post('/event', abTestController.recordEvent);
router.get('/:id/results', abTestController.getTestResults);

module.exports = router;
