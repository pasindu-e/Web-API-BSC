const provinceRepository = require('../repositories/province.repository');
const ApiError           = require('../utils/ApiError');
const { HTTP_STATUS }    = require('../utils/constants');

const getAllProvinces = () => provinceRepository.findAll();

const getProvinceById = (id) => {
  const province = provinceRepository.findById(Number(id));
  if (!province) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Province not found');
  return province;
};

module.exports = { getAllProvinces, getProvinceById };
