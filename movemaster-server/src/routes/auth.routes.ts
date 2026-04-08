import { Router } from 'express';
import {
  register, registerValidation,
  login, loginValidation,
  refresh,
  getMe,
  updateMe,
  demoLogin,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public
router.post('/register', authLimiter, registerValidation, register);
router.post('/login',    authLimiter, loginValidation,    login);
router.post('/refresh',  authLimiter, refresh);
router.post('/demo',     authLimiter, demoLogin);

// Protected
router.get('/me',  authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
