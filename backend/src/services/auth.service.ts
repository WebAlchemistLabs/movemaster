import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { readCollection, writeCollection, findOne, insertOne, updateOne } from '../database/db';
import { generateId } from '../utils/id';
import type { User, UserRole, AuthTokens } from '../models/types';

export interface JwtPayload { uid: string; email: string; role: UserRole; iat?: number; exp?: number; }

export const signAccess  = (p: Omit<JwtPayload,'iat'|'exp'>) => jwt.sign(p, env.jwt.secret,        { expiresIn: env.jwt.expiresIn }  as jwt.SignOptions);
export const signRefresh = (p: Omit<JwtPayload,'iat'|'exp'>) => jwt.sign(p, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn }) as unknown as string;
export const verifyAccess  = (t: string) => jwt.verify(t, env.jwt.secret)        as JwtPayload;
export const verifyRefresh = (t: string) => jwt.verify(t, env.jwt.refreshSecret) as JwtPayload;

export function makeTokens(user: User): AuthTokens {
  const p = { uid: user.uid, email: user.email, role: user.role };
  return { accessToken: signAccess(p), refreshToken: signRefresh(p), expiresIn: 7*24*60*60 };
}

export async function registerUser(name: string, email: string, password: string): Promise<{user:User; tokens:AuthTokens}> {
  const existing = findOne<User>('users', u => u.email === email);
  if (existing) throw new Error('An account with this email already exists.');
  const hash = await bcrypt.hash(password, 12);
  const now  = new Date().toISOString();
  const uid  = generateId();
  const user: User = { id: uid, uid, displayName: name, email, passwordHash: hash, role: 'customer', createdAt: now, updatedAt: now };
  insertOne('users', user);
  return { user, tokens: makeTokens(user) };
}

export async function loginUser(email: string, password: string): Promise<{user:User; tokens:AuthTokens}> {
  const user = findOne<User>('users', u => u.email === email);
  if (!user) throw new Error('No account found with that email address.');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Incorrect password. Please try again.');
  const now = new Date().toISOString();
  updateOne<User>('users', user.uid, { lastLoginAt: now, updatedAt: now });
  return { user, tokens: makeTokens(user) };
}

export async function refreshTokens(token: string): Promise<{user:User; tokens:AuthTokens}> {
  let payload: JwtPayload;
  try { payload = verifyRefresh(token); } catch { throw new Error('Invalid or expired refresh token.'); }
  const user = findOne<User>('users', u => u.uid === payload.uid);
  if (!user) throw new Error('User not found.');
  return { user, tokens: makeTokens(user) };
}

export function getUserById(uid: string): User | null {
  return findOne<User>('users', u => u.uid === uid) ?? null;
}

export function getAllUsers(): User[] {
  return readCollection<User>('users').map(u => ({ ...u, passwordHash: '***' }));
}

export function updateUser(uid: string, data: Partial<User>): User | null {
  return updateOne<User>('users', uid, { ...data, updatedAt: new Date().toISOString() });
}
