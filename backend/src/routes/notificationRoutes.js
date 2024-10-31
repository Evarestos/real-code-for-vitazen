const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.get('/unread-count', notificationController.getUnreadCount);

module.exports = router;
