const vehicleRepository = require('../repositories/vehicle.repository');
const pingRepository    = require('../repositories/ping.repository');
const ApiError          = require('../utils/ApiError');
const { HTTP_STATUS }   = require('../utils/constants');

const getAllVehicles = () => vehicleRepository.findAll();

const getVehicleById = (id) => {
  const vehicle = vehicleRepository.findById(Number(id));
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');

  const vehiclePings = pingRepository.findByVehicleId(vehicle.id);
  const last_ping = vehiclePings.length
    ? vehiclePings.reduce((latest, p) => (p.timestamp > latest.timestamp ? p : latest))
    : null;

  return { ...vehicle, last_ping };
};

const getVehiclePings = (id) => {
  const vehicle = vehicleRepository.findById(Number(id));
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  return pingRepository.findByVehicleId(vehicle.id);
};

const getVehicleLastPosition = (id) => {
  const vehicle = vehicleRepository.findById(Number(id));
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');

  const vehiclePings = pingRepository.findByVehicleId(vehicle.id);
  if (!vehiclePings.length)
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No pings found for vehicle');

  return vehiclePings.reduce((latest, p) =>
    (p.timestamp > latest.timestamp ? p : latest));
};

module.exports = { getAllVehicles, getVehicleById, getVehiclePings, getVehicleLastPosition };
