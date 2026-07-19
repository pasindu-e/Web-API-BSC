const express             = require('express');
const swaggerUi           = require('swagger-ui-express');
const swaggerSpec         = require('./config/swagger');
const apiRoutes           = require('./routes/index');
const { errorMiddleware } = require('./middlewares/error.middleware');
const ApiError            = require('./utils/ApiError');
const { API_PREFIX }      = require('./config/env');

const app = express();

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Tuk-Tuk Monitoring API',
  swaggerOptions: { persistAuthorization: true },
}));

// Serve raw OpenAPI JSON spec
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns server status and current session information.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Sri Lanka Police Tuk-Tuk Monitoring API
 *                 index:
 *                   type: string
 *                   example: COBSCCOMP251P-034
 *                 session:
 *                   type: object
 *                   properties:
 *                     node:
 *                       type: string
 *                       example: v26.3.0
 *                     uptime:
 *                       type: integer
 *                       example: 42
 *                     time:
 *                       type: string
 *                       format: date-time
 */
app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    message: 'Sri Lanka Police Tuk-Tuk Monitoring API',
    index:   'COBSCCOMP251P-034',
    session: {
      node:   process.version,
      uptime: Math.floor(process.uptime()),
      time:   new Date().toISOString(),
    },
  });
});

app.use(API_PREFIX, apiRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.url}`));
});

app.use(errorMiddleware);

module.exports = app;
