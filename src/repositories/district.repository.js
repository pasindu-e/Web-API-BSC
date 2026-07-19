const { getDb } = require('../config/db');

const findAll  = ()   => getDb().districts;
const findById = (id) => getDb().districts.find(d => d.id === id) ?? null;

module.exports = { findAll, findById };
