const districtRepository = require('../repositories/district.repository');
const ApiError           = require('../utils/ApiError');
const { HTTP_STATUS }    = require('../utils/constants');

const getAllDistricts = () => districtRepository.findAll();

const getDistrictById = (id) => {
  const district = districtRepository.findById(Number(id));
  if (!district) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'District not found');
  return district;
};

module.exports = { getAllDistricts, getDistrictById };
