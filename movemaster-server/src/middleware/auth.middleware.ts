import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../services/auth.service';
import { unauthorized, forbidden } from '../utils/response';
import type { UserRole } from '../models/types';

export interface AuthRequest extends Request {
  user?: { uid: string; email: string; role: UserRole };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) { unauthorized(res, 'Missing Authorization header'); return; }
  try {
    const p = verifyAccess(h.slice(7));
    req.user = { uid: p.uid, email: p.email, role: p.role };
    next();
  } catch { unauthorized(res, 'Invalid or expired token'); }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const h = req.headers.authorization;
  if (h?.startsWith('Bearer ')) {
    try { const p = verifyAccess(h.slice(7)); req.user = { uid: p.uid, email: p.email, role: p.role }; } catch { /* ignore */ }
  }
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) { unauthorized(res); return; }
    if (!roles.includes(req.user.role)) { forbidden(res, `Requires role: ${roles.join(' or ')}`); return; }
    next();
  };
}

export const requireAdmin = requireRole('admin');
