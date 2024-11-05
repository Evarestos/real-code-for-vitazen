const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const TwoFactorAuth = require('../models/TwoFactorAuth');
const User = require('../models/User');
const { generateRandomString } = require('../utils/securityUtils');

class TwoFactorAuthService {
  async generateSecret(userId) {
    const secret = speakeasy.generateSecret({ length: 32 });
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: encodeURIComponent(user.email),
      issuer: 'AI Wellness App'
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    await TwoFactorAuth.findOneAndUpdate(
      { userId },
      { secret: secret.base32, isEnabled: false },
      { upsert: true, new: true }
    );

    return { secret: secret.base32, qrCodeDataUrl };
  }

  async verifyToken(userId, token) {
    const twoFactorAuth = await TwoFactorAuth.findOne({ userId });
    
    if (!twoFactorAuth) {
      throw new Error('2FA not set up for this user');
    }

    const isValid = speakeasy.totp.verify({
      secret: twoFactorAuth.secret,
      encoding: 'base32',
      token: token,
      window: 1 // Allows for 1 step before and after the current time
    });

    if (isValid) {
      twoFactorAuth.isEnabled = true;
      twoFactorAuth.lastUsed = new Date();
      await twoFactorAuth.save();
    }

    return isValid;
  }

  async generateBackupCodes(userId) {
    const backupCodes = Array.from({ length: 10 }, () => ({
      code: generateRandomString(10),
      isUsed: false
    }));

    await TwoFactorAuth.findOneAndUpdate(
      { userId },
      { backupCodes },
      { new: true }
    );

    return backupCodes.map(code => code.code);
  }

  async verifyBackupCode(userId, code) {
    const twoFactorAuth = await TwoFactorAuth.findOne({ userId });
    
    if (!twoFactorAuth) {
      throw new Error('2FA not set up for this user');
    }

    const backupCode = twoFactorAuth.backupCodes.find(bc => bc.code === code && !bc.isUsed);

    if (backupCode) {
      backupCode.isUsed = true;
      await twoFactorAuth.save();
      return true;
    }

    return false;
  }

  async disable2FA(userId) {
    await TwoFactorAuth.findOneAndUpdate(
      { userId },
      { isEnabled: false, secret: null, backupCodes: [] }
    );
  }

  async generateRecoveryToken(userId) {
    const recoveryToken = generateRandomString(20);
    await TwoFactorAuth.findOneAndUpdate(
      { userId },
      { recoveryToken }
    );
    return recoveryToken;
  }

  async verifyRecoveryToken(userId, token) {
    const twoFactorAuth = await TwoFactorAuth.findOne({ userId });
    
    if (!twoFactorAuth || twoFactorAuth.recoveryToken !== token) {
      return false;
    }

    twoFactorAuth.recoveryToken = null;
    await twoFactorAuth.save();
    return true;
  }
}

module.exports = new TwoFactorAuthService();
