import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/auth.service';
import { unauthorized, forbidden } from '../utils/response';
import type { UserRole } from '../models/types';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: UserRole;
  };
}

// ─── Require valid JWT ────────────────────────────────────────────────────────

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    unauthorized(res, 'Missing or invalid Authorization header');
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = { uid: payload.uid, email: payload.email, role: payload.role };
    next();
  } catch {
    unauthorized(res, 'Invalid or expired access token');
  }
}

// ─── Optionally attach user (does not fail if no token) ───────────────────────

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) { next(); return; }

  try {
    const payload = verifyAccessToken(authHeader.slice(7));
    req.user = { uid: payload.uid, email: payload.email, role: payload.role };
  } catch {
    // Silently ignore invalid tokens in optional mode
  }
  next();
}

// ─── Require specific roles ───────────────────────────────────────────────────

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) { unauthorized(res); return; }
    if (!roles.includes(req.user.role)) {
      forbidden(res, `This action requires one of: ${roles.join(', ')}`);
      return;
    }
    next();
  };
}

export const requireAdmin = requireRole('admin');
export const requireCustomerOrAdmin = requireRole('customer', 'admin');
