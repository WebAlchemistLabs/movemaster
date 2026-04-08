import { isDemoMode } from './config';
import type { UserProfile } from '@/types';
import { generateId } from '@/lib/utils';

export const DEMO_USER: UserProfile = {
  uid: 'demo-user-001',
  displayName: 'Demo User',
  email: 'demo@movemaster.pro',
  phone: '416-555-0100',
  preferredCity: 'Toronto',
  createdAt: '2024-01-15T10:00:00Z',
};

type AuthCallback = (user: UserProfile | null) => void;
const callbacks: AuthCallback[] = [];

function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('mm_current_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function setStoredUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('mm_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('mm_current_user');
  }
  callbacks.forEach((cb) => cb(user));
}

export async function registerUser(email: string, _password: string, name: string): Promise<UserProfile> {
  if (isDemoMode) {
    const user: UserProfile = {
      uid: generateId(),
      displayName: name,
      email,
      createdAt: new Date().toISOString(),
    };
    const stored = JSON.parse(localStorage.getItem('mm_users') || '[]') as UserProfile[];
    stored.push(user);
    localStorage.setItem('mm_users', JSON.stringify(stored));
    setStoredUser(user);
    return user;
  }
  throw new Error('Firebase not configured');
}

export async function loginUser(email: string, _password: string): Promise<UserProfile> {
  if (isDemoMode) {
    if (email === DEMO_USER.email) {
      setStoredUser(DEMO_USER);
      return DEMO_USER;
    }
    const stored = JSON.parse(localStorage.getItem('mm_users') || '[]') as UserProfile[];
    const user = stored.find((u) => u.email === email);
    if (!user) throw new Error('No account found with that email address.');
    setStoredUser(user);
    return user;
  }
  throw new Error('Firebase not configured');
}

export async function logoutUser(): Promise<void> {
  setStoredUser(null);
}

export async function resetPassword(_email: string): Promise<void> {
  // Demo mode: simulate success
  return Promise.resolve();
}

export function onAuthChange(callback: AuthCallback): () => void {
  callbacks.push(callback);
  // Immediately call with current state
  if (typeof window !== 'undefined') {
    callback(getStoredUser());
  }
  return () => {
    const idx = callbacks.indexOf(callback);
    if (idx > -1) callbacks.splice(idx, 1);
  };
}

export function getCurrentUser(): UserProfile | null {
  return getStoredUser();
}
