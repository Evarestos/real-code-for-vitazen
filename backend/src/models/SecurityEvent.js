const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  },
  eventType: {
    type: String,
    enum: ['LOGIN_ATTEMPT', 'DEVICE_CHANGE', 'LOCATION_CHANGE', 'RISK_EVENT'],
    required: true
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 1
  },
  details: mongoose.Schema.Types.Mixed,
  actionTaken: String
}, { timestamps: true });

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
