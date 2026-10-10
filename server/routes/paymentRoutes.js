import { Router } from 'express';
import { verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Client signature verification requires authenticated customer
router.post('/verify', authenticate, verifyPayment);

// Razorpay webhook endpoint (requires raw body signature validation)
router.post('/webhook', handleWebhook);

export default router;
