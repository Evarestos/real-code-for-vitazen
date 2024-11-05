const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  async registerUser(username, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Ο χρήστης υπάρχει ήδη');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    return this.generateToken(user);
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Λάθος στοιχεία σύνδεσης');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Λάθος στοιχεία σύνδεσης');
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = {
      user: {
        id: user.id
      }
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.user;
    } catch (error) {
      throw new Error('Μη έγκυρο token');
    }
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('Ο χρήστης δεν βρέθηκε');
    }
    return user;
  }
}

module.exports = new AuthService();

// Οι παρακάτω συναρτήσεις μπορούν να μεταφερθούν σε ένα ξεχωριστό αρχείο αν χρειάζεται
// π.χ. frontendAuthService.js
const api = require('../utils/api');

exports.login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

exports.register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

exports.logout = async () => {
  localStorage.removeItem('token');
};

exports.checkAuthStatus = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};
