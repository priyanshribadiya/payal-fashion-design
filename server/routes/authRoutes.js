import { Router } from 'express';
import {
  register,
  verifyRegistrationOtp,
  login,
  resendOtp,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/verify-otp', authLimiter, verifyRegistrationOtp);
router.post('/login', authLimiter, login);
router.post('/resend-otp', otpLimiter, resendOtp);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', authenticate, getMe);

export default router;
