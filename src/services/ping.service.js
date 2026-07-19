const pingRepository    = require('../repositories/ping.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const ApiError          = require('../utils/ApiError');
const { HTTP_STATUS }   = require('../utils/constants');

const getAllPings = () => pingRepository.findAll();

const getPingById = (id) => {
  const ping = pingRepository.findById(Number(id));
  if (!ping) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Ping not found');
  return ping;
};

const createPing = async (vehicleId, { latitude, longitude, timestamp }) => {
  const vehicle = vehicleRepository.findById(Number(vehicleId));
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');

  return await pingRepository.create({ vehicle_id: vehicle.id, latitude, longitude, timestamp });
};

module.exports = { getAllPings, getPingById, createPing };
