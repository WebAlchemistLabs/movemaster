import { Router, raw } from 'express';
import {
  createPaymentIntent, createIntentValidation,
  stripeWebhook,
} from '../controllers/payment.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Create payment intent — optionally authenticated (guest checkout allowed)
router.post('/intent', optionalAuth, createIntentValidation, createPaymentIntent);

// Stripe webhook — MUST use raw body parser (not JSON)
router.post(
  '/webhook',
  raw({ type: 'application/json' }),
  stripeWebhook
);

export default router;
