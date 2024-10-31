const Device = require('../models/Device');
const User = require('../models/User');

const LOCATION_CHANGE_THRESHOLD = 100; // σε χιλιόμετρα
const UNUSUAL_ACTIVITY_THRESHOLD = 5;
const FAILED_ATTEMPTS_THRESHOLD = 3;

const riskAssessmentService = {
  assessRisk: async (userId, deviceInfo) => {
    const user = await User.findById(userId);
    const existingDevice = await Device.findOne({ userId, deviceId: deviceInfo.deviceId });

    let riskScore = 0;
    const riskFactors = [];

    // Έλεγχος αλλαγής τοποθεσίας
    if (existingDevice && this.calculateDistance(existingDevice.lastLocation, deviceInfo.location) > LOCATION_CHANGE_THRESHOLD) {
      riskScore += 0.3;
      riskFactors.push('Unusual location change');
    }

    // Έλεγχος αλλαγών στο device fingerprint
    if (existingDevice && this.compareFingerprints(existingDevice.fingerprint, deviceInfo)) {
      riskScore += 0.2;
      riskFactors.push('Device fingerprint changed');
    }

    // Έλεγχος ασυνήθιστης δραστηριότητας
    if (user.recentActivityCount > UNUSUAL_ACTIVITY_THRESHOLD) {
      riskScore += 0.2;
      riskFactors.push('Unusual activity pattern');
    }

    // Έλεγχος αποτυχημένων προσπαθειών
    if (user.failedLoginAttempts > FAILED_ATTEMPTS_THRESHOLD) {
      riskScore += 0.3;
      riskFactors.push('Multiple failed login attempts');
    }

    return { score: riskScore, factors: riskFactors };
  },

  calculateDistance: (loc1, loc2) => {
    // Υλοποίηση υπολογισμού απόστασης μεταξύ δύο σημείων
    // (Απλοποιημένη έκδοση - στην πραγματικότητα θα χρησιμοποιούσαμε πιο ακριβή μέθοδο)
    const R = 6371; // Ακτίνα της Γης σε χιλιόμετρα
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lon - loc1.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  compareFingerprints: (fp1, fp2) => {
    // Σύγκριση των βασικών στοιχείων του fingerprint
    return fp1.userAgent !== fp2.userAgent ||
           fp1.language !== fp2.language ||
           fp1.screenResolution !== fp2.screenResolution ||
           fp1.timezone !== fp2.timezone;
  }
};

module.exports = riskAssessmentService;
