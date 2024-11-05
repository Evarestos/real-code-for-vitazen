const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fingerprint: {
    userAgent: String,
    language: String,
    screenResolution: String,
    timezone: String,
    deviceId: String
  },
  trusted: {
    type: Boolean,
    default: false
  },
  lastActivity: Date,
  locationHistory: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date
  }],
  activityLogs: [{
    action: String,
    timestamp: Date,
    details: mongoose.Schema.Types.Mixed
  }]
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
