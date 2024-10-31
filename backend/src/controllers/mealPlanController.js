const MealPlan = require('../models/MealPlan');

exports.getMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({ user: req.user.id });
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json(mealPlan.plan);
  } catch (error) {
    console.error('Error in getMealPlan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    let mealPlan = await MealPlan.findOne({ user: req.user.id });
    if (!mealPlan) {
      mealPlan = new MealPlan({ user: req.user.id, plan: {} });
    }
    mealPlan.plan = req.body.plan;
    await mealPlan.save();
    res.json(mealPlan.plan);
  } catch (error) {
    console.error('Error in updateMealPlan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
