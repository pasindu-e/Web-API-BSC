const provinceService = require('../services/province.service');
const asyncHandler    = require('../utils/asyncHandler');
const ApiResponse     = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../utils/constants');

const getProvinces = asyncHandler(async (req, res) => {
  const data = provinceService.getAllProvinces();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

const getProvinceById = asyncHandler(async (req, res) => {
  const data = provinceService.getProvinceById(req.params.provinceId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data));
});

module.exports = { getProvinces, getProvinceById };
