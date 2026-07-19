const stationService  = require('../services/station.service');
const asyncHandler    = require('../utils/asyncHandler');
const ApiResponse     = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const getStations = asyncHandler(async (req, res) => {
  const data = stationService.getAllStations();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getStationById = asyncHandler(async (req, res) => {
  const data = stationService.getStationById(req.params.stationId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

module.exports = { getStations, getStationById };
