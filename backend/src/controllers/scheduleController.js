const Schedule = require('../models/Schedule');

exports.getWeeklySchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ user: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule.weeklySchedule);
  } catch (error) {
    console.error('Error in getWeeklySchedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWeeklySchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findOne({ user: req.user.id });
    if (!schedule) {
      schedule = new Schedule({ user: req.user.id, weeklySchedule: [] });
    }
    schedule.weeklySchedule = req.body.weeklySchedule;
    await schedule.save();
    res.json(schedule.weeklySchedule);
  } catch (error) {
    console.error('Error in updateWeeklySchedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
