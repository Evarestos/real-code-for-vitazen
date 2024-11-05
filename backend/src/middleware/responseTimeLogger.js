const responseTime = require('response-time');
const logger = require('../utils/logger');

const responseTimeLogger = responseTime((req, res, time) => {
  if (time > 1000) { // Καταγραφή αιχμών πάνω από 1 δευτερόλεπτο
    logger.warn(`Υψηλός χρόνος απόκρισης: ${time}ms για ${req.method} ${req.url}`);
  }
  logger.info(`${req.method} ${req.url} ${res.statusCode} ${time}ms`);
});

module.exports = responseTimeLogger;
