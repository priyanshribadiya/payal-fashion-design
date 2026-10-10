import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Address } from '../models/Address.js';
import { Payment } from '../models/Payment.js';
import { reserveStock, rollbackReservedStock } from '../services/inventoryService.js';
import { createGatewayOrder } from '../services/razorpayService.js';
import { ENV } from '../config/env.js';

/**
 * Generate human-readable boutique order number e.g. PFD-20261010-8F3A
 */
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `PFD-${dateStr}-${randomHex}`;
}

/**
 * Create Order & Initiate Gateway Payment
 */
export async function createOrder(req, res, next) {
  try {
    const userId = req.user._id;
    const { shippingAddress, addressId, customerNotes } = req.body;

    // Fetch user cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
    }

    // Resolve delivery address
    let deliveryAddress = shippingAddress;
    if (addressId) {
      const saved = await Address.findOne({ _id: addressId, user: userId });
      if (saved) {
        deliveryAddress = {
          recipientName: saved.recipientName,
          phone: saved.phone,
          streetAddress: saved.streetAddress,
          landmark: saved.landmark,
          city: saved.city,
          state: saved.state,
          pinCode: saved.pinCode,
        };
      }
    }

    if (!deliveryAddress || !deliveryAddress.recipientName || !deliveryAddress.phone || !deliveryAddress.streetAddress || !deliveryAddress.pinCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address with recipient name, phone, address, and PIN code is required.',
      });
    }

    // Build items snapshot and compute authoritative price in Paise
    const itemsSnapshot = [];
    const stockReserveItems = [];
    let subtotalInPaise = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Item "${product?.name || 'Selected product'}" is no longer available.`,
        });
      }

      if (product.inventoryQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.inventoryQuantity} left in stock.`,
        });
      }

      const unitPrice = product.discountedPriceInPaise || product.priceInPaise;
      subtotalInPaise += unitPrice * item.quantity;

      itemsSnapshot.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        priceInPaise: unitPrice,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        image: product.images[0] || '',
      });

      stockReserveItems.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }

    // Concurrency-safe atomic inventory reservation
    const reservation = await reserveStock(stockReserveItems);
    if (!reservation.success) {
      return res.status(400).json({
        success: false,
        message: 'Some items in your cart were just purchased by other customers. Please review your cart.',
      });
    }

    // Calculate shipping (Free over ₹1,999, else ₹150)
    const shippingChargeInPaise = subtotalInPaise >= 199900 ? 0 : 15000;
    const totalAmountInPaise = subtotalInPaise + shippingChargeInPaise;

    const orderNumber = generateOrderNumber();

    // Create Razorpay Gateway Order
    const gatewayOrder = await createGatewayOrder(totalAmountInPaise, orderNumber);

    // Persist Order in database
    const order = await Order.create({
      orderNumber,
      user: userId,
      items: itemsSnapshot,
      shippingAddress: deliveryAddress,
      subtotalInPaise,
      shippingChargeInPaise,
      discountInPaise: 0,
      totalAmountInPaise,
      status: 'pending_payment',
      paymentMethod: 'razorpay',
      razorpayOrderId: gatewayOrder.id,
      customerNotes: customerNotes || '',
    });

    // Create Initial Payment Record
    await Payment.create({
      order: order._id,
      user: userId,
      amountInPaise: totalAmountInPaise,
      currency: 'INR',
      razorpayOrderId: gatewayOrder.id,
      status: 'created',
      rawGatewayResponse: gatewayOrder,
    });

    // Clear customer cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order initiated. Please complete payment.',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmountINR: order.totalAmountInPaise / 100,
        subtotalINR: order.subtotalInPaise / 100,
        shippingINR: order.shippingChargeInPaise / 100,
        status: order.status,
      },
      razorpay: {
        key: ENV.RAZORPAY_KEY_ID,
        amount: totalAmountInPaise,
        currency: 'INR',
        orderId: gatewayOrder.id,
        storeName: ENV.STORE_BRAND_NAME,
        customerName: req.user.name,
        customerEmail: req.user.email,
        customerPhone: req.user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get past orders for logged in customer
 */
export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map(o => ({
      ...o,
      totalAmountINR: o.totalAmountInPaise / 100,
      subtotalINR: o.subtotalInPaise / 100,
      shippingINR: o.shippingChargeInPaise / 100,
    }));

    return res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
}

/**
 * Get individual order details by ID
 */
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const payment = await Payment.findOne({ order: order._id }).lean();

    return res.json({
      success: true,
      order: {
        ...order,
        totalAmountINR: order.totalAmountInPaise / 100,
        subtotalINR: order.subtotalInPaise / 100,
        shippingINR: order.shippingChargeInPaise / 100,
        paymentStatus: payment?.status || 'pending',
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel an order and restore inventory
 */
export async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status}.`,
      });
    }

    // Rollback reserved stock
    const itemsToRestore = order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    await rollbackReservedStock(itemsToRestore);

    order.status = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by customer';
    await order.save();

    return res.json({
      success: true,
      message: 'Order has been cancelled and inventory released.',
      order,
    });
  } catch (error) {
    next(error);
  }
}
