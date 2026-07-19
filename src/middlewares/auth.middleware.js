const ApiError        = require('../utils/ApiError');
const { API_KEY }     = require('../config/env');
const { HTTP_STATUS } = require('../utils/constants');

const requireApiKey = (req, res, next) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: invalid or missing API key'));
  }
  next();
};

module.exports = { requireApiKey };
