const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  // Προσθέστε άλλες επιλογές σύνδεσης αν χρειάζεται
});

const createRateLimiter = (windowMs, max) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: max,
    duration: windowMs / 1000, // convert ms to seconds
  });

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) =>
      rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => res.status(options.statusCode).send(options.message)),
  });
};

const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);
const loginLimiter = createRateLimiter(60 * 60 * 1000, 5);

module.exports = {
  apiLimiter,
  loginLimiter
};
