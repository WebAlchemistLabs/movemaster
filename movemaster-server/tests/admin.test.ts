import request from 'supertest';
import app from '../src/index';

const BASE = '/api/v1';

describe('Admin Routes', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post(`${BASE}/auth/login`)
      .send({ email: 'admin@movemaster.pro', password: 'admin1234' });
    adminToken = adminRes.body.data?.tokens?.accessToken ?? '';

    const demoRes = await request(app).post(`${BASE}/auth/demo`);
    userToken = demoRes.body.data?.tokens?.accessToken ?? '';
  });

  describe('GET /admin/stats', () => {
    it('admin gets full stats', async () => {
      const res = await request(app)
        .get(`${BASE}/admin/stats`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.quotes).toBeDefined();
      expect(res.body.data.revenue).toBeDefined();
      expect(res.body.data.users).toBeDefined();
      expect(res.body.data.serviceBreakdown).toBeInstanceOf(Array);
    });

    it('non-admin is forbidden', async () => {
      const res = await request(app)
        .get(`${BASE}/admin/stats`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('unauthenticated is rejected', async () => {
      const res = await request(app).get(`${BASE}/admin/stats`);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /admin/users', () => {
    it('admin gets user list', async () => {
      const res = await request(app)
        .get(`${BASE}/admin/users`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
