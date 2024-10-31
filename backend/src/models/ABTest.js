const mongoose = require('mongoose');

const ABTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  variants: [{
    name: String,
    description: String
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  results: [{
    variant: String,
    impressions: Number,
    conversions: Number
  }]
});

module.exports = mongoose.model('ABTest', ABTestSchema);
