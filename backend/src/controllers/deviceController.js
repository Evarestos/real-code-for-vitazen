const Device = require('../models/Device');
const User = require('../models/User');
const riskAssessmentService = require('../services/riskAssessmentService');
const analyticsService = require('../services/analyticsService');

exports.getTrustedDevices = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.params.userId, trusted: true });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trusted devices', error: error.message });
  }
};

exports.trustDevice = async (req, res) => {
  try {
    const newDevice = new Device({
      userId: req.params.userId,
      ...req.body,
      trusted: true
    });
    await newDevice.save();

    await analyticsService.trackEvent(req.params.userId, 'DEVICE_CHANGE', {
      action: 'TRUST_DEVICE',
      deviceId: newDevice._id
    });

    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error trusting device', error: error.message });
  }
};

exports.removeTrustedDevice = async (req, res) => {
  try {
    await Device.findOneAndDelete({ userId: req.params.userId, _id: req.params.deviceId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error removing trusted device', error: error.message });
  }
};

exports.assessRisk = async (req, res) => {
  try {
    const riskAssessment = await riskAssessmentService.assessRisk(req.params.userId, req.body);

    await analyticsService.trackEvent(req.params.userId, 'RISK_EVENT', {
      riskScore: riskAssessment.score,
      factors: riskAssessment.factors
    }, req.body.deviceId, riskAssessment.score);

    res.json(riskAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Error assessing risk', error: error.message });
  }
};

exports.updateDeviceActivity = async (req, res) => {
  try {
    const device = await Device.findOne({ userId: req.params.userId, _id: req.params.deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    device.lastActivity = new Date();
    device.activityHistory.push(req.body);
    await device.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: 'Error updating device activity', error: error.message });
  }
};

exports.getDeviceHistory = async (req, res) => {
  try {
    const device = await Device.findOne({ userId: req.params.userId, _id: req.params.deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device.activityHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device history', error: error.message });
  }
};

// Νέο endpoint για την ανάκτηση αναλυτικών στοιχείων ασφαλείας
exports.getSecurityAnalytics = async (req, res) => {
  try {
    const securityOverview = await analyticsService.getSecurityOverview(req.params.userId);
    const behaviorAnalysis = await analyticsService.getUserBehaviorAnalysis(req.params.userId);

    res.json({
      securityOverview,
      behaviorAnalysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching security analytics', error: error.message });
  }
};
