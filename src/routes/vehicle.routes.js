const { Router }             = require('express');
const {
  getVehicles,
  getVehicleById,
  getVehiclePings,
  getVehicleLastPosition,
}                            = require('../controllers/vehicle.controller');
const { createPing }         = require('../controllers/ping.controller');
const { requireApiKey }      = require('../middlewares/auth.middleware');
const { validate }           = require('../middlewares/validation.middleware');
const { validateCreatePing } = require('../validators/ping.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Tuk-tuk vehicle and ping endpoints
 */

/**
 * @swagger
 * /v1/api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of all 220 registered vehicles
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vehicle'
 */
router.get('/', getVehicles);

/**
 * @swagger
 * /v1/api/vehicles/{vehicleId}:
 *   get:
 *     summary: Get a vehicle by ID
 *     description: Returns the vehicle with an additional `last_ping` field containing its most recent GPS ping.
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID (1–220)
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehicle found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/VehicleWithLastPing'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:vehicleId', getVehicleById);

/**
 * @swagger
 * /v1/api/vehicles/{vehicleId}/pings:
 *   get:
 *     summary: Get all pings for a vehicle
 *     description: Returns all 42 GPS pings recorded for the vehicle (7 days × 6 pings/day in seed data).
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Pings for the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ping'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:vehicleId/pings', getVehiclePings);

/**
 * @swagger
 * /v1/api/vehicles/{vehicleId}/last-position:
 *   get:
 *     summary: Get the most recent ping for a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Most recent GPS ping for the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ping'
 *       404:
 *         description: Vehicle not found or has no pings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:vehicleId/last-position', getVehicleLastPosition);

/**
 * @swagger
 * /v1/api/vehicles/{vehicleId}/pings:
 *   post:
 *     summary: Create a new ping for a vehicle
 *     description: Records a new GPS position for the vehicle. Returns `201 Created` with a `Location` header pointing to the new ping.
 *     tags: [Vehicles]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vehicle ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePingBody'
 *           example:
 *             latitude: 6.9271
 *             longitude: 79.8612
 *     responses:
 *       201:
 *         description: Ping created successfully
 *         headers:
 *           Location:
 *             description: URL of the created ping
 *             schema:
 *               type: string
 *               example: /v1/api/pings/9241
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ping'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Missing or invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/:vehicleId/pings', requireApiKey, validate(validateCreatePing), createPing);

module.exports = router;
