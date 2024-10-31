const express = require('express');
const router = express.Router();
const twoFactorAuthController = require('../controllers/twoFactorAuthController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/setup', twoFactorAuthController.setup2FA);
router.post('/verify', twoFactorAuthController.verify2FA);
router.post('/backup-codes', twoFactorAuthController.generateBackupCodes);
router.post('/verify-backup', twoFactorAuthController.verifyBackupCode);
router.post('/disable', twoFactorAuthController.disable2FA);
router.post('/recovery-token', twoFactorAuthController.generateRecoveryToken);
router.post('/verify-recovery', twoFactorAuthController.verifyRecoveryToken);

module.exports = router;
