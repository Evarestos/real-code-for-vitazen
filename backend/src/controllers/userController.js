const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Ο χρήστης υπάρχει ήδη' });
    }
    user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ _id: user._id }, config.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Μη έγκυρα διαπιστευτήρια' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Μη έγκυρα διαπιστευτήρια' });
    }
    req.session.userId = user._id;
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.logout = async (req, res) => {
  // Η λογική για το logout θα υλοποιηθεί στο frontend
  // Εδώ απλά επιστρέφουμε ένα μήνυμα επιτυχίας
  res.json({ message: 'Αποσυνδεθήκατε επιτυχώς' });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Ο τρέχων κωδικός πρόσβασης είναι λανθασμένος' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Ο κωδικός πρόσβασης άλλαξε επιτυχώς' });
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    // Εδώ θα μπορούσαμε επίσης να διαγράψουμε όλα τα προγράμματα του χρήστη
    // await Program.deleteMany({ user: req.user._id });
    res.json({ message: 'Ο λογαριασμός διαγράφηκε επιτυχώς' });
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'Δεν βρέθηκε χρήστης με αυτό το email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      // Ρυθμίσεις για το email service σας
    });

    const mailOptions = {
      to: user.email,
      from: 'noreply@wellnessapp.com',
      subject: 'Επαναφορά Κωδικού Πρόσβασης',
      text: `Παρακαλώ χρησιμοποιήστε τον ακόλουθο σύνδεσμο για να επαναφέρετε τον κωδικό σας: \n\n
        http://${req.headers.host}/reset/${resetToken}\n\n
        Αν δεν ζητήσατε αυτή την επαναφορά, παρακαλώ αγνοήστε αυτό το email.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Ένα email με οδηγίες έχει σταλεί στη διεύθυνσή σας' });
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Το token επαναφοράς κωδικού είναι άκυρο ή έχει λήξει' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Ο κωδικός πρόσβασης άλλαξε επιτυχώς' });
  } catch (error) {
    res.status(500).send('Σφάλμα διακομιστή');
  }
};
