const validateRegister = ({ username, email, password, role } = {}) => {
  if (!username || typeof username !== 'string' || username.trim().length < 3)
    return 'username must be at least 3 characters';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'a valid email is required';
  if (!password || typeof password !== 'string' || password.length < 6)
    return 'password must be at least 6 characters';
  if (role && !['admin', 'officer'].includes(role))
    return 'role must be admin or officer';
  return null;
};

const validateLogin = ({ email, password } = {}) => {
  if (!email)    return 'email is required';
  if (!password) return 'password is required';
  return null;
};

module.exports = { validateRegister, validateLogin };
