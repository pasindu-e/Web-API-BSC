const vehicleService  = require('../services/vehicle.service');
const asyncHandler    = require('../utils/asyncHandler');
const ApiResponse     = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const getVehicles = asyncHandler(async (req, res) => {
  const data = vehicleService.getAllVehicles();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getVehicleById = asyncHandler(async (req, res) => {
  const data = vehicleService.getVehicleById(req.params.vehicleId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getVehiclePings = asyncHandler(async (req, res) => {
  const data = vehicleService.getVehiclePings(req.params.vehicleId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getVehicleLastPosition = asyncHandler(async (req, res) => {
  const data = vehicleService.getVehicleLastPosition(req.params.vehicleId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

module.exports = { getVehicles, getVehicleById, getVehiclePings, getVehicleLastPosition };
