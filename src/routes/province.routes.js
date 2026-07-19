const { Router }                        = require('express');
const { getProvinces, getProvinceById } = require('../controllers/province.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: Sri Lanka province endpoints
 */

/**
 * @swagger
 * /v1/api/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: List of all 9 provinces
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
 *                         $ref: '#/components/schemas/Province'
 */
router.get('/', getProvinces);

/**
 * @swagger
 * /v1/api/provinces/{provinceId}:
 *   get:
 *     summary: Get a province by ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Province ID (1–9)
 *         example: 1
 *     responses:
 *       200:
 *         description: Province found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Province'
 *       404:
 *         description: Province not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:provinceId', getProvinceById);

module.exports = router;
