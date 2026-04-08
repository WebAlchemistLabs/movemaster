import request from 'supertest';
import app from '../src/index';

const BASE = '/api/v1';

const validQuotePayload = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '416-555-1234',
  moveDate: '2025-08-15',
  moveSize: '2-bedroom',
  serviceType: 'residential',
  originAddress: '100 King St W',
  originCity: 'Toronto',
  destinationAddress: '200 Main St',
  destinationCity: 'Mississauga',
  needsPacking: false,
  needsStorage: false,
  hasSpecialtyItems: false,
  hasElevator: true,
  floorOrigin: 1,
  floorDestination: 1,
  notes: 'Ground floor on both ends, easy access.',
};

describe('Quote Routes', () => {
  let quoteId: string;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Get admin token
    const adminRes = await request(app)
      .post(`${BASE}/auth/login`)
      .send({ email: 'admin@movemaster.pro', password: 'admin1234' });
    adminToken = adminRes.body.data?.tokens?.accessToken ?? '';

    // Get regular user token
    const demoRes = await request(app).post(`${BASE}/auth/demo`);
    userToken = demoRes.body.data?.tokens?.accessToken ?? '';
  });

  // ─── Estimate ────────────────────────────────────────────────────────────────

  describe('POST /quotes/estimate', () => {
    it('returns price estimate without saving', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes/estimate`)
        .send({
          serviceType: 'residential',
          moveSize: '2-bedroom',
          originCity: 'Toronto',
          destinationCity: 'Mississauga',
          needsPacking: false,
          needsStorage: false,
          hasSpecialtyItems: false,
          hasElevator: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.hourlyRate).toBe(169);
      expect(res.body.data.estimatedHours).toBe(5);
      expect(res.body.data.basePrice).toBe(169 * 5);
      expect(res.body.data.totalMin).toBeDefined();
      expect(res.body.data.totalMax).toBeGreaterThan(res.body.data.totalMin);
      expect(res.body.data.depositAmount).toBeGreaterThan(0);
    });

    it('applies packing surcharge', async () => {
      const base = await request(app)
        .post(`${BASE}/quotes/estimate`)
        .send({ serviceType: 'residential', moveSize: '2-bedroom', originCity: 'Toronto', destinationCity: 'Toronto', needsPacking: false, needsStorage: false, hasSpecialtyItems: false, hasElevator: true });

      const withPacking = await request(app)
        .post(`${BASE}/quotes/estimate`)
        .send({ serviceType: 'residential', moveSize: '2-bedroom', originCity: 'Toronto', destinationCity: 'Toronto', needsPacking: true, needsStorage: false, hasSpecialtyItems: false, hasElevator: true });

      expect(withPacking.body.data.packingFee).toBeGreaterThan(0);
      expect(withPacking.body.data.totalMin).toBeGreaterThan(base.body.data.totalMin);
    });

    it('applies long-distance fee', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes/estimate`)
        .send({ serviceType: 'long-distance', moveSize: '2-bedroom', originCity: 'Toronto', destinationCity: 'Windsor', needsPacking: false, needsStorage: false, hasSpecialtyItems: false, hasElevator: true });

      expect(res.body.data.longDistanceFee).toBe(900);
    });

    it('rejects invalid move size', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes/estimate`)
        .send({ serviceType: 'residential', moveSize: 'mansion', originCity: 'Toronto', destinationCity: 'Toronto', needsPacking: false, needsStorage: false, hasSpecialtyItems: false, hasElevator: true });

      expect(res.status).toBe(400);
    });
  });

  // ─── Create Quote ─────────────────────────────────────────────────────────────

  describe('POST /quotes', () => {
    it('creates a quote and returns ID', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes`)
        .send(validQuotePayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toMatch(/^QR-/);
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.estimatedPrice).toBeGreaterThan(0);
      expect(res.body.data.depositAmount).toBeGreaterThan(0);

      quoteId = res.body.data.id;
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes`)
        .send({ name: 'X', email: 'bad', phone: '' });

      expect(res.status).toBe(400);
      expect(res.body.details).toBeDefined();
    });

    it('rejects invalid service type', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes`)
        .send({ ...validQuotePayload, serviceType: 'helicopter-move' });

      expect(res.status).toBe(400);
    });
  });

  // ─── Get Quote ────────────────────────────────────────────────────────────────

  describe('GET /quotes/:id', () => {
    it('returns quote with valid auth', async () => {
      const res = await request(app)
        .get(`${BASE}/quotes/${quoteId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(quoteId);
    });

    it('returns 404 for nonexistent quote', async () => {
      const res = await request(app)
        .get(`${BASE}/quotes/QR-NOTREAL`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    it('requires authentication', async () => {
      const res = await request(app).get(`${BASE}/quotes/${quoteId}`);
      expect(res.status).toBe(401);
    });
  });

  // ─── Update Status ────────────────────────────────────────────────────────────

  describe('PATCH /quotes/:id/status', () => {
    it('admin can update quote status', async () => {
      const res = await request(app)
        .patch(`${BASE}/quotes/${quoteId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('confirmed');
    });

    it('rejects invalid status', async () => {
      const res = await request(app)
        .patch(`${BASE}/quotes/${quoteId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'on-fire' });

      expect(res.status).toBe(400);
    });

    it('non-admin cannot update status', async () => {
      const res = await request(app)
        .patch(`${BASE}/quotes/${quoteId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'completed' });

      expect(res.status).toBe(403);
    });
  });

  // ─── Confirm Deposit ──────────────────────────────────────────────────────────

  describe('POST /quotes/:id/confirm-deposit', () => {
    it('marks deposit as paid', async () => {
      const res = await request(app)
        .post(`${BASE}/quotes/${quoteId}/confirm-deposit`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ stripePaymentIntentId: 'pi_test_123' });

      expect(res.status).toBe(200);
      expect(res.body.data.depositPaid).toBe(true);
      expect(res.body.data.status).toBe('confirmed');
    });
  });

  // ─── List All (admin) ─────────────────────────────────────────────────────────

  describe('GET /quotes (admin)', () => {
    it('admin gets all quotes', async () => {
      const res = await request(app)
        .get(`${BASE}/quotes`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('filters by status', async () => {
      const res = await request(app)
        .get(`${BASE}/quotes?status=confirmed`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((q: { status: string }) => {
        expect(q.status).toBe('confirmed');
      });
    });
  });
});
