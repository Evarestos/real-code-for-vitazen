const express = require('express');
const router = express.Router();
const dashboardPreferenceController = require('../controllers/dashboardPreferenceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', dashboardPreferenceController.savePreference);
router.get('/', dashboardPreferenceController.getPreferences);
router.put('/:id', dashboardPreferenceController.updatePreference);
router.post('/:id/undo', dashboardPreferenceController.undo);
router.post('/:id/redo', dashboardPreferenceController.redo);
router.delete('/:id', dashboardPreferenceController.deletePreference);
router.get('/default', dashboardPreferenceController.getDefaultPreference);
router.post('/:id/set-default', dashboardPreferenceController.setDefaultPreference);

module.exports = router;
