const mongoose = require('mongoose');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const Device = require('../models/Device');
const SecurityEvent = require('../models/SecurityEvent');
const User = require('../models/User');

const analyticsService = {
  trackEvent: async (userId, eventType, details, deviceId = null, riskScore = null) => {
    const securityEvent = new SecurityEvent({
      userId,
      deviceId,
      eventType,
      riskScore,
      details
    });

    await securityEvent.save();

    // Ενημέρωση των στατιστικών του χρήστη
    await User.findByIdAndUpdate(userId, {
      $inc: { [`eventCounts.${eventType}`]: 1 }
    });

    if (deviceId) {
      // Ενημέρωση του ιστορικού δραστηριότητας της συσκευής
      await Device.findByIdAndUpdate(deviceId, {
        $push: {
          activityLogs: {
            action: eventType,
            timestamp: new Date(),
            details
          }
        }
      });
    }
  },

  getUserBehaviorAnalysis: async (userId) => {
    const user = await User.findById(userId);
    const devices = await Device.find({ userId });
    const securityEvents = await SecurityEvent.find({ userId }).sort('-createdAt').limit(100);

    // Ανάλυση μοτίβων χρήσης
    const usagePatterns = analyzeUsagePatterns(devices, securityEvents);

    // Ανάλυση μοτίβων κινδύνου
    const riskPatterns = analyzeRiskPatterns(securityEvents);

    // Ανίχνευση ανωμαλιών
    const anomalies = detectAnomalies(user, devices, securityEvents);

    return {
      usagePatterns,
      riskPatterns,
      anomalies
    };
  },

  getSecurityOverview: async (userId) => {
    const recentEvents = await SecurityEvent.find({ userId })
      .sort('-createdAt')
      .limit(10);

    const riskScoreTrend = await calculateRiskScoreTrend(userId);

    const deviceActivity = await Device.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: '$_id',
        lastActivity: { $max: '$lastActivity' },
        activityCount: { $sum: { $size: '$activityLogs' } }
      }}
    ]);

    return {
      recentEvents,
      riskScoreTrend,
      deviceActivity
    };
  }
};

// Βοηθητικές συναρτήσεις για την ανάλυση δεδομένων
function analyzeUsagePatterns(devices, securityEvents) {
  // Υλοποίηση ανάλυσης μοτίβων χρήσης
}

function analyzeRiskPatterns(securityEvents) {
  // Υλοποίηση ανάλυσης μοτίβων κινδύνου
}

function detectAnomalies(user, devices, securityEvents) {
  // Υλοποίηση ανίχνευσης ανωμαλιών
}

async function calculateRiskScoreTrend(userId) {
  // Υλοποίηση υπολογισμού τάσης βαθμολογίας κινδύνου
}

module.exports = analyticsService;
