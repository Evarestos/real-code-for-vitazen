const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  notifications: {
    toast: {
      enabled: { type: Boolean, default: true },
      duration: { type: Number, default: 5000 }
    },
    email: {
      enabled: { type: Boolean, default: true },
      frequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'immediate' }
    },
    sound: {
      enabled: { type: Boolean, default: true },
      volume: { type: Number, min: 0, max: 100, default: 50 }
    }
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: '22:00' },
    end: { type: String, default: '07:00' }
  },
  categoryPreferences: {
    type: Map,
    of: {
      enabled: Boolean,
      priority: { type: Number, min: 1, max: 5, default: 3 }
    },
    default: {
      'system': { enabled: true, priority: 5 },
      'chat': { enabled: true, priority: 4 },
      'program': { enabled: true, priority: 3 },
      'progress': { enabled: true, priority: 3 }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
