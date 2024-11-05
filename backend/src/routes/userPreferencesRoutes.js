const express = require('express');
const router = express.Router();
const userPreferencesController = require('../controllers/userPreferencesController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', userPreferencesController.getPreferences);
router.put('/', userPreferencesController.updatePreferences);
router.post('/reset', userPreferencesController.resetPreferences);

module.exports = router;
