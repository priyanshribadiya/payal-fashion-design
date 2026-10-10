import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import {
  verifyGatewayPaymentSignature,
  verifyGatewayWebhookSignature,
} from '../services/razorpayService.js';
import { ENV } from '../config/env.js';

test('Razorpay: Cryptographic HMAC SHA256 payment signature verification', () => {
  const orderId = 'order_DAv5348924';
  const paymentId = 'pay_2938472938';
  const secret = ENV.RAZORPAY_KEY_SECRET;

  const validSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = verifyGatewayPaymentSignature(orderId, paymentId, validSignature);
  assert.equal(isValid, true);

  const isInvalid = verifyGatewayPaymentSignature(orderId, paymentId, 'tampered_fake_signature');
  assert.equal(isInvalid, false);
});

test('Razorpay: Raw body webhook signature verification', () => {
  const rawBody = JSON.stringify({
    event: 'payment.captured',
    payload: { payment: { entity: { id: 'pay_123', order_id: 'order_123' } } },
  });

  const validSignature = crypto
    .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  assert.equal(verifyGatewayWebhookSignature(rawBody, validSignature), true);
  assert.equal(verifyGatewayWebhookSignature(rawBody, 'invalid_sig'), false);
});
