const bcrypt              = require('bcryptjs');
const jwt                 = require('jsonwebtoken');
const authRepository      = require('../repositories/auth.repository');
const ApiError            = require('../utils/ApiError');
const { HTTP_STATUS }     = require('../utils/constants');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const register = async ({ username, email, password, role }) => {
  const [existingEmail, existingUsername] = await Promise.all([
    authRepository.findByEmail(email),
    authRepository.findByUsername(username),
  ]);

  if (existingEmail)    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email already in use');
  if (existingUsername) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Username already taken');

  const hashed = await bcrypt.hash(password, 10);
  const user   = await authRepository.create({ username, email, password: hashed, role });

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
  };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: { id: user._id, username: user.username, email: user.email, role: user.role },
  };
};

module.exports = { register, login };
