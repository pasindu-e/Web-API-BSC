const pingService     = require('../services/ping.service');
const asyncHandler    = require('../utils/asyncHandler');
const ApiResponse     = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');
const { API_PREFIX }  = require('../config/env');

const getPings = asyncHandler(async (req, res) => {
  const data = pingService.getAllPings();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getPingById = asyncHandler(async (req, res) => {
  const data = pingService.getPingById(req.params.pingId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const createPing = asyncHandler(async (req, res) => {
  const newPing = pingService.createPing(req.params.vehicleId, req.body);
  res
    .status(HTTP_STATUS.CREATED)
    .setHeader('Location', `${API_PREFIX}/pings/${newPing.id}`)
    .json(new ApiResponse(HTTP_STATUS.CREATED, newPing, 'Ping created'));
});

module.exports = { getPings, getPingById, createPing };
