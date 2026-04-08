import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { store } from './store';
import { generateId } from '../utils/id';
import type { User, AuthTokens, UserRole } from '../models/types';

export interface JwtPayload {
  uid: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Token helpers ────────────────────────────────────────────────────────────

export function signAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn } as jwt.SignOptions);
}

export function signRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.secret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
}

export function makeTokens(user: User): AuthTokens {
  const payload = { uid: user.uid, email: user.email, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };
}

// ─── Password ─────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// In-memory password store (demo mode only — never store plain passwords)
const passwordHashes = new Map<string, string>();

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; tokens: AuthTokens }> {
  const existing = store.getUserByEmail(email);
  if (existing) throw new Error('An account with this email already exists.');

  const hash = await hashPassword(password);
  const uid = generateId();
  const now = new Date().toISOString();

  const user: User = {
    uid,
    displayName: name,
    email,
    role: 'customer',
    createdAt: now,
    updatedAt: now,
  };

  store.createUser(user);
  passwordHashes.set(uid, hash);

  const tokens = makeTokens(user);
  return { user, tokens };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; tokens: AuthTokens }> {
  const user = store.getUserByEmail(email);
  if (!user) throw new Error('No account found with that email address.');

  const hash = passwordHashes.get(user.uid);
  if (!hash) throw new Error('Invalid credentials. Please try again.');

  const valid = await comparePassword(password, hash);
  if (!valid) throw new Error('Incorrect password. Please try again.');

  store.updateUser(user.uid, { lastLoginAt: new Date().toISOString() });
  const tokens = makeTokens(user);
  return { user, tokens };
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

export async function refreshTokens(
  refreshToken: string
): Promise<{ user: User; tokens: AuthTokens }> {
  let payload: JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error('Invalid or expired refresh token.');
  }

  const user = store.getUser(payload.uid);
  if (!user) throw new Error('User not found.');

  const tokens = makeTokens(user);
  return { user, tokens };
}

// ─── Demo user seed ───────────────────────────────────────────────────────────

export async function seedDemoUser(): Promise<void> {
  const demoEmail = 'demo@movemaster.pro';
  const existing = store.getUserByEmail(demoEmail);
  if (existing) return;

  const hash = await hashPassword('demo1234');
  const uid = 'demo-user-001';
  const now = new Date().toISOString();

  const user: User = {
    uid,
    displayName: 'Demo User',
    email: demoEmail,
    phone: '416-555-0100',
    preferredCity: 'Toronto',
    role: 'customer',
    createdAt: now,
    updatedAt: now,
  };

  const admin: User = {
    uid: 'admin-user-001',
    displayName: 'Admin User',
    email: 'admin@movemaster.pro',
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  };

  store.createUser(user);
  store.createUser(admin);
  passwordHashes.set(uid, hash);
  passwordHashes.set('admin-user-001', await hashPassword('admin1234'));

  console.log('  Demo users seeded (demo@movemaster.pro / demo1234, admin@movemaster.pro / admin1234)');
}
