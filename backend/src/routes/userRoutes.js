const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

const validateUser = [
  body('username').notEmpty().withMessage('Το όνομα χρήστη είναι υποχρεωτικό'),
  body('email').isEmail().withMessage('Παρακαλώ εισάγετε ένα έγκυρο email'),
  body('password').isLength({ min: 6 }).withMessage('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/register', validateUser, userController.register);
router.post('/login', userController.login);
router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, userController.updateProfile);
router.post('/logout', auth, userController.logout);
router.post('/change-password', auth, userController.changePassword);
router.delete('/delete-account', auth, userController.deleteAccount);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
