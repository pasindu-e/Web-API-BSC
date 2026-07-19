const authService     = require('../services/auth.service');
const asyncHandler    = require('../utils/asyncHandler');
const ApiResponse     = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, data, 'User registered'));
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, 'Login successful'));
});

module.exports = { register, login };
