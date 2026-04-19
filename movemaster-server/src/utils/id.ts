import { v4 as uuidv4 } from 'uuid';
export const generateId   = () => uuidv4();
export const shortId      = () => Math.random().toString(36).substring(2, 9).toUpperCase();
export const generateQuoteId = () => `QR-${shortId()}`;
export const generateInvNum  = () => `INV-${new Date().getFullYear()}-${shortId()}`;
