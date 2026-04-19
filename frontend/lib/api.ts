/**
 * MoveMaster Pro — API Client
 * Connects to the Node.js/Express backend at NEXT_PUBLIC_API_URL.
 * Falls back to localStorage demo mode when API URL is not set.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : null;

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

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  if (!API_BASE) throw new Error('API_NOT_CONFIGURED');
  const { method = 'GET', body, auth = false } = opts;
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  if (res.status === 401 && auth) {
    const ok = await tryRefresh();
    if (ok) {
      const t = getToken();
      if (t) headers['Authorization'] = `Bearer ${t}`;
      const r2 = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: 'include' });
      const d2 = await r2.json();
      if (!r2.ok) throw new Error(d2.error ?? 'Request failed');
      return d2.data as T;
    }
    clearTokens();
    throw new Error('Session expired. Please sign in again.');
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
  } catch { return false; }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser { uid: string; displayName: string; email: string; role: string; }
export interface AuthResponse { user: AuthUser; tokens: { accessToken: string; refreshToken: string; expiresIn: number }; }

export const authApi = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const d = await apiFetch<AuthResponse>('/auth/register', { method:'POST', body:{name,email,password} });
    setTokens(d.tokens.accessToken, d.tokens.refreshToken); return d;
  },
  async login(email: string, password: string): Promise<AuthResponse> {
    const d = await apiFetch<AuthResponse>('/auth/login', { method:'POST', body:{email,password} });
    setTokens(d.tokens.accessToken, d.tokens.refreshToken); return d;
  },
  async demoLogin(): Promise<AuthResponse> {
    const d = await apiFetch<AuthResponse>('/auth/demo', { method:'POST' });
    setTokens(d.tokens.accessToken, d.tokens.refreshToken); return d;
  },
  async getMe(): Promise<AuthUser> { return apiFetch<AuthUser>('/auth/me', { auth:true }); },
  async updateMe(payload: { displayName?:string; phone?:string; preferredCity?:string }): Promise<AuthUser> {
    return apiFetch<AuthUser>('/auth/me', { method:'PATCH', body:payload, auth:true });
  },
  logout(): void { clearTokens(); },
};

// ─── Quotes ───────────────────────────────────────────────────────────────────
export interface QuoteRecord {
  id: string; name: string; email: string; phone: string; status: string;
  moveDate?: string; moveSize: string; serviceType: string;
  originCity: string; destinationCity: string;
  estimatedPrice?: number; depositAmount?: number; depositPaid: boolean;
  invoiceNumber?: string; assignedCrew?: string; notes?: string;
  createdAt: string; completedAt?: string;
}

export const quotesApi = {
  async estimate(input: Record<string, unknown>) {
    return apiFetch('/quotes/estimate', { method:'POST', body:{needsPacking:false,needsStorage:false,hasSpecialtyItems:false,hasElevator:true,floorOrigin:1,floorDestination:1,originCity:'',destinationCity:'',...input} });
  },
  async submit(payload: Record<string, unknown>): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>('/quotes', { method:'POST', body:payload, auth:true });
  },
  async getMine(): Promise<QuoteRecord[]> { return apiFetch<QuoteRecord[]>('/quotes/mine', { auth:true }); },
  async getOne(id: string): Promise<QuoteRecord> { return apiFetch<QuoteRecord>(`/quotes/${id}`, { auth:true }); },
  async getAll(filters?: { status?: string }): Promise<QuoteRecord[]> {
    const qs = filters?.status ? `?status=${filters.status}` : '';
    return apiFetch<QuoteRecord[]>(`/quotes${qs}`, { auth:true });
  },
  async updateStatus(id: string, status: string): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>(`/quotes/${id}/status`, { method:'PATCH', body:{status}, auth:true });
  },
  async confirmDeposit(id: string, stripePaymentIntentId?: string): Promise<QuoteRecord> {
    return apiFetch<QuoteRecord>(`/quotes/${id}/confirm-deposit`, { method:'POST', body:{stripePaymentIntentId}, auth:true });
  },
};

// ─── Bookkeeping API (Admin) — hits /bookkeeping/* endpoints ──────────────────
export interface DashboardStats {
  jobs: { total:number; pending:number; confirmed:number; inProgress:number; completed:number; cancelled:number; today:number; thisMonth:number; };
  revenue: { totalCollected:number; thisMonth:number; pipeline:number; };
  clients: number;
  unreadMessages: number;
  recentJobs: QuoteRecord[];
  upcoming: QuoteRecord[];
  serviceBreakdown: { type:string; count:number; revenue:number }[];
  cityBreakdown: { city:string; count:number }[];
}

export const bookkeepingApi = {
  async getDashboard(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>('/bookkeeping/dashboard', { auth:true });
  },
  async getJobs(filters?: { status?:string; city?:string; service?:string; search?:string }): Promise<QuoteRecord[]> {
    const p = new URLSearchParams();
    if (filters?.status)  p.set('status',  filters.status);
    if (filters?.city)    p.set('city',    filters.city);
    if (filters?.service) p.set('service', filters.service);
    if (filters?.search)  p.set('search',  filters.search);
    return apiFetch<QuoteRecord[]>(`/bookkeeping/jobs${p.toString()?`?${p}`:''}`, { auth:true });
  },
  async getJob(id: string) { return apiFetch(`/bookkeeping/jobs/${id}`, { auth:true }); },
  async updateJobStatus(id: string, status: string, extras?: Record<string,unknown>) {
    return apiFetch(`/bookkeeping/jobs/${id}/status`, { method:'PATCH', body:{status,...extras}, auth:true });
  },
  async getClients(filters?: { search?:string; city?:string }) {
    const p = new URLSearchParams();
    if (filters?.search) p.set('search', filters.search);
    if (filters?.city)   p.set('city',   filters.city);
    return apiFetch(`/bookkeeping/clients${p.toString()?`?${p}`:''}`, { auth:true });
  },
  async getClient(id: string) { return apiFetch(`/bookkeeping/clients/${id}`, { auth:true }); },
  async getInvoices(filters?: { status?:string }) {
    return apiFetch(`/bookkeeping/invoices${filters?.status?`?status=${filters.status}`:''}`, { auth:true });
  },
  async getInvoice(id: string) { return apiFetch(`/bookkeeping/invoices/${id}`, { auth:true }); },
  async getTransactions(filters?: { type?:string }) {
    return apiFetch(`/bookkeeping/transactions${filters?.type?`?type=${filters.type}`:''}`, { auth:true });
  },
  async recordTransaction(payload: { jobId?:string; invoiceId?:string; clientId?:string; type:string; amount:number; method:string; description:string }) {
    return apiFetch('/bookkeeping/transactions', { method:'POST', body:payload, auth:true });
  },
  async getReport(year?: string) {
    return apiFetch(`/bookkeeping/report${year?`?year=${year}`:''}`, { auth:true });
  },
  async getMessages() { return apiFetch('/bookkeeping/messages', { auth:true }); },
  async markMessageRead(id: string) { return apiFetch(`/bookkeeping/messages/${id}/read`, { method:'PATCH', auth:true }); },
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactApi = {
  async submit(payload: { name:string; email:string; phone?:string; serviceType?:string; message:string }) {
    return apiFetch('/contact', { method:'POST', body:payload });
  },
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsApi = {
  async createIntent(quoteId: string) {
    return apiFetch('/payments/intent', { method:'POST', body:{quoteId}, auth:true });
  },
};

// ─── Health ───────────────────────────────────────────────────────────────────
export async function checkApiHealth(): Promise<boolean> {
  if (!API_BASE) return false;
  try { const r = await fetch(API_BASE.replace('/api/v1','/health')); return r.ok; }
  catch { return false; }
}

export const isApiEnabled = !!API_BASE;
