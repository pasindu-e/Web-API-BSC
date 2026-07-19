const validateCreatePing = ({ latitude, longitude } = {}) => {
  if (latitude === undefined || longitude === undefined)
    return 'latitude and longitude are required';

  if (typeof latitude !== 'number' || typeof longitude !== 'number')
    return 'latitude and longitude must be numbers';

  if (latitude < -90 || latitude > 90)
    return 'latitude must be between -90 and 90';

  if (longitude < -180 || longitude > 180)
    return 'longitude must be between -180 and 180';

  return null;
};

module.exports = { validateCreatePing };
