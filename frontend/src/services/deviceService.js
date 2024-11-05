import api from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

const RISK_THRESHOLD = 0.7; // Ορίζουμε ένα όριο κινδύνου

const deviceService = {
  generateDeviceFingerprint: () => {
    // Απλοποιημένη υλοποίηση device fingerprinting
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      deviceId: localStorage.getItem('deviceId') || uuidv4()
    };
    localStorage.setItem('deviceId', fingerprint.deviceId);
    return fingerprint;
  },

  getTrustedDevices: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/devices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trusted devices:', error);
      throw error;
    }
  },

  trustDevice: async (userId, deviceInfo) => {
    try {
      const fingerprint = deviceService.generateDeviceFingerprint();
      const device = { ...deviceInfo, ...fingerprint };
      const response = await api.post(`/users/${userId}/devices`, device);
      return response.data;
    } catch (error) {
      console.error('Error trusting device:', error);
      throw error;
    }
  },

  removeTrustedDevice: async (userId, deviceId) => {
    try {
      await api.delete(`/users/${userId}/devices/${deviceId}`);
    } catch (error) {
      console.error('Error removing trusted device:', error);
      throw error;
    }
  },

  assessRisk: async (userId, deviceInfo) => {
    try {
      const fingerprint = deviceService.generateDeviceFingerprint();
      const assessmentData = { ...deviceInfo, ...fingerprint };
      const response = await api.post(`/users/${userId}/risk-assessment`, assessmentData);
      return response.data;
    } catch (error) {
      console.error('Error assessing risk:', error);
      throw error;
    }
  },

  handleRiskAssessment: async (userId, deviceInfo) => {
    const riskAssessment = await deviceService.assessRisk(userId, deviceInfo);
    if (riskAssessment.score > RISK_THRESHOLD) {
      // Υψηλός κίνδυνος - απαιτείται επιπλέον επαλήθευση
      return { requiresAdditionalVerification: true, riskFactors: riskAssessment.factors };
    }
    return { requiresAdditionalVerification: false };
  },

  updateDeviceActivity: async (userId, deviceId, activityData) => {
    try {
      await api.post(`/users/${userId}/devices/${deviceId}/activity`, activityData);
    } catch (error) {
      console.error('Error updating device activity:', error);
      throw error;
    }
  },

  getDeviceHistory: async (userId, deviceId) => {
    try {
      const response = await api.get(`/users/${userId}/devices/${deviceId}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching device history:', error);
      throw error;
    }
  }
};

export default deviceService;
