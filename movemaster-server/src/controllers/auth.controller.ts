import { Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import {
  registerUser,
  loginUser,
  refreshTokens,
  seedDemoUser,
} from '../services/auth.service';
import { store } from '../services/store';
import { ok, created, badRequest, unauthorized, notFound } from '../utils/response';
import type { AuthRequest } from '../middleware/auth.middleware';

// ─── Validation rules ─────────────────────────────────────────────────────────

export const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// ─── POST /auth/register ──────────────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  try {
    const { user, tokens } = await registerUser(name, email, password);
    created(res, {
      user: { uid: user.uid, displayName: user.displayName, email: user.email, role: user.role },
      tokens,
    }, 'Account created successfully');
  } catch (err: unknown) {
    badRequest(res, (err as Error).message);
  }
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const { user, tokens } = await loginUser(email, password);
    ok(res, {
      user: { uid: user.uid, displayName: user.displayName, email: user.email, role: user.role },
      tokens,
    }, 'Login successful');
  } catch (err: unknown) {
    unauthorized(res, (err as Error).message);
  }
}

// ─── POST /auth/refresh ───────────────────────────────────────────────────────

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    badRequest(res, 'refreshToken is required');
    return;
  }

  try {
    const { user, tokens } = await refreshTokens(refreshToken);
    ok(res, {
      user: { uid: user.uid, displayName: user.displayName, email: user.email, role: user.role },
      tokens,
    });
  } catch (err: unknown) {
    unauthorized(res, (err as Error).message);
  }
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  const user = store.getUser(req.user!.uid);
  if (!user) { notFound(res, 'User not found'); return; }
  ok(res, { uid: user.uid, displayName: user.displayName, email: user.email, phone: user.phone, preferredCity: user.preferredCity, role: user.role, createdAt: user.createdAt });
}

// ─── PATCH /auth/me ───────────────────────────────────────────────────────────

export async function updateMe(req: AuthRequest, res: Response): Promise<void> {
  const { displayName, phone, preferredCity } = req.body as {
    displayName?: string;
    phone?: string;
    preferredCity?: string;
  };

  const updated = store.updateUser(req.user!.uid, { displayName, phone, preferredCity });
  if (!updated) { notFound(res, 'User not found'); return; }
  ok(res, { uid: updated.uid, displayName: updated.displayName, email: updated.email, phone: updated.phone, preferredCity: updated.preferredCity }, 'Profile updated');
}

// ─── POST /auth/demo ──────────────────────────────────────────────────────────

export async function demoLogin(req: Request, res: Response): Promise<void> {
  await seedDemoUser();
  try {
    const { user, tokens } = await loginUser('demo@movemaster.pro', 'demo1234');
    ok(res, {
      user: { uid: user.uid, displayName: user.displayName, email: user.email, role: user.role },
      tokens,
    }, 'Demo login successful');
  } catch (err: unknown) {
    badRequest(res, (err as Error).message);
  }
}
