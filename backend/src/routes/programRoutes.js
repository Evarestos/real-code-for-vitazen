const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Mock data for development
    const programs = [
      {
        id: '1',
        name: 'Πρόγραμμα 1',
        description: 'Περιγραφή προγράμματος 1',
        content: 'Περιεχόμενο προγράμματος 1'
      },
      {
        id: '2',
        name: 'Πρόγραμμα 2',
        description: 'Περιγραφή προγράμματος 2',
        content: 'Περιεχόμενο προγράμματος 2'
      }
    ];
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
