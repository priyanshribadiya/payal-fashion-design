import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import {
  verifyGatewayPaymentSignature,
  verifyGatewayWebhookSignature,
} from '../services/razorpayService.js';
import { rollbackReservedStock } from '../services/inventoryService.js';

/**
 * Verify payment signature received from client Razorpay checkout modal
 */
export async function verifyPayment(req, res, next) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay payment credentials.',
      });
    }

    // Cryptographic signature check
    const isValidSignature = verifyGatewayPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid gateway signature.',
      });
    }

    // Locate matching order and payment records
    const order = await Order.findOne({
      $or: [{ _id: orderId }, { razorpayOrderId }],
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Matching order not found.' });
    }

    const payment = await Payment.findOne({ razorpayOrderId });

    // Mark as paid idempotently
    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    if (payment) {
      payment.status = 'captured';
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      await payment.save();
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully! Thank you for your order.',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmountINR: order.totalAmountInPaise / 100,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Idempotent Razorpay Webhook Handler
 */
export async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const isValid = verifyGatewayWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[Webhook] Invalid signature received.');
      return res.status(400).json({ status: 'invalid_signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Webhook] Event received: ${event}`);

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;
      const rzpPaymentId = paymentEntity.id;

      const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
      if (order && order.status === 'pending_payment') {
        order.status = 'paid';
        order.razorpayPaymentId = rzpPaymentId;
        await order.save();
      }

      await Payment.findOneAndUpdate(
        { razorpayOrderId: rzpOrderId },
        { status: 'captured', razorpayPaymentId: rzpPaymentId }
      );
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;

      const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
      if (order && order.status === 'pending_payment') {
        // Rollback stock if payment definitely failed
        const itemsToRestore = order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }));
        await rollbackReservedStock(itemsToRestore);

        order.status = 'cancelled';
        order.cancellationReason = 'Payment failed at gateway';
        await order.save();
      }

      await Payment.findOneAndUpdate(
        { razorpayOrderId: rzpOrderId },
        {
          status: 'failed',
          failureReason: paymentEntity.error_description || 'Payment failed',
        }
      );
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook] Error handling event:', error.message);
    return res.status(500).json({ status: 'error' });
  }
}
