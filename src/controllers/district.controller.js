const districtService = require('../services/district.service');
const asyncHandler    = require('../utils/asyncHandler');
const ApiResponse     = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const getDistricts = asyncHandler(async (req, res) => {
  const data = districtService.getAllDistricts();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getDistrictById = asyncHandler(async (req, res) => {
  const data = districtService.getDistrictById(req.params.districtId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

module.exports = { getDistricts, getDistrictById };
