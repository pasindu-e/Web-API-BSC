const swaggerJsdoc = require('swagger-jsdoc');
const path         = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Sri Lanka Police Tuk-Tuk Monitoring API',
      version:     '1.0.0',
      description:
        'REST API for tracking vehicles, pings, provinces, districts, and stations.\n\n' +
        '**NIBM Index:** COBSCCOMP251P-034\n\n' +
        '**Protected endpoints** require a Bearer JWT. ' +
        'Register via `POST /v1/api/auth/register`, then login via `POST /v1/api/auth/login` ' +
        'to obtain a token and click **Authorize**.',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Development server' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type:         'http',
          scheme:       'bearer',
          bearerFormat: 'JWT',
          description:  'JWT obtained from POST /v1/api/auth/login',
        },
      },
      schemas: {
        Province: {
          type: 'object',
          properties: {
            id:   { type: 'integer', example: 1 },
            name: { type: 'string',  example: 'Western Province' },
          },
        },
        District: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            name:        { type: 'string',  example: 'Colombo' },
            province_id: { type: 'integer', example: 1 },
          },
        },
        Station: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            name:        { type: 'string',  example: 'Colombo Police Station' },
            district_id: { type: 'integer', example: 1 },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id:                  { type: 'integer', example: 1 },
            registration_number: { type: 'string',  example: 'WP ABC-1234' },
            device_id:           { type: 'string',  example: 'GPS-127257' },
            station_id:          { type: 'integer', example: 1 },
          },
        },
        Ping: {
          type: 'object',
          properties: {
            id:         { type: 'integer',         example: 1 },
            vehicle_id: { type: 'integer',         example: 1 },
            latitude:   { type: 'number', format: 'float', example: 6.9271 },
            longitude:  { type: 'number', format: 'float', example: 79.8612 },
            timestamp:  { type: 'string', format: 'date-time', example: '2026-06-21T14:16:41.979Z' },
          },
        },
        VehicleWithLastPing: {
          allOf: [
            { $ref: '#/components/schemas/Vehicle' },
            {
              type: 'object',
              properties: {
                last_ping: {
                  nullable: true,
                  allOf: [{ $ref: '#/components/schemas/Ping' }],
                  description: 'Most recent ping, or null if no pings exist',
                },
              },
            },
          ],
        },
        CreatePingBody: {
          type:     'object',
          required: ['latitude', 'longitude'],
          properties: {
            latitude:  { type: 'number', format: 'float', minimum: -90,  maximum: 90,  example: 6.9271 },
            longitude: { type: 'number', format: 'float', minimum: -180, maximum: 180, example: 79.8612 },
            timestamp: { type: 'string', format: 'date-time', description: 'Defaults to server time if omitted', example: '2026-06-21T14:16:41.979Z' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string',  example: 'Success' },
            data:    { description: 'Response payload — schema varies by endpoint' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string',  example: 'Resource not found' },
            errors:  { type: 'array', items: { type: 'string' } },
          },
        },
        RegisterBody: {
          type:     'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, example: 'officer_silva' },
            email:    { type: 'string', format: 'email', example: 'silva@police.lk' },
            password: { type: 'string', minLength: 6, example: 'secret123' },
            role:     { type: 'string', enum: ['admin', 'officer'], default: 'officer', example: 'officer' },
          },
        },
        LoginBody: {
          type:     'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'silva@police.lk' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            id:       { type: 'string', example: '6853f4c0a1b2c3d4e5f6a7b8' },
            username: { type: 'string', example: 'officer_silva' },
            email:    { type: 'string', example: 'silva@police.lk' },
            role:     { type: 'string', enum: ['admin', 'officer'], example: 'officer' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user:  { $ref: '#/components/schemas/UserProfile' },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../app.js'),
    path.join(__dirname, '../routes/*.js'),
  ],
};

module.exports = swaggerJsdoc(options);
