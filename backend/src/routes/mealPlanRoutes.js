const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const auth = require('../middleware/auth');

router.use(auth); // Όλα τα routes απαιτούν εξουσιοδότηση

router.get('/', mealPlanController.getMealPlan);
router.put('/', mealPlanController.updateMealPlan);

module.exports = router;
