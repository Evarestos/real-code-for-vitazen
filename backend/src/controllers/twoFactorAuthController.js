const twoFactorAuthService = require('../services/twoFactorAuthService');
const { rateLimiter } = require('../middleware/rateLimitMiddleware');

exports.setup2FA = async (req, res) => {
  try {
    const { secret, qrCodeDataUrl } = await twoFactorAuthService.generateSecret(req.user.id);
    res.json({ secret, qrCodeDataUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error setting up 2FA', error: error.message });
  }
};

exports.verify2FA = rateLimiter(5, 60, async (req, res) => {
  try {
    const { token } = req.body;
    const isValid = await twoFactorAuthService.verifyToken(req.user.id, token);
    if (isValid) {
      res.json({ message: '2FA verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying 2FA', error: error.message });
  }
});

exports.generateBackupCodes = async (req, res) => {
  try {
    const backupCodes = await twoFactorAuthService.generateBackupCodes(req.user.id);
    res.json({ backupCodes });
  } catch (error) {
    res.status(500).json({ message: 'Error generating backup codes', error: error.message });
  }
};

exports.verifyBackupCode = rateLimiter(3, 60, async (req, res) => {
  try {
    const { code } = req.body;
    const isValid = await twoFactorAuthService.verifyBackupCode(req.user.id, code);
    if (isValid) {
      res.json({ message: 'Backup code verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid backup code' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying backup code', error: error.message });
  }
});

exports.disable2FA = async (req, res) => {
  try {
    await twoFactorAuthService.disable2FA(req.user.id);
    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error disabling 2FA', error: error.message });
  }
};

exports.generateRecoveryToken = async (req, res) => {
  try {
    const recoveryToken = await twoFactorAuthService.generateRecoveryToken(req.user.id);
    res.json({ recoveryToken });
  } catch (error) {
    res.status(500).json({ message: 'Error generating recovery token', error: error.message });
  }
};

exports.verifyRecoveryToken = rateLimiter(3, 60, async (req, res) => {
  try {
    const { token } = req.body;
    const isValid = await twoFactorAuthService.verifyRecoveryToken(req.user.id, token);
    if (isValid) {
      res.json({ message: 'Recovery token verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid recovery token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying recovery token', error: error.message });
  }
});
