const { getDb } = require('../config/db');

const findAll  = ()    => getDb().provinces;
const findById = (id)  => getDb().provinces.find(p => p.id === id) ?? null;

module.exports = { findAll, findById };
