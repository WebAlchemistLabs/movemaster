import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

// General API limiter — 100 requests per 15 min
export const apiLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests — please try again later.',
    code: 'RATE_LIMITED',
  },
});

// Strict limiter for quote submissions — 10 per 15 min
export const quoteLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.quoteMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many quote requests — please wait before submitting another.',
    code: 'RATE_LIMITED',
  },
});

// Auth limiter — 20 attempts per 15 min
export const authLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts — please try again later.',
    code: 'RATE_LIMITED',
  },
});
