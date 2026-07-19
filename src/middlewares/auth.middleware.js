const jwt             = require('jsonwebtoken');
const ApiError        = require('../utils/ApiError');
const { JWT_SECRET }  = require('../config/env');
const { HTTP_STATUS } = require('../utils/constants');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: missing or invalid token'));
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Unauthorized: invalid or expired token'));
  }
};

module.exports = { requireAuth };
