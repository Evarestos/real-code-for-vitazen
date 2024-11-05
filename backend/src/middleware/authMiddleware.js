const authService = require('../services/authService');

module.exports = function(req, res, next) {
  // Παίρνουμε το token από το header
  const token = req.header('x-auth-token');

  // Ελέγχουμε αν δεν υπάρχει token
  if (!token) {
    return res.status(401).json({ error: 'Δεν παρέχεται token, η πρόσβαση απορρίφθηκε' });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Μη έγκυρο token' });
  }
};
