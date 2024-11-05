const { performance } = require('perf_hooks');

const measurePerformance = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const end = performance.now();
    const duration = end - start;
    console.log(`Request to ${req.originalUrl} took ${duration.toFixed(2)}ms`);
  });

  next();
};

module.exports = measurePerformance;
