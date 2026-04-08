import request from 'supertest';
import app from '../src/index';

const BASE = '/api/v1';

describe('Auth Routes', () => {
  let accessToken: string;
  let refreshToken: string;
  const testEmail = `test_${Date.now()}@example.com`;

  // ─── Register ───────────────────────────────────────────────────────────────

  describe('POST /auth/register', () => {
    it('creates a new account and returns tokens', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/register`)
        .send({ name: 'Test User', email: testEmail, password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();

      accessToken = res.body.data.tokens.accessToken;
      refreshToken = res.body.data.tokens.refreshToken;
    });

    it('rejects duplicate email', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/register`)
        .send({ name: 'Test User', email: testEmail, password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/register`)
        .send({ email: 'bad-email', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.details).toBeDefined();
    });
  });

  // ─── Login ──────────────────────────────────────────────────────────────────

  describe('POST /auth/login', () => {
    it('returns tokens on valid credentials', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/login`)
        .send({ email: testEmail, password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('rejects wrong password', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/login`)
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects unknown email', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/login`)
        .send({ email: 'nobody@example.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  // ─── Demo Login ──────────────────────────────────────────────────────────────

  describe('POST /auth/demo', () => {
    it('returns demo tokens', async () => {
      const res = await request(app).post(`${BASE}/auth/demo`);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('demo@movemaster.pro');
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });
  });

  // ─── Refresh ──────────────────────────────────────────────────────────────────

  describe('POST /auth/refresh', () => {
    it('issues new tokens from valid refresh token', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/refresh`)
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.tokens.accessToken).toBeDefined();
    });

    it('rejects invalid refresh token', async () => {
      const res = await request(app)
        .post(`${BASE}/auth/refresh`)
        .send({ refreshToken: 'not-a-valid-token' });

      expect(res.status).toBe(401);
    });
  });

  // ─── GET /me ──────────────────────────────────────────────────────────────────

  describe('GET /auth/me', () => {
    it('returns user profile with valid token', async () => {
      const res = await request(app)
        .get(`${BASE}/auth/me`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testEmail);
    });

    it('rejects missing token', async () => {
      const res = await request(app).get(`${BASE}/auth/me`);
      expect(res.status).toBe(401);
    });

    it('rejects invalid token', async () => {
      const res = await request(app)
        .get(`${BASE}/auth/me`)
        .set('Authorization', 'Bearer garbage-token');
      expect(res.status).toBe(401);
    });
  });

  // ─── PATCH /me ────────────────────────────────────────────────────────────────

  describe('PATCH /auth/me', () => {
    it('updates user profile', async () => {
      const res = await request(app)
        .patch(`${BASE}/auth/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ phone: '416-555-9999', preferredCity: 'Hamilton' });

      expect(res.status).toBe(200);
    });
  });
});
