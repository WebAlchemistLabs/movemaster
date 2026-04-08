import type { QuoteRequest, UserProfile, BookingStatus } from '@/types';
import { generateId } from '@/lib/utils';

function getQuotes(): QuoteRequest[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('mm_quotes') || '[]'); } catch { return []; }
}

function saveQuotes(quotes: QuoteRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mm_quotes', JSON.stringify(quotes));
}

export async function createQuoteRequest(data: Omit<QuoteRequest, 'id' | 'createdAt' | 'status' | 'depositPaid'>): Promise<QuoteRequest> {
  const quote: QuoteRequest = {
    ...data,
    id: 'QR-' + generateId(),
    status: 'pending',
    depositPaid: false,
    createdAt: new Date().toISOString(),
  };
  const quotes = getQuotes();
  quotes.unshift(quote);
  saveQuotes(quotes);
  return quote;
}

export async function getUserQuotes(uid: string): Promise<QuoteRequest[]> {
  const quotes = getQuotes();
  return quotes.filter((q) => (q as QuoteRequest & { uid?: string }).uid === uid || uid === 'demo-user-001');
}

export async function getAllQuotes(): Promise<QuoteRequest[]> {
  return getQuotes();
}

export async function updateQuoteStatus(id: string, status: BookingStatus): Promise<void> {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === id);
  if (idx > -1) {
    quotes[idx] = { ...quotes[idx], status };
    saveQuotes(quotes);
  }
}

export async function markDepositPaid(id: string): Promise<void> {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === id);
  if (idx > -1) {
    quotes[idx] = { ...quotes[idx], depositPaid: true, status: 'confirmed' };
    saveQuotes(quotes);
  }
}

export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    displayName: data.displayName ?? '',
    email: data.email ?? '',
    phone: data.phone,
    preferredCity: data.preferredCity,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    const profiles = JSON.parse(localStorage.getItem('mm_profiles') || '{}');
    profiles[uid] = profile;
    localStorage.setItem('mm_profiles', JSON.stringify(profiles));
  }
  return profile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null;
  try {
    const profiles = JSON.parse(localStorage.getItem('mm_profiles') || '{}');
    return profiles[uid] ?? null;
  } catch { return null; }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (typeof window === 'undefined') return;
  const profiles = JSON.parse(localStorage.getItem('mm_profiles') || '{}');
  profiles[uid] = { ...(profiles[uid] ?? {}), ...data };
  localStorage.setItem('mm_profiles', JSON.stringify(profiles));
}
