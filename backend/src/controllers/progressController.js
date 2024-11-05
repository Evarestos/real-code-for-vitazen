const Progress = require('../models/Progress');

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.json(progress);
  } catch (error) {
    console.error('Error in getProgress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      progress = new Progress({ user: req.user.id });
    }
    
    // Ενημέρωση των πεδίων του progress
    if (req.body.weight) {
      progress.weight.push({ value: req.body.weight });
    }
    if (req.body.bodyMeasurements) {
      progress.bodyMeasurements.push(req.body.bodyMeasurements);
    }
    if (req.body.workout) {
      progress.workouts.push(req.body.workout);
    }
    if (req.body.goals) {
      progress.goals = { ...progress.goals, ...req.body.goals };
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    console.error('Error in updateProgress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
