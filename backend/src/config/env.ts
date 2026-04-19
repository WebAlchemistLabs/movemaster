import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function get(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port: parseInt(get('PORT', '4000'), 10),
  nodeEnv: get('NODE_ENV', 'development'),
  isDev:  get('NODE_ENV', 'development') !== 'production',
  isProd: get('NODE_ENV', 'development') === 'production',
  apiVersion: get('API_VERSION', 'v1'),

  jwt: {
    secret:         get('JWT_SECRET',         'movemaster-dev-secret-32-chars-min-ok'),
    expiresIn:      get('JWT_EXPIRES_IN',      '7d'),
    refreshSecret:  get('JWT_REFRESH_SECRET',  'movemaster-refresh-dev-secret-ok'),
    refreshExpiresIn: get('JWT_REFRESH_EXPIRES_IN', '30d'),
  },

  email: {
    host:       get('SMTP_HOST', 'smtp.gmail.com'),
    port:       parseInt(get('SMTP_PORT', '587'), 10),
    secure:     get('SMTP_SECURE', 'false') === 'true',
    user:       get('SMTP_USER'),
    pass:       get('SMTP_PASS'),
    from:       get('EMAIL_FROM', 'MoveMaster Pro <hello@movemasterpro.ca>'),
    adminEmail: get('ADMIN_EMAIL', 'admin@movemasterpro.ca'),
  },

  cors: {
    frontendUrl:    get('FRONTEND_URL', 'http://localhost:3000'),
    allowedOrigins: get('ALLOWED_ORIGINS', 'http://localhost:3000').split(','),
  },
} as const;
