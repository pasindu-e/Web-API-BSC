const { getDb } = require('../config/db');

const findAll  = ()   => getDb().stations;
const findById = (id) => getDb().stations.find(s => s.id === id) ?? null;

module.exports = { findAll, findById };
