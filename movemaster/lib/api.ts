/**
 * MoveMaster Pro — API Client
 *
 * Typed wrapper around the Node.js/Express backend.
 * Falls back gracefully to the existing localStorage demo mode
 * if NEXT_PUBLIC_API_URL is not set.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : null;

// ─── Token Management ─────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mm_access_token');
}

function setTokens(access: string, refresh: string): void {
  localStorage.setItem('mm_access_token', access);
  localStorage.setItem('mm_refresh_token', refresh);
}

function clearTokens(): void {
  localStorage.removeItem('mm_access_token');
  localStorage.removeItem('mm_refresh_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mm_refresh_token');
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  rawBody?: boolean;
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  if (!API_BASE) throw new Error('API_NOT_CONFIGURED');

  const { method = 'GET', body, auth = false, rawBody = false } = opts;

  const headers: Record<string, string> = {};

  if (!rawBody && body) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (rawBody ? (body as BodyInit) : JSON.stringify(body)) : undefined,
    credentials: 'include',
  });

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const retry = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });
      const retryData = await retry.json();
      if (!retry.ok) throw new Error(retryData.error ?? 'Request failed');
      return retryData.data as T;
    } else {
      clearTokens();
      throw new Error('Session expired. Please sign in again.');
    }
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data.data as T;
}

async function tryRefresh(): Promise<boolean> {
  const token = getRefreshToken();
  if (!token || !API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  displayName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export const authApi = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },

  async demoLogin(): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/demo', { method: 'POST' });
    setTokens(data.tokens.accessToken, data.tokens.refreshToken);
    return data;
  },

  async getMe(): Promise<AuthUser> {
    return apiFetch<AuthUser>('/auth/me', { auth: true });
  },

  async updateMe(payload: { displayName?: string; phone?: string; preferredCity?: string }): Promise<AuthUser> {
    return apiFetch<AuthUser>('/auth/me', { method: 'PATCH', body: payload, auth: true });
  },

  logout(): void {
    clearTokens();
  },
};

// ─── Quotes ───────────────────────────────────────────────────────────────────

export interface QuoteEstimate {
  estimatedHours: number;
  hourlyRate: number;
  basePrice: number;
  packingFee: number;
  storageFee: number;
  specialtyFee: number;
  floorFee: number;
  longDistanceFee: number;
  totalMin: number;
  totalMax: number;
  depositAmount: number;
}

export interface QuoteRecord {
  id: string;
  name: string;
  email: string;
  status: string;
  moveDate: string;
  moveSize: string;
  serviceType: string;
  originCity: string;
  destinationCity: string;
  estimatedPrice?: number;
  depositAmount?: number;
  depositPaid: boolean;
  createdAt: string;
}

export const quotesApi = {
  async estimate(input: {
    serviceType: string;
    moveSize: string;
    originCity?: string;
    destinationCity?: string;
    needsPacking?: boolean;
    needsStorage?: boolean;
    hasSpecialtyItems?: boolean;
    hasElevator?: boolean;
    floorOrigin?: number;
    floorDestination?: number;
  }): Promise<QuoteEstimate> {
    return apiFetch<QuoteEstimate>('/quotes/estimate', {
      method: 'POST',
      body: {
        needsPacking: false,
        needsStorage: false,
        hasSpecialtyItems: false,
        hasElevator: true,
        floorOrigin: 1,
        floorDestination: 1,
        originCity: '',
        destinationCity: '',
        ...input,
      },
    });
  },

  async submit(payload: Record<string, unknown>): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>('/quotes', {
      method: 'POST',
      body: payload,
      auth: true,
    });
  },

  async getMine(): Promise<QuoteRecord[]> {
    return apiFetch<QuoteRecord[]>('/quotes/mine', { auth: true });
  },

  async getOne(id: string): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>(`/quotes/${id}`, { auth: true });
  },

  async getAll(filters?: { status?: string; city?: string; serviceType?: string }): Promise<QuoteRecord[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.city) params.set('city', filters.city);
    if (filters?.serviceType) params.set('serviceType', filters.serviceType);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiFetch<QuoteRecord[]>(`/quotes${qs}`, { auth: true });
  },

  async updateStatus(id: string, status: string): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>(`/quotes/${id}/status`, {
      method: 'PATCH',
      body: { status },
      auth: true,
    });
  },

  async confirmDeposit(id: string, stripePaymentIntentId?: string): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>(`/quotes/${id}/confirm-deposit`, {
      method: 'POST',
      body: { stripePaymentIntentId },
      auth: true,
    });
  },
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsApi = {
  async createIntent(quoteId: string): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
  }> {
    return apiFetch('/payments/intent', {
      method: 'POST',
      body: { quoteId },
      auth: true,
    });
  },
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactApi = {
  async submit(payload: {
    name: string;
    email: string;
    phone?: string;
    serviceType?: string;
    message: string;
  }): Promise<{ id: string }> {
    return apiFetch('/contact', { method: 'POST', body: payload });
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  async getStats(): Promise<Record<string, unknown>> {
    return apiFetch('/admin/stats', { auth: true });
  },

  async getUsers(): Promise<AuthUser[]> {
    return apiFetch<AuthUser[]>('/admin/users', { auth: true });
  },
};

// ─── Health Check ─────────────────────────────────────────────────────────────

export async function checkApiHealth(): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const res = await fetch(API_BASE.replace('/api/v1', '/health'));
    return res.ok;
  } catch {
    return false;
  }
}

export const isApiEnabled = !!API_BASE;
