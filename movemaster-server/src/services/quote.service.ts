import { store } from './store';
import { calculateQuote } from '../utils/pricing';
import { generateQuoteId } from '../utils/id';
import { sendQuoteConfirmation, sendAdminQuoteAlert, sendBookingConfirmation } from './email';
import { generateBookingId } from '../utils/id';
import type { QuoteRequest, QuoteInput, BookingStatus, QuoteResult } from '../models/types';

export interface CreateQuotePayload {
  name: string;
  email: string;
  phone: string;
  moveDate: string;
  moveSize: QuoteRequest['moveSize'];
  serviceType: QuoteRequest['serviceType'];
  originAddress: string;
  originCity: string;
  destinationAddress: string;
  destinationCity: string;
  needsPacking: boolean;
  needsStorage: boolean;
  hasSpecialtyItems: boolean;
  specialtyDetails?: string;
  floorOrigin?: number;
  floorDestination?: number;
  hasElevator: boolean;
  notes?: string;
  hearAboutUs?: string;
  uid?: string;
}

// ─── Create quote ─────────────────────────────────────────────────────────────

export async function createQuote(payload: CreateQuotePayload): Promise<QuoteRequest> {
  const quoteInput: QuoteInput = {
    serviceType: payload.serviceType,
    moveSize: payload.moveSize,
    originCity: payload.originCity,
    destinationCity: payload.destinationCity,
    needsPacking: payload.needsPacking,
    needsStorage: payload.needsStorage,
    hasSpecialtyItems: payload.hasSpecialtyItems,
    floorOrigin: payload.floorOrigin ?? 1,
    floorDestination: payload.floorDestination ?? 1,
    hasElevator: payload.hasElevator,
  };

  const estimate: QuoteResult = calculateQuote(quoteInput);
  const now = new Date().toISOString();

  const quote: QuoteRequest = {
    id: generateQuoteId(),
    uid: payload.uid,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    moveDate: payload.moveDate,
    moveSize: payload.moveSize,
    serviceType: payload.serviceType,
    originAddress: payload.originAddress,
    originCity: payload.originCity,
    destinationAddress: payload.destinationAddress,
    destinationCity: payload.destinationCity,
    needsPacking: payload.needsPacking,
    needsStorage: payload.needsStorage,
    hasSpecialtyItems: payload.hasSpecialtyItems,
    specialtyDetails: payload.specialtyDetails,
    floorOrigin: payload.floorOrigin ?? 1,
    floorDestination: payload.floorDestination ?? 1,
    hasElevator: payload.hasElevator,
    notes: payload.notes,
    hearAboutUs: payload.hearAboutUs,
    status: 'pending',
    depositPaid: false,
    estimatedHours: estimate.estimatedHours,
    estimatedPrice: estimate.totalMin,
    depositAmount: estimate.depositAmount,
    createdAt: now,
    updatedAt: now,
  };

  store.createQuote(quote);

  // Send emails (non-blocking — don't fail the request if email fails)
  Promise.all([
    sendQuoteConfirmation(quote),
    sendAdminQuoteAlert(quote),
  ]).catch((err) => console.error('Email send failed:', err));

  return quote;
}

// ─── Get quote ────────────────────────────────────────────────────────────────

export function getQuote(id: string): QuoteRequest | null {
  return store.getQuote(id) ?? null;
}

// ─── Get all quotes ───────────────────────────────────────────────────────────

export function getAllQuotes(filters?: {
  status?: BookingStatus;
  city?: string;
  serviceType?: string;
}): QuoteRequest[] {
  let quotes = store.getAllQuotes();

  if (filters?.status) quotes = quotes.filter((q) => q.status === filters.status);
  if (filters?.city) {
    quotes = quotes.filter(
      (q) => q.originCity === filters.city || q.destinationCity === filters.city
    );
  }
  if (filters?.serviceType) {
    quotes = quotes.filter((q) => q.serviceType === filters.serviceType);
  }

  return quotes;
}

// ─── Get user quotes ──────────────────────────────────────────────────────────

export function getUserQuotes(uid: string): QuoteRequest[] {
  return store.getQuotesByUser(uid);
}

// ─── Update status ────────────────────────────────────────────────────────────

export function updateQuoteStatus(id: string, status: BookingStatus): QuoteRequest | null {
  return store.updateQuote(id, { status });
}

// ─── Confirm deposit ──────────────────────────────────────────────────────────

export async function confirmDeposit(
  id: string,
  stripePaymentIntentId?: string
): Promise<QuoteRequest | null> {
  const quote = store.updateQuote(id, {
    depositPaid: true,
    status: 'confirmed',
    stripePaymentIntentId,
  });

  if (quote) {
    const bookingRef = generateBookingId();
    sendBookingConfirmation(quote, bookingRef).catch((err) =>
      console.error('Booking confirmation email failed:', err)
    );
  }

  return quote;
}

// ─── Estimate only (no save) ──────────────────────────────────────────────────

export function estimateQuote(input: QuoteInput): QuoteResult {
  return calculateQuote(input);
}
