const mongoose        = require('mongoose');
const { MONGODB_URI, MONGODB_DB } = require('./env');
const logger          = require('./logger');

let _db   = null;
let _next = 1;

const connect = async () => {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
  logger.info(`MongoDB connected — database: ${MONGODB_DB}`);

  const raw = await mongoose.connection.db
    .collection('tuk-tuk')
    .findOne({}, { projection: { _id: 0 } });

  if (!raw) throw new Error('Collection "tuk-tuk" is empty or not found');

  _db = {
    provinces: raw.provinces || [],
    districts: raw.districts || [],
    stations:  raw.stations  || [],
    vehicles:  raw.vehicles  || [],
    pings:     raw.pings     || [],
  };

  _next = _db.pings.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  logger.info(
    `Loaded — provinces:${_db.provinces.length}  districts:${_db.districts.length}  ` +
    `stations:${_db.stations.length}  vehicles:${_db.vehicles.length}  pings:${_db.pings.length}`
  );
};

const getDb         = () => _db;
const getNextPingId = () => _next++;

module.exports = { connect, getDb, getNextPingId };
