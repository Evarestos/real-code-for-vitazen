const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Εφαρμόζουμε το authMiddleware σε όλα τα routes
router.use(authMiddleware);

router.get('/category/:category', contentController.getContentByCategory);
router.get('/search', contentController.searchContent);
router.get('/filter', contentController.filterContent);
router.get('/:id', contentController.getContentDetails);
router.get('/:id/related', contentController.getRelatedContent);

module.exports = router;
