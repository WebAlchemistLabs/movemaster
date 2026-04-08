import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function required(key: string): string {
  const val = process.env[key];
  if (!val && process.env.DEMO_MODE !== 'true') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return val ?? '';
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port: parseInt(optional('PORT', '4000'), 10),
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev: optional('NODE_ENV', 'development') === 'development',
  isProd: optional('NODE_ENV', 'development') === 'production',
  isDemoMode: optional('DEMO_MODE', 'true') === 'true',
  apiVersion: optional('API_VERSION', 'v1'),

  jwt: {
    secret: optional('JWT_SECRET', 'dev-secret-change-in-production-minimum-32-chars'),
    expiresIn: optional('JWT_EXPIRES_IN', '7d'),
    refreshSecret: optional('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '30d'),
  },

  firebase: {
    serviceAccountPath: optional('FIREBASE_SERVICE_ACCOUNT_PATH'),
    projectId: optional('FIREBASE_PROJECT_ID'),
    clientEmail: optional('FIREBASE_CLIENT_EMAIL'),
    privateKey: optional('FIREBASE_PRIVATE_KEY', '').replace(/\\n/g, '\n'),
  },

  stripe: {
    secretKey: optional('STRIPE_SECRET_KEY'),
    webhookSecret: optional('STRIPE_WEBHOOK_SECRET'),
    depositPercent: parseInt(optional('STRIPE_DEPOSIT_PERCENT', '20'), 10),
  },

  email: {
    host: optional('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(optional('SMTP_PORT', '587'), 10),
    secure: optional('SMTP_SECURE', 'false') === 'true',
    user: optional('SMTP_USER'),
    pass: optional('SMTP_PASS'),
    from: optional('EMAIL_FROM', 'MoveMaster Pro <hello@movemasterpro.ca>'),
    adminEmail: optional('ADMIN_EMAIL', 'admin@movemasterpro.ca'),
  },

  cors: {
    frontendUrl: optional('FRONTEND_URL', 'http://localhost:3000'),
    allowedOrigins: optional('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
  },

  rateLimit: {
    windowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(optional('RATE_LIMIT_MAX', '100'), 10),
    quoteMax: parseInt(optional('RATE_LIMIT_QUOTE_MAX', '10'), 10),
  },
} as const;
