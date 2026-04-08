import { Request, Response } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { store } from '../services/store';
import { sendContactConfirmation } from '../services/email';
import { generateId } from '../utils/id';
import { ok, created, notFound } from '../utils/response';
import type { AuthRequest } from '../middleware/auth.middleware';
import type { ContactMessage } from '../models/types';

export const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().trim(),
  body('serviceType').optional().trim(),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters'),
  validate,
];

// ─── POST /contact ────────────────────────────────────────────────────────────

export async function submitContact(req: Request, res: Response): Promise<void> {
  const { name, email, phone, serviceType, message } = req.body as {
    name: string;
    email: string;
    phone?: string;
    serviceType?: string;
    message: string;
  };

  const msg: ContactMessage = {
    id: generateId(),
    name,
    email,
    phone,
    serviceType,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };

  store.createMessage(msg);

  // Fire-and-forget emails
  sendContactConfirmation(msg).catch((err) =>
    console.error('Contact email failed:', err)
  );

  created(res, { id: msg.id }, 'Message received. We will get back to you within 24 hours.');
}

// ─── GET /contact/messages — admin only ──────────────────────────────────────

export async function listMessages(req: AuthRequest, res: Response): Promise<void> {
  const messages = store.getAllMessages();
  ok(res, messages);
}

// ─── PATCH /contact/messages/:id/read — admin only ───────────────────────────

export async function markRead(req: Request, res: Response): Promise<void> {
  const success = store.markMessageRead(req.params.id);
  if (!success) { notFound(res, 'Message not found'); return; }
  ok(res, { id: req.params.id, read: true });
}
