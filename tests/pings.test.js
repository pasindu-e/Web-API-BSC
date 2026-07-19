const request = require('supertest');
const app     = require('../src/app');

describe('Pings API', () => {
  describe('GET /v1/api/pings', () => {
    it('returns 200 with an array of pings', async () => {
      const res = await request(app).get('/v1/api/pings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /v1/api/pings/:id', () => {
    it('returns ping 1', async () => {
      const res = await request(app).get('/v1/api/pings/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', 1);
    });

    it('returns 404 for non-existent ping', async () => {
      const res = await request(app).get('/v1/api/pings/99999999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /v1/api/vehicles/:vehicleId/pings', () => {
    it('returns 401 with no API key', async () => {
      const res = await request(app)
        .post('/v1/api/vehicles/1/pings')
        .send({ latitude: 6.9, longitude: 79.8 });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 401 with wrong API key', async () => {
      const res = await request(app)
        .post('/v1/api/vehicles/1/pings')
        .set('X-API-Key', 'wrong_key')
        .send({ latitude: 6.9, longitude: 79.8 });
      expect(res.status).toBe(401);
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(app)
        .post('/v1/api/vehicles/1/pings')
        .set('X-API-Key', 'key_v01')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/latitude and longitude are required/i);
    });

    it('returns 400 when latitude/longitude are strings', async () => {
      const res = await request(app)
        .post('/v1/api/vehicles/1/pings')
        .set('X-API-Key', 'key_v01')
        .send({ latitude: '6.9', longitude: '79.8' });
      expect(res.status).toBe(400);
    });

    it('returns 404 for non-existent vehicle', async () => {
      const res = await request(app)
        .post('/v1/api/vehicles/99999/pings')
        .set('X-API-Key', 'key_v01')
        .send({ latitude: 6.9271, longitude: 79.8612 });
      expect(res.status).toBe(404);
    });

    it('returns 201 + Location header + wrapped body', async () => {
      const res = await request(app)
        .post('/v1/api/vehicles/1/pings')
        .set('X-API-Key', 'key_v01')
        .send({ latitude: 6.9271, longitude: 79.8612 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('vehicle_id', 1);
      expect(res.body.data.latitude).toBe(6.9271);
      expect(res.body.data.longitude).toBe(79.8612);
      expect(res.headers.location).toMatch(/^\/v1\/api\/pings\/\d+$/);
    });

    it('uses the provided timestamp when supplied', async () => {
      const ts = '2026-06-01T10:00:00.000Z';
      const res = await request(app)
        .post('/v1/api/vehicles/2/pings')
        .set('X-API-Key', 'key_v01')
        .send({ latitude: 7.0, longitude: 80.0, timestamp: ts });

      expect(res.status).toBe(201);
      expect(res.body.data.timestamp).toBe(ts);
    });
  });
});
