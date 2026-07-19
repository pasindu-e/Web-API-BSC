const ApiError        = require('../utils/ApiError');
const { HTTP_STATUS } = require('../utils/constants');
const logger          = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors:  err.errors,
    });
  }

  logger.error(err.stack || err.message);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
    errors:  [],
  });
};

module.exports = { errorMiddleware };
