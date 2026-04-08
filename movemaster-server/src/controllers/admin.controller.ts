import { Request, Response } from 'express';
import { store } from '../services/store';
import { getAllQuotes } from '../services/quote.service';
import { ok } from '../utils/response';

// ─── GET /admin/stats ─────────────────────────────────────────────────────────

export async function getStats(req: Request, res: Response): Promise<void> {
  const quotes = getAllQuotes();
  const users = store.getAllUsers();
  const messages = store.getAllMessages();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const stats = {
    quotes: {
      total: quotes.length,
      pending: quotes.filter((q) => q.status === 'pending').length,
      confirmed: quotes.filter((q) => q.status === 'confirmed').length,
      inProgress: quotes.filter((q) => q.status === 'in-progress').length,
      completed: quotes.filter((q) => q.status === 'completed').length,
      cancelled: quotes.filter((q) => q.status === 'cancelled').length,
      today: quotes.filter((q) => q.createdAt >= todayStart).length,
      thisMonth: quotes.filter((q) => q.createdAt >= monthStart).length,
    },
    revenue: {
      depositsCollected: quotes
        .filter((q) => q.depositPaid)
        .reduce((sum, q) => sum + (q.depositAmount ?? 0), 0),
      estimatedPipeline: quotes
        .filter((q) => q.status !== 'cancelled')
        .reduce((sum, q) => sum + (q.estimatedPrice ?? 0), 0),
      thisMonth: quotes
        .filter((q) => q.depositPaid && q.createdAt >= monthStart)
        .reduce((sum, q) => sum + (q.depositAmount ?? 0), 0),
    },
    users: {
      total: users.length,
      customers: users.filter((u) => u.role === 'customer').length,
      admins: users.filter((u) => u.role === 'admin').length,
    },
    messages: {
      total: messages.length,
      unread: messages.filter((m) => !m.read).length,
    },
    serviceBreakdown: (['residential', 'commercial', 'long-distance', 'packing', 'storage', 'specialty', 'last-minute', 'senior'] as const).map((type) => ({
      type,
      count: quotes.filter((q) => q.serviceType === type).length,
    })),
    cityBreakdown: (() => {
      const counts: Record<string, number> = {};
      quotes.forEach((q) => {
        counts[q.originCity] = (counts[q.originCity] ?? 0) + 1;
        counts[q.destinationCity] = (counts[q.destinationCity] ?? 0) + 1;
      });
      return Object.entries(counts)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    })(),
  };

  ok(res, stats);
}

// ─── GET /admin/users ─────────────────────────────────────────────────────────

export async function listUsers(req: Request, res: Response): Promise<void> {
  const users = store.getAllUsers().map((u) => ({
    uid: u.uid,
    displayName: u.displayName,
    email: u.email,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }));
  ok(res, users);
}
