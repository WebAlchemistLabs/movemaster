import { Router } from 'express';
import {
  submitQuote, createQuoteValidation,
  getEstimate, estimateValidation,
  listAllQuotes,
  listMyQuotes,
  getOneQuote,
  patchQuoteStatus,
  confirmQuoteDeposit,
} from '../controllers/quote.controller';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.middleware';
import { quoteLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public — estimate only (no save)
router.post('/estimate', estimateValidation, getEstimate);

// Submit quote — open to public, but attaches user if authenticated
router.post('/', quoteLimiter, optionalAuth, createQuoteValidation, submitQuote);

// Authenticated customer
router.get('/mine', authenticate, listMyQuotes);
router.get('/:id', authenticate, getOneQuote);
router.post('/:id/confirm-deposit', authenticate, confirmQuoteDeposit);

// Admin only
router.get('/', authenticate, requireAdmin, listAllQuotes);
router.patch('/:id/status', authenticate, requireAdmin, patchQuoteStatus);

export default router;
