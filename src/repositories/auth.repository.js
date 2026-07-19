const User = require('../models/user.model');

const findByEmail    = (email)    => User.findOne({ email }).select('+password').lean();
const findByUsername = (username) => User.findOne({ username }).lean();
const create         = (data)     => User.create(data);

module.exports = { findByEmail, findByUsername, create };
