const { Router }                        = require('express');
const { getDistricts, getDistrictById } = require('../controllers/district.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: Sri Lanka district endpoints
 */

/**
 * @swagger
 * /v1/api/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Districts]
 *     responses:
 *       200:
 *         description: List of all 25 districts
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
 *                         $ref: '#/components/schemas/District'
 */
router.get('/', getDistricts);

/**
 * @swagger
 * /v1/api/districts/{districtId}:
 *   get:
 *     summary: Get a district by ID
 *     tags: [Districts]
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: District ID (1–25)
 *         example: 1
 *     responses:
 *       200:
 *         description: District found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/District'
 *       404:
 *         description: District not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:districtId', getDistrictById);

module.exports = router;
