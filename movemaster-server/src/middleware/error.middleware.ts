import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}`, code: 'NOT_FOUND' });
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, error: 'Invalid or expired token', code: 'UNAUTHORIZED' }); return;
  }
  res.status(500).json({ success: false, error: env.isDev ? err.message : 'Internal server error', code: 'INTERNAL_ERROR' });
}
