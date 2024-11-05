const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const crypto = require('crypto');

class TokenService {
  static generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  }

  static async generateRefreshToken(userId) {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    await RefreshToken.create({ userId, token: refreshToken });
    return refreshToken;
  }

  static async verifyRefreshToken(refreshToken) {
    const foundToken = await RefreshToken.findOne({ token: refreshToken });
    if (!foundToken) {
      throw new Error('Invalid refresh token');
    }
    return foundToken.userId;
  }

  static async revokeRefreshToken(refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  static async revokeAllRefreshTokens(userId) {
    await RefreshToken.deleteMany({ userId });
  }
}

module.exports = TokenService;
