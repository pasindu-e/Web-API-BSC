const { Router }                       = require('express');
const { register, login }              = require('../controllers/auth.controller');
const { validate }                     = require('../middlewares/validation.middleware');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication — register and obtain a JWT
 */

/**
 * @swagger
 * /v1/api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *           example:
 *             username: officer_silva
 *             email: silva@police.lk
 *             password: secret123
 *             role: officer
 *     responses:
 *       201:
 *         description: User registered — JWT returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or duplicate email/username
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/register', validate(validateRegister), register);

/**
 * @swagger
 * /v1/api/auth/login:
 *   post:
 *     summary: Login and receive a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *           example:
 *             email: silva@police.lk
 *             password: secret123
 *     responses:
 *       200:
 *         description: Login successful — JWT returned
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/login', validate(validateLogin), login);

module.exports = router;
