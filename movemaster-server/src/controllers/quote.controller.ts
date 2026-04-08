import { Request, Response } from 'express';
import { body, query, param } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import {
  createQuote,
  getQuote,
  getAllQuotes,
  getUserQuotes,
  updateQuoteStatus,
  confirmDeposit,
  estimateQuote,
} from '../services/quote.service';
import { ok, created, notFound, badRequest, forbidden } from '../utils/response';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { BookingStatus, MoveSize, ServiceType, QuoteInput } from '../models/types';

// ─── Validation ───────────────────────────────────────────────────────────────

const VALID_SERVICE_TYPES: ServiceType[] = [
  'residential', 'commercial', 'long-distance', 'packing',
  'storage', 'specialty', 'last-minute', 'senior',
];
const VALID_MOVE_SIZES: MoveSize[] = [
  'studio', '1-bedroom', '2-bedroom', '3-bedroom', '4-bedroom',
  'office-small', 'office-large',
];
const VALID_STATUSES: BookingStatus[] = [
  'pending', 'confirmed', 'in-progress', 'completed', 'cancelled',
];

export const createQuoteValidation = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').trim().isLength({ min: 7, max: 20 }).withMessage('Valid phone number required'),
  body('moveDate').notEmpty().withMessage('Move date is required'),
  body('moveSize').isIn(VALID_MOVE_SIZES).withMessage('Invalid move size'),
  body('serviceType').isIn(VALID_SERVICE_TYPES).withMessage('Invalid service type'),
  body('originCity').trim().notEmpty().withMessage('Origin city is required'),
  body('destinationCity').trim().notEmpty().withMessage('Destination city is required'),
  body('originAddress').trim().optional(),
  body('destinationAddress').trim().optional(),
  body('needsPacking').isBoolean().withMessage('needsPacking must be boolean'),
  body('needsStorage').isBoolean().withMessage('needsStorage must be boolean'),
  body('hasSpecialtyItems').isBoolean().withMessage('hasSpecialtyItems must be boolean'),
  body('hasElevator').isBoolean().withMessage('hasElevator must be boolean'),
  body('floorOrigin').optional().isInt({ min: 1, max: 100 }),
  body('floorDestination').optional().isInt({ min: 1, max: 100 }),
  body('notes').optional().trim().isLength({ max: 1000 }),
  validate,
];

export const estimateValidation = [
  body('serviceType').isIn(VALID_SERVICE_TYPES).withMessage('Invalid service type'),
  body('moveSize').isIn(VALID_MOVE_SIZES).withMessage('Invalid move size'),
  body('originCity').trim().notEmpty().withMessage('Origin city is required'),
  body('destinationCity').trim().notEmpty().withMessage('Destination city is required'),
  body('needsPacking').isBoolean(),
  body('needsStorage').isBoolean(),
  body('hasSpecialtyItems').isBoolean(),
  body('hasElevator').isBoolean(),
  validate,
];

// ─── POST /quotes ─────────────────────────────────────────────────────────────

export async function submitQuote(req: AuthRequest, res: Response): Promise<void> {
  const quote = await createQuote({ ...req.body, uid: req.user?.uid });
  created(res, quote, 'Quote submitted successfully. We will call you within 2 hours.');
}

// ─── POST /quotes/estimate ────────────────────────────────────────────────────

export async function getEstimate(req: Request, res: Response): Promise<void> {
  const input: QuoteInput = {
    serviceType: req.body.serviceType,
    moveSize: req.body.moveSize,
    originCity: req.body.originCity ?? '',
    destinationCity: req.body.destinationCity ?? '',
    needsPacking: req.body.needsPacking ?? false,
    needsStorage: req.body.needsStorage ?? false,
    hasSpecialtyItems: req.body.hasSpecialtyItems ?? false,
    floorOrigin: req.body.floorOrigin ?? 1,
    floorDestination: req.body.floorDestination ?? 1,
    hasElevator: req.body.hasElevator ?? true,
  };
  ok(res, estimateQuote(input));
}

// ─── GET /quotes — admin only ─────────────────────────────────────────────────

export async function listAllQuotes(req: Request, res: Response): Promise<void> {
  const { status, city, serviceType } = req.query as {
    status?: BookingStatus;
    city?: string;
    serviceType?: string;
  };
  const quotes = getAllQuotes({ status, city, serviceType });
  ok(res, quotes);
}

// ─── GET /quotes/mine — authenticated user ────────────────────────────────────

export async function listMyQuotes(req: AuthRequest, res: Response): Promise<void> {
  const quotes = getUserQuotes(req.user!.uid);
  ok(res, quotes);
}

// ─── GET /quotes/:id ──────────────────────────────────────────────────────────

export async function getOneQuote(req: AuthRequest, res: Response): Promise<void> {
  const quote = getQuote(req.params.id);
  if (!quote) { notFound(res, 'Quote not found'); return; }

  // Non-admins can only see their own quotes
  if (req.user?.role !== 'admin' && quote.uid && quote.uid !== req.user?.uid) {
    forbidden(res, 'You do not have access to this quote');
    return;
  }

  ok(res, quote);
}

// ─── PATCH /quotes/:id/status — admin only ────────────────────────────────────

export async function patchQuoteStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body as { status?: string };
  if (!status || !VALID_STATUSES.includes(status as BookingStatus)) {
    badRequest(res, `status must be one of: ${VALID_STATUSES.join(', ')}`);
    return;
  }
  const updated = updateQuoteStatus(req.params.id, status as BookingStatus);
  if (!updated) { notFound(res, 'Quote not found'); return; }
  ok(res, updated, 'Status updated');
}

// ─── POST /quotes/:id/confirm-deposit ────────────────────────────────────────

export async function confirmQuoteDeposit(req: Request, res: Response): Promise<void> {
  const { stripePaymentIntentId } = req.body as { stripePaymentIntentId?: string };
  const updated = await confirmDeposit(req.params.id, stripePaymentIntentId);
  if (!updated) { notFound(res, 'Quote not found'); return; }
  ok(res, updated, 'Deposit confirmed. Booking is locked in.');
}
