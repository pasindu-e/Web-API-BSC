require('dotenv').config();

module.exports = {
  PORT:           process.env.PORT           || 5000,
  API_KEY:        process.env.API_KEY        || 'key_v01',
  NODE_ENV:       process.env.NODE_ENV       || 'development',
  API_PREFIX:     '/v1/api',
  MONGODB_URI:    process.env.MONGODB_URI    || 'mongodb://localhost:27017',
  MONGODB_DB:     process.env.MONGODB_DB     || 'web-api-bsc',
  JWT_SECRET:     process.env.JWT_SECRET     || 'change_me_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
