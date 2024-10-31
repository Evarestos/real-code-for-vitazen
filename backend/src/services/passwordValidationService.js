const bcrypt = require('bcryptjs');
const User = require('../models/User');

class PasswordValidationService {
  static async validatePassword(password, userId = null) {
    const errors = [];

    // Έλεγχος μήκους
    if (password.length < 8) {
      errors.push('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες');
    }

    // Έλεγχος για κεφαλαίο γράμμα
    if (!/[A-Z]/.test(password)) {
      errors.push('Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα κεφαλαίο γράμμα');
    }

    // Έλεγχος για αριθμό
    if (!/\d/.test(password)) {
      errors.push('Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν αριθμό');
    }

    // Έλεγχος για ειδικό χαρακτήρα
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Ο κωδικός πρέπει να περιέχει τουλάχιστον έναν ειδικό χαρακτήρα');
    }

    // Έλεγχος έναντι λίστας συχνών passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin']; // Επεκτείνετε αυτή τη λίστα
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Αυτός ο κωδικός είναι πολύ κοινός. Παρακαλώ επιλέξτε έναν πιο ασφαλή κωδικό');
    }

    // Έλεγχος για επαναχρησιμοποίηση παλιών κωδικών
    if (userId) {
      const user = await User.findById(userId);
      if (user && user.passwordHistory) {
        for (let oldPassword of user.passwordHistory) {
          if (await bcrypt.compare(password, oldPassword)) {
            errors.push('Δεν μπορείτε να επαναχρησιμοποιήσετε έναν από τους τελευταίους 5 κωδικούς σας');
            break;
          }
        }
      }
    }

    return errors;
  }

  static async updatePasswordHistory(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) return;

    if (!user.passwordHistory) {
      user.passwordHistory = [];
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHistory.unshift(hashedPassword);

    // Κρατάμε μόνο τους τελευταίους 5 κωδικούς
    user.passwordHistory = user.passwordHistory.slice(0, 5);

    await user.save();
  }
}

module.exports = PasswordValidationService;
