const { Router }                = require('express');
const { getPings, getPingById } = require('../controllers/ping.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pings
 *   description: GPS ping endpoints
 */

/**
 * @swagger
 * /v1/api/pings:
 *   get:
 *     summary: Get all pings
 *     tags: [Pings]
 *     responses:
 *       200:
 *         description: List of all GPS pings (9240 in seed data)
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
 */
router.get('/', getPings);

/**
 * @swagger
 * /v1/api/pings/{pingId}:
 *   get:
 *     summary: Get a ping by ID
 *     tags: [Pings]
 *     parameters:
 *       - in: path
 *         name: pingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ping ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Ping found
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
 *         description: Ping not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:pingId', getPingById);

module.exports = router;
