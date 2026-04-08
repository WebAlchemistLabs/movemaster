import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function generateQuoteId(): string {
  return `QR-${generateShortId()}`;
}

export function generateBookingId(): string {
  return `BK-${generateShortId()}`;
}
