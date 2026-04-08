import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (env.isDev) console.error(err.stack);

  // Handle specific error types
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, error: 'Invalid or expired token', code: 'UNAUTHORIZED' });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, error: err.message, code: 'VALIDATION_ERROR' });
    return;
  }

  res.status(500).json({
    success: false,
    error: env.isProd ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  });
}
