const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 λεπτά
  max: 100 // περιορισμός κάθε IP σε 100 αιτήματα ανά παράθυρο
});

const algorithm = 'aes-256-cbc';
let key;

try {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }
  key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }
} catch (error) {
  console.error('Error initializing encryption key:', error.message);
  process.exit(1);
}

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

const decrypt = (text) => {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(text.iv, 'hex'));
  let decrypted = decipher.update(text.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const securityMiddleware = [
  helmet(), // Προσθήκη διάφορων HTTP headers για ασφάλεια
  limiter,
  (req, res, next) => {
    // Έλεγχος για CSRF token
    if (req.method !== 'GET' && (!req.headers['x-csrf-token'] || req.headers['x-csrf-token'] !== req.session.csrfToken)) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    // Encrypt outgoing data
    const originalJson = res.json;
    res.json = function (body) {
      if (body && typeof body === 'object') {
        body = encrypt(JSON.stringify(body));
      }
      return originalJson.call(this, body);
    };

    // Decrypt incoming data
    if (req.body && req.body.iv && req.body.encryptedData) {
      try {
        const decryptedData = decrypt(req.body);
        req.body = JSON.parse(decryptedData);
      } catch (error) {
        console.error('Error decrypting data:', error);
        return res.status(400).json({ error: 'Invalid encrypted data' });
      }
    }

    next();
  }
];

module.exports = securityMiddleware;
