const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const passwordValidationService = require('../services/passwordValidationService');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Επικύρωση κωδικού
    const passwordErrors = await passwordValidationService.validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ errors: passwordErrors });
    }

    const { accessToken, refreshToken } = await authService.registerUser(username, email, password);
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Σφάλμα κατά την εγγραφή:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.loginUser(email, password);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Σφάλμα κατά τη σύνδεση:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await tokenService.revokeRefreshToken(refreshToken);
    res.json({ message: 'Αποσύνδεση επιτυχής' });
  } catch (error) {
    console.error('Σφάλμα κατά την αποσύνδεση:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    const userId = req.user.id; // Υποθέτουμε ότι το middleware αυθεντικοποίησης έχει προσθέσει το user στο request
    await tokenService.revokeAllRefreshTokens(userId);
    res.json({ message: 'Αποσύνδεση από όλες τις συσκευές επιτυχής' });
  } catch (error) {
    console.error('Σφάλμα κατά την αποσύνδεση από όλες τις συσκευές:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = await tokenService.verifyRefreshToken(refreshToken);
    const newAccessToken = tokenService.generateAccessToken(userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Σφάλμα κατά την ανανέωση του token:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};
