import { env } from '../config/env';
import type { PaymentIntentResponse } from '../models/types';

// Stripe is loaded lazily so the server starts fine without keys
let stripeClient: import('stripe').default | null = null;

async function getStripe(): Promise<import('stripe').default | null> {
  if (!env.stripe.secretKey) return null;
  if (stripeClient) return stripeClient;

  const Stripe = (await import('stripe')).default;
  stripeClient = new Stripe(env.stripe.secretKey, { apiVersion: '2024-04-10' });
  return stripeClient;
}

// ─── Create payment intent for quote deposit ──────────────────────────────────

export async function createDepositPaymentIntent(
  quoteId: string,
  depositAmount: number,
  customerEmail: string,
  customerName: string
): Promise<PaymentIntentResponse> {
  const stripe = await getStripe();

  if (!stripe) {
    // Demo mode — return a fake client secret
    return {
      clientSecret: `demo_pi_${quoteId}_secret_demo`,
      paymentIntentId: `demo_pi_${quoteId}`,
      amount: depositAmount,
      currency: 'cad',
    };
  }

  const amountCents = Math.round(depositAmount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'cad',
    receipt_email: customerEmail,
    metadata: {
      quoteId,
      customerName,
      source: 'movemaster-pro',
    },
    description: `MoveMaster Pro deposit — Quote ${quoteId}`,
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    amount: depositAmount,
    currency: 'cad',
  };
}

// ─── Verify webhook signature ─────────────────────────────────────────────────

export async function constructWebhookEvent(
  payload: Buffer,
  signature: string
): Promise<import('stripe').default.Event | null> {
  const stripe = await getStripe();
  if (!stripe || !env.stripe.webhookSecret) return null;

  try {
    return stripe.webhooks.constructEvent(payload, signature, env.stripe.webhookSecret);
  } catch {
    return null;
  }
}

// ─── Retrieve payment intent ──────────────────────────────────────────────────

export async function getPaymentIntent(
  paymentIntentId: string
): Promise<{ paid: boolean; amount: number } | null> {
  const stripe = await getStripe();
  if (!stripe) return { paid: true, amount: 0 }; // demo

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      paid: pi.status === 'succeeded',
      amount: pi.amount / 100,
    };
  } catch {
    return null;
  }
}
