import { Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { createDepositPaymentIntent, constructWebhookEvent } from '../services/stripe.service';
import { confirmDeposit, getQuote } from '../services/quote.service';
import { ok, badRequest, notFound, serverError } from '../utils/response';
import type { AuthRequest } from '../middleware/auth.middleware';

export const createIntentValidation = [
  body('quoteId').trim().notEmpty().withMessage('quoteId is required'),
  validate,
];

// ─── POST /payments/intent ────────────────────────────────────────────────────

export async function createPaymentIntent(req: AuthRequest, res: Response): Promise<void> {
  const { quoteId } = req.body as { quoteId: string };

  const quote = getQuote(quoteId);
  if (!quote) { notFound(res, 'Quote not found'); return; }
  if (quote.depositPaid) { badRequest(res, 'Deposit already paid for this quote'); return; }
  if (!quote.depositAmount || quote.depositAmount <= 0) {
    badRequest(res, 'Quote has no deposit amount calculated');
    return;
  }

  try {
    const intent = await createDepositPaymentIntent(
      quoteId,
      quote.depositAmount,
      quote.email,
      quote.name
    );
    ok(res, intent);
  } catch (err: unknown) {
    serverError(res, (err as Error).message);
  }
}

// ─── POST /payments/webhook ───────────────────────────────────────────────────
// Raw body required — configured in routes

export async function stripeWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];
  if (!sig || typeof sig !== 'string') {
    badRequest(res, 'Missing stripe-signature header');
    return;
  }

  const event = await constructWebhookEvent(req.body as Buffer, sig);
  if (!event) {
    badRequest(res, 'Invalid webhook signature');
    return;
  }

  // Handle payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as { id: string; metadata?: { quoteId?: string } };
    const quoteId = pi.metadata?.quoteId;
    if (quoteId) {
      await confirmDeposit(quoteId, pi.id);
      console.log(`[Stripe] Deposit confirmed for quote ${quoteId}`);
    }
  }

  // Always respond 200 to Stripe quickly
  ok(res, { received: true });
}
