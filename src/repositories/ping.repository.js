const mongoose              = require('mongoose');
const { getDb, getNextPingId } = require('../config/db');

const findAll         = ()          => getDb().pings;
const findById        = (id)        => getDb().pings.find(p => p.id === id) ?? null;
const findByVehicleId = (vehicleId) => getDb().pings.filter(p => p.vehicle_id === vehicleId);

const create = async ({ vehicle_id, latitude, longitude, timestamp }) => {
  const newPing = {
    id:         getNextPingId(),
    vehicle_id,
    latitude,
    longitude,
    timestamp:  timestamp ?? new Date().toISOString(),
  };

  getDb().pings.push(newPing);

  await mongoose.connection.db
    .collection('tuk-tuk')
    .updateOne({}, { $push: { pings: newPing } });

  return newPing;
};

module.exports = { findAll, findById, findByVehicleId, create };
