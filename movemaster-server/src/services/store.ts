/**
 * In-memory data store used when Firebase is not configured (demo mode).
 * Data lives only for the server process lifetime — restart clears it.
 */

import type { QuoteRequest, User, ContactMessage } from '../models/types';

class InMemoryStore {
  private quotes: Map<string, QuoteRequest> = new Map();
  private users: Map<string, User> = new Map();
  private messages: Map<string, ContactMessage> = new Map();

  // ─── Quotes ───────────────────────────────────────────────

  createQuote(quote: QuoteRequest): QuoteRequest {
    this.quotes.set(quote.id, quote);
    return quote;
  }

  getQuote(id: string): QuoteRequest | undefined {
    return this.quotes.get(id);
  }

  getAllQuotes(): QuoteRequest[] {
    return Array.from(this.quotes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getQuotesByUser(uid: string): QuoteRequest[] {
    return Array.from(this.quotes.values()).filter((q) => q.uid === uid);
  }

  updateQuote(id: string, data: Partial<QuoteRequest>): QuoteRequest | null {
    const existing = this.quotes.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    this.quotes.set(id, updated);
    return updated;
  }

  deleteQuote(id: string): boolean {
    return this.quotes.delete(id);
  }

  // ─── Users ────────────────────────────────────────────────

  createUser(user: User): User {
    this.users.set(user.uid, user);
    return user;
  }

  getUser(uid: string): User | undefined {
    return this.users.get(uid);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(uid: string, data: Partial<User>): User | null {
    const existing = this.users.get(uid);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    this.users.set(uid, updated);
    return updated;
  }

  // ─── Contact Messages ─────────────────────────────────────

  createMessage(msg: ContactMessage): ContactMessage {
    this.messages.set(msg.id, msg);
    return msg;
  }

  getAllMessages(): ContactMessage[] {
    return Array.from(this.messages.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  markMessageRead(id: string): boolean {
    const msg = this.messages.get(id);
    if (!msg) return false;
    this.messages.set(id, { ...msg, read: true });
    return true;
  }
}

// Singleton — one store per server process
export const store = new InMemoryStore();
