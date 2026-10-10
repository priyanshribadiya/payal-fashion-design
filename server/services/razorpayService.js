import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ENV } from '../config/env.js';

let razorpayInstance = null;

/**
 * Returns an initialized Razorpay instance or a safe mock instance in test mode.
 */
export function getRazorpayClient() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * Creates a Razorpay Order.
 * @param {number} amountInPaise - Order total in integer paise (e.g. 285000 for ₹2,850.00)
 * @param {string} receiptId - Unique internal order identifier
 */
export async function createGatewayOrder(amountInPaise, receiptId) {
  // If operating with mock/test keys, generate a valid structured gateway order object
  if (ENV.RAZORPAY_KEY_ID.includes('placeholder') || ENV.RAZORPAY_KEY_ID.includes('mock')) {
    const mockOrderId = `order_mock_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    return {
      id: mockOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      status: 'created',
      attempts: 0,
      notes: { store: 'Payal Fashion Design' },
      created_at: Math.floor(Date.now() / 1000),
    };
  }

  const razorpay = getRazorpayClient();
  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: receiptId,
    notes: {
      store: ENV.STORE_BRAND_NAME,
    },
  };

  return razorpay.orders.create(options);
}

/**
 * Verifies payment signature returned by Razorpay client checkout modal.
 * HMAC SHA256 (order_id + "|" + payment_id, key_secret)
 */
export function verifyGatewayPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  // In development mock mode, permit valid mock signatures
  if (ENV.RAZORPAY_KEY_SECRET.includes('mock') || ENV.RAZORPAY_KEY_SECRET.includes('placeholder')) {
    if (razorpaySignature && razorpaySignature.startsWith('mock_sig_')) {
      return true;
    }
  }

  const generatedSignature = crypto
    .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  return generatedSignature === razorpaySignature;
}

/**
 * Verifies webhook signature using the raw request body.
 */
export function verifyGatewayWebhookSignature(rawBody, webhookSignature) {
  if (!ENV.RAZORPAY_WEBHOOK_SECRET) return false;

  const expectedSignature = crypto
    .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === webhookSignature;
}
