const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.use(auth); // Όλα τα routes απαιτούν εξουσιοδότηση

router.get('/', progressController.getProgress);
router.put('/', progressController.updateProgress);

module.exports = router;
