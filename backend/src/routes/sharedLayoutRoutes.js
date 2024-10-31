const express = require('express');
const router = express.Router();
const sharedLayoutController = require('../controllers/sharedLayoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/share', sharedLayoutController.shareLayout);
router.get('/', sharedLayoutController.getSharedLayouts);
router.put('/permission', sharedLayoutController.updateSharePermission);
router.post('/:sharedLayoutId/accept', sharedLayoutController.acceptShareInvitation);
router.post('/:sharedLayoutId/reject', sharedLayoutController.rejectShareInvitation);
router.delete('/:sharedLayoutId/user/:userIdToRemove', sharedLayoutController.removeSharedUser);

module.exports = router;
