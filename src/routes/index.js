const { Router }     = require('express');
const authRoutes     = require('./auth.route');
const provinceRoutes = require('./province.routes');
const districtRoutes = require('./district.routes');
const stationRoutes  = require('./station.routes');
const vehicleRoutes  = require('./vehicle.routes');
const pingRoutes     = require('./ping.routes');

const router = Router();

router.use('/auth',      authRoutes);
router.use('/provinces', provinceRoutes);
router.use('/districts', districtRoutes);
router.use('/stations',  stationRoutes);
router.use('/vehicles',  vehicleRoutes);
router.use('/pings',     pingRoutes);

module.exports = router;
