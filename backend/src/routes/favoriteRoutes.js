const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', favoriteController.addFavorite);
router.delete('/:userId/:contentId', favoriteController.removeFavorite);
router.get('/:userId', favoriteController.getFavorites);

module.exports = router;
