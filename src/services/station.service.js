const stationRepository = require('../repositories/station.repository');
const ApiError          = require('../utils/ApiError');
const { HTTP_STATUS }   = require('../utils/constants');

const getAllStations = () => stationRepository.findAll();

const getStationById = (id) => {
  const station = stationRepository.findById(Number(id));
  if (!station) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Station not found');
  return station;
};

module.exports = { getAllStations, getStationById };
