import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import { env } from './config/env';
import { initFirebase } from './config/firebase';
import { initEmail } from './services/email';
import { seedDemoUser } from './services/auth.service';

import { apiLimiter } from './middleware/rateLimit.middleware';
import { notFoundHandler, errorHandler } from './middleware/error.middleware';

import authRoutes    from './routes/auth.routes';
import quoteRoutes   from './routes/quote.routes';
import paymentRoutes from './routes/payment.routes';
import contactRoutes from './routes/contact.routes';
import adminRoutes   from './routes/admin.routes';

const app = express();

// ─── Security & Utilities ─────────────────────────────────────────────────────

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (env.cors.allowedOrigins.includes(origin) || env.isDev) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());
app.use(morgan(env.isDev ? 'dev' : 'combined'));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
// NOTE: The Stripe webhook route uses its own raw body parser (configured in payment.routes.ts)
// So we register JSON parser AFTER mounting the webhook route to avoid conflicts.

// Mount webhook BEFORE global JSON parser
app.use(`/api/${env.apiVersion}/payments`, paymentRoutes);

// Now apply JSON parser for all other routes
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────

app.use(`/api/${env.apiVersion}`, apiLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'movemaster-pro-api',
    version: env.apiVersion,
    mode: env.isDemoMode ? 'demo' : 'production',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'MoveMaster Pro API',
    version: env.apiVersion,
    docs: `/api/${env.apiVersion}`,
    health: '/health',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

const base = `/api/${env.apiVersion}`;

app.use(`${base}/auth`,    authRoutes);
app.use(`${base}/quotes`,  quoteRoutes);
app.use(`${base}/contact`, contactRoutes);
app.use(`${base}/admin`,   adminRoutes);
// payments already mounted above (webhook needs raw body before JSON parser)

// ─── API Info ─────────────────────────────────────────────────────────────────

app.get(`${base}`, (_req, res) => {
  res.json({
    version: env.apiVersion,
    endpoints: {
      auth:     `${base}/auth`,
      quotes:   `${base}/quotes`,
      payments: `${base}/payments`,
      contact:  `${base}/contact`,
      admin:    `${base}/admin`,
    },
    mode: env.isDemoMode ? 'demo' : 'production',
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────

app.use(notFoundHandler);
app.use(errorHandler);

// ─── Boot ─────────────────────────────────────────────────────────────────────

async function boot(): Promise<void> {
  console.log('\n🚛  MoveMaster Pro API');
  console.log('━'.repeat(40));
  console.log(`  Mode     : ${env.isDemoMode ? 'DEMO (localStorage-like in-memory)' : 'PRODUCTION'}`);
  console.log(`  Env      : ${env.nodeEnv}`);
  console.log(`  Port     : ${env.port}`);
  console.log(`  API Base : /api/${env.apiVersion}`);
  console.log('━'.repeat(40));

  await initFirebase();
  initEmail();

  if (env.isDemoMode) {
    await seedDemoUser();
  }

  app.listen(env.port, () => {
    console.log(`\n✅  Server running at http://localhost:${env.port}`);
    console.log(`   Health : http://localhost:${env.port}/health`);
    console.log(`   API    : http://localhost:${env.port}/api/${env.apiVersion}\n`);
  });
}

boot().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
