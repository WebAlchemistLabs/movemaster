import { Router } from 'express';
import {
  submitContact, contactValidation,
  listMessages,
  markRead,
} from '../controllers/contact.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { quoteLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public
router.post('/', quoteLimiter, contactValidation, submitContact);

// Admin only
router.get('/messages', authenticate, requireAdmin, listMessages);
router.patch('/messages/:id/read', authenticate, requireAdmin, markRead);

export default router;
