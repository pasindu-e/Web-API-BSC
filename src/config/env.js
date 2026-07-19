require('dotenv').config();

module.exports = {
  PORT:         process.env.PORT         || 5000,
  API_KEY:      process.env.API_KEY      || 'key_v01',
  NODE_ENV:     process.env.NODE_ENV     || 'development',
  API_PREFIX:   '/v1/api',
  MONGODB_URI:  process.env.MONGODB_URI  || 'mongodb://localhost:27017',
  MONGODB_DB:   process.env.MONGODB_DB   || 'web-api-bsc',
};
