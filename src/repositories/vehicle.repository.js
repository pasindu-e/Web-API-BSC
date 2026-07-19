const { getDb } = require('../config/db');

const findAll  = ()   => getDb().vehicles;
const findById = (id) => getDb().vehicles.find(v => v.id === id) ?? null;

module.exports = { findAll, findById };
