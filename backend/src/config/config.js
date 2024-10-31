require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-app-dev',
    JWT_SECRET: process.env.JWT_SECRET,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  },
  test: {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-app-test',
    JWT_SECRET: process.env.JWT_SECRET,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  },
  production: {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  }
};

module.exports = config[env];
