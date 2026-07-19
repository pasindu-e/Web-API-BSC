const ApiError        = require('../utils/ApiError');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Middleware factory that wraps a pure validator function.
 * @param {(body: Object) => string | null} validatorFn
 */
const validate = (validatorFn) => (req, res, next) => {
  const errorMessage = validatorFn(req.body);
  if (errorMessage) {
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, errorMessage));
  }
  next();
};

module.exports = { validate };
