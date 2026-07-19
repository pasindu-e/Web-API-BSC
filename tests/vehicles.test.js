const request = require('supertest');
const app     = require('../src/app');

describe('Vehicles API', () => {
  describe('GET /v1/api/vehicles', () => {
    it('returns 200 with an array of 220 vehicles', async () => {
      const res = await request(app).get('/v1/api/vehicles');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(220);
    });
  });

  describe('GET /v1/api/vehicles/:id', () => {
    it('returns vehicle with last_ping field', async () => {
      const res = await request(app).get('/v1/api/vehicles/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', 1);
      expect(res.body.data).toHaveProperty('last_ping');
    });

    it('returns 404 for a non-existent vehicle', async () => {
      const res = await request(app).get('/v1/api/vehicles/99999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /v1/api/vehicles/:id/pings', () => {
    it('returns pings array for vehicle 1', async () => {
      const res = await request(app).get('/v1/api/vehicles/1/pings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /v1/api/vehicles/:id/last-position', () => {
    it('returns the most recent ping for vehicle 1', async () => {
      const res = await request(app).get('/v1/api/vehicles/1/last-position');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('vehicle_id', 1);
      expect(res.body.data).toHaveProperty('latitude');
      expect(res.body.data).toHaveProperty('longitude');
      expect(res.body.data).toHaveProperty('timestamp');
    });
  });
});
