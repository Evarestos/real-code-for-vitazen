const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:userId', auth, async (req, res) => {
  try {
    // Mock data for development
    const schedule = {
      monday: ['Τρέξιμο', 'Yoga'],
      tuesday: ['Κολύμβηση'],
      wednesday: ['Γυμναστήριο'],
      thursday: ['Ποδήλατο'],
      friday: ['Περπάτημα'],
      saturday: ['Χαλάρωση'],
      sunday: ['Διάλειμμα']
    };
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
