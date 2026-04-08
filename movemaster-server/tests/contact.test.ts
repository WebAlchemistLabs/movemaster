import request from 'supertest';
import app from '../src/index';

const BASE = '/api/v1';

describe('Contact Routes', () => {
  let adminToken: string;

  beforeAll(async () => {
    const res = await request(app)
      .post(`${BASE}/auth/login`)
      .send({ email: 'admin@movemaster.pro', password: 'admin1234' });
    adminToken = res.body.data?.tokens?.accessToken ?? '';
  });

  describe('POST /contact', () => {
    it('submits a contact message', async () => {
      const res = await request(app)
        .post(`${BASE}/contact`)
        .send({
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '905-555-1234',
          serviceType: 'residential',
          message: 'I need to move a 3-bedroom house next month. Can you help?',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
    });

    it('validates message length', async () => {
      const res = await request(app)
        .post(`${BASE}/contact`)
        .send({ name: 'Bob', email: 'bob@example.com', message: 'Hi' });

      expect(res.status).toBe(400);
    });

    it('validates email format', async () => {
      const res = await request(app)
        .post(`${BASE}/contact`)
        .send({ name: 'Bob', email: 'not-an-email', message: 'I need help moving please.' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /contact/messages (admin)', () => {
    it('admin can list messages', async () => {
      const res = await request(app)
        .get(`${BASE}/contact/messages`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('non-admin cannot list messages', async () => {
      const demoRes = await request(app).post(`${BASE}/auth/demo`);
      const userToken = demoRes.body.data.tokens.accessToken;

      const res = await request(app)
        .get(`${BASE}/contact/messages`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
