const { Router }                      = require('express');
const { getStations, getStationById } = require('../controllers/station.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Police station endpoints
 */

/**
 * @swagger
 * /v1/api/stations:
 *   get:
 *     summary: Get all stations
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: List of all 35 police stations
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
 *                         $ref: '#/components/schemas/Station'
 */
router.get('/', getStations);

/**
 * @swagger
 * /v1/api/stations/{stationId}:
 *   get:
 *     summary: Get a station by ID
 *     tags: [Stations]
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Station ID (1–35)
 *         example: 1
 *     responses:
 *       200:
 *         description: Station found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Station'
 *       404:
 *         description: Station not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:stationId', getStationById);

module.exports = router;
